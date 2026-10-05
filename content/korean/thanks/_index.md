---
title: "제출이 접수되었습니다"
robots: "noindex, nofollow"
---

<p>문의가 정상적으로 접수되었습니다. 감사합니다.</p>
<a id="dl-btn" href="#" class="button font-meta" hidden>지금 다운로드</a>

<script>
  // Build a download link from the URL query string ?dl=slug
  (function () {
    var p = new URLSearchParams(location.search);
    var slug = p.get('dl');                  // e.g. brochure-a4
    var a = document.getElementById('dl-btn');
    if (slug) {
      a.setAttribute('href', '/downloads/' + slug);
    } else {
      // Hide the button if no download is available
      a.style.display = 'none';
    }
  })();
</script>
