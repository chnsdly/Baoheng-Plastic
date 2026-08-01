---
title: "Заявка получена"
robots: "noindex, nofollow"
---

<p>Спасибо за ваш отзыв.</p>
<a id="dl-btn" href="#" class="button font-meta" hidden>Загрузить сейчас</a>

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
