param(
  [string]$Destination = ".codex-build\seo-audit",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

if (-not $SkipBuild) {
  hugo --destination $Destination --cleanDestinationDir
}

$root = Resolve-Path $Destination
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

$htmlFiles = Get-ChildItem -Path $root -Recurse -Filter "index.html"

foreach ($file in $htmlFiles) {
  $html = Get-Content -Raw -Encoding UTF8 $file.FullName

  if ($html -match 'http-equiv=["'']refresh["'']') {
    continue
  }

  $relative = Resolve-Path -Relative $file.FullName
  $htmlLang = Get-MatchValue $html '<html\s+lang=["'']([^"'']+)["'']'
  $minDescriptionLength = if ($htmlLang -match "^zh") { 25 } else { 50 }
  $robots = Get-MatchValue $html '<meta\s+name=["'']robots["'']\s+content=["'']([^"'']+)["'']'
  $isIndexable = -not ($robots -and $robots -match "noindex")

  $title = Get-MatchValue $html '<title>(.*?)</title>'
  if (-not $title) {
    Add-SeoIssue "error" $relative "Missing title tag."
  } elseif ($isIndexable -and $title.Length -gt 70) {
    Add-SeoIssue "warning" $relative "Title is longer than 70 characters ($($title.Length))."
  }

  $description = Get-MatchValue $html '<meta\s+name=["'']description["'']\s+content=["'']([^"'']*)["'']'
  if (-not $description) {
    Add-SeoIssue "error" $relative "Missing meta description."
  } elseif ($isIndexable -and $description.Length -lt $minDescriptionLength) {
    Add-SeoIssue "warning" $relative "Meta description is shorter than $minDescriptionLength characters ($($description.Length))."
  } elseif ($isIndexable -and $description.Length -gt 170) {
    Add-SeoIssue "warning" $relative "Meta description is longer than 170 characters ($($description.Length))."
  }

  if ($isIndexable -and $html -notmatch '<link\s+rel=["'']canonical["'']') {
    Add-SeoIssue "error" $relative "Indexable page is missing canonical URL."
  }

  if ($isIndexable -and $html -notmatch 'rel=["'']alternate["'']\s+hreflang=') {
    Add-SeoIssue "warning" $relative "Indexable page has no hreflang alternate links."
  }

  if ($isIndexable -and $html -notmatch 'application/ld\+json') {
    Add-SeoIssue "warning" $relative "Indexable page has no JSON-LD structured data."
  }

  foreach ($imgMatch in [regex]::Matches($html, '<img\b[^>]*>', [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
    $img = $imgMatch.Value
    if ($img -notmatch '\salt=') {
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
