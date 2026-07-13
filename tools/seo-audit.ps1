param(
  [string]$Destination = ".codex-build\seo-audit",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$buildRoot = [IO.Path]::GetFullPath((Join-Path $projectRoot ".codex-build"))
$destinationPath = if ([IO.Path]::IsPathRooted($Destination)) { [IO.Path]::GetFullPath($Destination) } else { [IO.Path]::GetFullPath((Join-Path $projectRoot $Destination)) }
$buildPrefix = $buildRoot.TrimEnd('\') + '\'
if (-not $destinationPath.StartsWith($buildPrefix, [StringComparison]::OrdinalIgnoreCase)) {
  throw "SEO audit destination must stay under $buildRoot. Refusing to write to $destinationPath."
}

$cachePath = Join-Path $buildRoot "hugo-cache"
New-Item -ItemType Directory -Force -Path $cachePath | Out-Null
$env:HUGO_CACHEDIR = $cachePath

if (-not $SkipBuild) {
  hugo --gc --minify --destination $destinationPath --cleanDestinationDir
  if ($LASTEXITCODE -ne 0) {
    throw "Hugo build failed with exit code $LASTEXITCODE."
  }
}

if (-not (Test-Path $destinationPath)) {
  throw "SEO audit destination does not exist: $destinationPath"
}

$root = Resolve-Path $destinationPath
$issues = New-Object System.Collections.Generic.List[object]

function Add-SeoIssue {
  param(
    [string]$Severity,
    [string]$File,
    [string]$Message
  )

  $issues.Add([pscustomobject]@{
    Severity = $Severity
    File = $File
    Message = $Message
  }) | Out-Null
}

function Get-MatchValue {
  param(
    [string]$Text,
    [string]$Pattern
  )

  $match = [regex]::Match($Text, $Pattern, [Text.RegularExpressions.RegexOptions]::Singleline)
  if ($match.Success) {
    return $match.Groups[1].Value.Trim()
  }

  return $null
}

function Get-AttributeValue {
  param(
    [string]$Tag,
    [string]$Attribute
  )

  $pattern = '(?i)(?:^|\s)' + [regex]::Escape($Attribute) + '\s*=\s*(?:"([^"]*)"|''([^'']*)''|([^\s>]+))'
  $match = [regex]::Match($Tag, $pattern)
  if (-not $match.Success) {
    return $null
  }

  foreach ($groupNumber in 1..3) {
    $value = $match.Groups[$groupNumber].Value
    if ($null -ne $value -and $value.Length -gt 0) {
      return $value.Trim()
    }
  }

  return $null
}

function Get-TagByAttributeValue {
  param(
    [string]$Text,
    [string]$TagName,
    [string]$Attribute,
    [string]$Value
  )

  $tagPattern = '<' + [regex]::Escape($TagName) + '\b[^>]*>'
  foreach ($match in [regex]::Matches($Text, $tagPattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
    $tag = $match.Value
    $actualValue = Get-AttributeValue $tag $Attribute
    if ($actualValue -and $actualValue -ieq $Value) {
      return $tag
    }
  }

  return $null
}

function Test-TagAttribute {
  param(
    [string]$Tag,
    [string]$Attribute
  )

  $pattern = '(?i)(?:^|\s)' + [regex]::Escape($Attribute) + '(?:\s*=|\s|>)'
  return [regex]::IsMatch($Tag, $pattern)
}

$htmlFiles = Get-ChildItem -Path $root -Recurse -Filter "index.html"

foreach ($file in $htmlFiles) {
  $html = Get-Content -Raw -Encoding UTF8 $file.FullName

  $refreshTag = Get-TagByAttributeValue $html "meta" "http-equiv" "refresh"
  if ($refreshTag) {
    continue
  }

  $relative = Resolve-Path -Relative $file.FullName
  $htmlTag = [regex]::Match($html, '<html\b[^>]*>', [Text.RegularExpressions.RegexOptions]::IgnoreCase).Value
  $htmlLang = Get-AttributeValue $htmlTag "lang"
  $minDescriptionLength = if ($htmlLang -match "^zh") { 25 } else { 50 }
  $robotsTag = Get-TagByAttributeValue $html "meta" "name" "robots"
  $robots = Get-AttributeValue $robotsTag "content"
  $isIndexable = -not ($robots -and $robots -match "noindex")

  $title = Get-MatchValue $html '<title>(.*?)</title>'
  if (-not $title) {
    Add-SeoIssue "error" $relative "Missing title tag."
  } elseif ($isIndexable -and $title.Length -gt 70) {
    Add-SeoIssue "warning" $relative "Title is longer than 70 characters ($($title.Length))."
  }

  $descriptionTag = Get-TagByAttributeValue $html "meta" "name" "description"
  $description = Get-AttributeValue $descriptionTag "content"
  if (-not $description) {
    Add-SeoIssue "error" $relative "Missing meta description."
  } elseif ($isIndexable -and $description.Length -lt $minDescriptionLength) {
    Add-SeoIssue "warning" $relative "Meta description is shorter than $minDescriptionLength characters ($($description.Length))."
  } elseif ($isIndexable -and $description.Length -gt 170) {
    Add-SeoIssue "warning" $relative "Meta description is longer than 170 characters ($($description.Length))."
  }

  $canonicalTag = Get-TagByAttributeValue $html "link" "rel" "canonical"
  if ($isIndexable -and -not $canonicalTag) {
    Add-SeoIssue "error" $relative "Indexable page is missing canonical URL."
  }

  $hasHreflangAlternate = $false
  foreach ($linkMatch in [regex]::Matches($html, '<link\b[^>]*>', [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
    $linkTag = $linkMatch.Value
    if ((Get-AttributeValue $linkTag "rel") -ieq "alternate" -and (Test-TagAttribute $linkTag "hreflang")) {
      $hasHreflangAlternate = $true
      break
    }
  }
  if ($isIndexable -and -not $hasHreflangAlternate) {
    Add-SeoIssue "warning" $relative "Indexable page has no hreflang alternate links."
  }

  $jsonLdTag = Get-TagByAttributeValue $html "script" "type" "application/ld+json"
  if ($isIndexable -and -not $jsonLdTag) {
    Add-SeoIssue "warning" $relative "Indexable page has no JSON-LD structured data."
  }

  foreach ($imgMatch in [regex]::Matches($html, '<img\b[^>]*>', [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
    $img = $imgMatch.Value
    if (-not (Test-TagAttribute $img "alt")) {
      Add-SeoIssue "error" $relative "Image tag is missing an alt attribute: $img"
    }
  }
}

$sitemapIndex = Join-Path $root "sitemap.xml"
if (-not (Test-Path $sitemapIndex)) {
  Add-SeoIssue "error" "sitemap.xml" "Missing root sitemap."
} else {
  $sitemapText = Get-Content -Raw -Encoding UTF8 $sitemapIndex
  if ($sitemapText -notmatch "sitemapindex|urlset") {
    Add-SeoIssue "error" "sitemap.xml" "Root sitemap is not a sitemap index or URL set."
  }
}

$languageSitemaps = Get-ChildItem -Path $root -Recurse -Filter "sitemap.xml" | Where-Object { $_.FullName -ne (Resolve-Path $sitemapIndex).Path }
foreach ($sitemap in $languageSitemaps) {
  $text = Get-Content -Raw -Encoding UTF8 $sitemap.FullName
  $relative = Resolve-Path -Relative $sitemap.FullName

  if ($text -notmatch 'hreflang="x-default"') {
    Add-SeoIssue "warning" $relative "Missing x-default hreflang entries."
  }

  if ($text -notmatch "google.com/schemas/sitemap-image") {
    Add-SeoIssue "warning" $relative "Missing image sitemap namespace."
  }
}

$errors = @($issues | Where-Object { $_.Severity -eq "error" })
$warnings = @($issues | Where-Object { $_.Severity -eq "warning" })

Write-Host "SEO audit scanned $($htmlFiles.Count) index pages."
Write-Host "Errors: $($errors.Count); warnings: $($warnings.Count)."

if ($issues.Count -gt 0) {
  Write-Host ""
  Write-Host "Issue summary:"
  $issues | Group-Object Message | Sort-Object Count -Descending | Select-Object Count, Name | Format-Table -Wrap

  Write-Host ""
  Write-Host "First 80 issues:"
  $issues |
    Sort-Object Severity, File, Message |
    Select-Object -First 80 |
    Format-Table Severity, File, Message -Wrap

  if ($issues.Count -gt 80) {
    Write-Host "... $($issues.Count - 80) more issue(s) omitted from detailed output."
  }
}

if ($errors.Count -gt 0) {
  exit 1
}
