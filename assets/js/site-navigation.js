(() => {
  const desktopQuery = window.matchMedia("(min-width: 80rem)");

  const initialiseHeader = (header) => {
    const menuToggle = header.querySelector("[data-menu-toggle]");
    const drawer = header.querySelector("[data-menu-drawer]");
    const languageMenu = header.querySelector("[data-language-menu]");
    const desktopItems = [...header.querySelectorAll("[data-desktop-menu-item]")];
    let drawerOpen = false;

    if (!menuToggle || !drawer) return;

    const labels = {
      open: menuToggle.getAttribute("aria-label"),
      close: drawer.dataset.closeLabel,
    };

    const setDesktopItem = (item, open) => {
      const button = item.querySelector("[data-desktop-menu-toggle]");
      if (!button) return;
      item.toggleAttribute("data-menu-open", open);
      button.setAttribute("aria-expanded", String(open));
    };

    const closeDesktopMenus = (except = null) => {
      desktopItems.forEach((item) => {
        if (item !== except) setDesktopItem(item, false);
      });
    };

    const closeLanguageMenu = () => {
      languageMenu?.removeAttribute("open");
    };

    const resetMobileGroups = () => {
      drawer.querySelectorAll("[data-mobile-menu-group]").forEach((group) => {
        group.removeAttribute("open");
      });
    };

    const setDrawer = (open, restoreFocus = false) => {
      drawerOpen = open;
      header.dataset.menuState = open ? "open" : "closed";
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? labels.close : labels.open);
      document.body.classList.toggle("is-menu-open", open);

      if (open) {
        closeDesktopMenus();
        closeLanguageMenu();
        drawer.hidden = false;
        requestAnimationFrame(() => {
          if (menuToggle.matches(":focus-visible")) {
            drawer.querySelector("summary, a")?.focus();
          }
        });
      } else {
        drawer.hidden = true;
        resetMobileGroups();
        if (restoreFocus) menuToggle.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      setDrawer(!drawerOpen, drawerOpen);
    });

    desktopItems.forEach((item) => {
      const button = item.querySelector("[data-desktop-menu-toggle]");
      if (!button) return;

      item.addEventListener("pointerenter", () => {
        if (desktopQuery.matches) closeDesktopMenus(item);
      });

      item.addEventListener("focusin", () => {
        if (desktopQuery.matches) closeDesktopMenus(item);
      });

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = button.getAttribute("aria-expanded") !== "true";
        closeDesktopMenus(item);
        closeLanguageMenu();
        setDesktopItem(item, open);
      });
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) {
        closeDesktopMenus();
        closeLanguageMenu();
      } else if (languageMenu && !languageMenu.contains(event.target)) {
        closeLanguageMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const openDesktopItem = desktopItems.find((item) => item.hasAttribute("data-menu-open"));
        if (openDesktopItem) {
          const button = openDesktopItem.querySelector("[data-desktop-menu-toggle]");
          setDesktopItem(openDesktopItem, false);
          button?.focus();
          return;
        }

        if (languageMenu?.hasAttribute("open")) {
          languageMenu.removeAttribute("open");
          languageMenu.querySelector("summary")?.focus();
          return;
        }

        if (drawerOpen) setDrawer(false, true);
      }

      if (event.key === "Tab" && drawerOpen) {
        const focusable = [...drawer.querySelectorAll("summary, a[href]")].filter(
          (element) => element.offsetParent !== null,
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    const handleBreakpoint = (event) => {
      if (event.matches && drawerOpen) setDrawer(false);
      if (!event.matches) closeDesktopMenus();
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", handleBreakpoint);
    } else {
      desktopQuery.addListener(handleBreakpoint);
    }
  };

  document.querySelectorAll("[data-site-header]").forEach(initialiseHeader);
})();
