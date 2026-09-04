(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
      document.body.classList.toggle('menu-open', !expanded);
    });
  }

  document.querySelectorAll('[data-prototype-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      if (status) {
        status.hidden = false;
        status.textContent = 'Prototype only — no information was sent. In the production page, this form will keep the existing secure enquiry workflow.';
        status.focus();
      }
    });
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const productRows = [...document.querySelectorAll('[data-product-tags]')];

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.filter;
      filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      productRows.forEach((row) => {
        const tags = (row.dataset.productTags || '').split(' ');
        row.hidden = value !== 'all' && !tags.includes(value);
      });
    });
  });
})();
