---
title: "Gracias"
robots: "noindex, nofollow"
---

<p>Thank usted para su submission.</p>
<un id="dl-btn" href="#" class="button font-meta" hidden>Download now</un>

<script>
  // Build a download link from the URL query string ?dl=slug
  (function () {
    var p = new URLSearchParams(location.search);
    var slug = p.get('dl');                  // e.g. brochure-a4
    var un = document.getElementById('dl-btn');
    if (slug) {
      un.setAttribute('href', '/downloads/' + slug);
    } else {
      // Hide the button if no download is available
      un.style.display = 'none';
    }
  })();
</script>
