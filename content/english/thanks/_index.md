---
title: "Submission received"
robots: "noindex, nofollow"
---

<p>Thank you for your submission.</p>
<a id="dl-btn" href="#" class="button" hidden>Download now</a>

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
