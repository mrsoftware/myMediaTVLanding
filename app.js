(function () {
  "use strict";

  var APK_URL =
    "https://github.com/mrsoftware/myMediaTVLanding/releases/latest/download/myMediaTV.apk";

  var doc = document;
  var header = doc.querySelector("[data-header]");
  var menuButton = doc.querySelector(".menu-toggle");
  var nav = doc.querySelector("#site-nav");

  doc.querySelectorAll("[data-apk-download]").forEach(function (link) {
    link.href = APK_URL;
  });

  doc.querySelectorAll("[data-year]").forEach(function (el) {
    try {
      el.textContent = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date());
    } catch (error) {
      /* keep the static Persian year */
    }
  });

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    doc.documentElement.classList.remove("nav-open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var open = doc.documentElement.classList.toggle("nav-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  var gallery = doc.querySelector("[data-gallery]");
  if (gallery) {
    var stage = gallery.querySelector(".gallery-stage");
    var image = gallery.querySelector("[data-gallery-image]");
    var titleEl = gallery.querySelector("[data-gallery-title]");
    var captionEl = gallery.querySelector("[data-gallery-caption]");
    var indexEl = gallery.querySelector("[data-gallery-index]");
    var totalEl = gallery.querySelector("[data-gallery-total]");
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll(".thumb"));
    var persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    var swapToken = 0;

    function toPersian(value) {
      return String(value).replace(/\d/g, function (digit) {
        return persianDigits[Number(digit)];
      });
    }

    if (totalEl) totalEl.textContent = toPersian(thumbs.length);

    function selectThumb(button) {
      if (button.classList.contains("is-active")) return;
      var url = button.getAttribute("data-image");
      var token = ++swapToken;

      thumbs.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      titleEl.textContent = button.getAttribute("data-title") || "";
      captionEl.textContent = button.getAttribute("data-caption") || "";
      indexEl.textContent = toPersian(thumbs.indexOf(button) + 1);
      stage.classList.add("is-swapping");

      setTimeout(function () {
        if (token !== swapToken) return;
        image.src = url;
        image.alt = button.getAttribute("data-alt") || "";
        requestAnimationFrame(function () {
          stage.classList.remove("is-swapping");
        });
      }, 160);
    }

    thumbs.forEach(function (button) {
      button.addEventListener("click", function () {
        selectThumb(button);
      });
    });
  }

  var revealItems = doc.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px" }
    );
    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
})();
