"use strict";
(window.isRtl = window.Helpers.isRtl()),
  (window.isDarkStyle = window.Helpers.isDarkStyle()),
  (function () {
    "undefined" != typeof Waves &&
      (Waves.init(),
      Waves.attach(
        ".btn[class*='btn-']:not(.position-relative):not([class*='btn-outline-']):not([class*='btn-label-'])",
        ["waves-light"]
      ),
      Waves.attach("[class*='btn-outline-']:not(.position-relative)"),
      Waves.attach("[class*='btn-label-']:not(.position-relative)"),
      Waves.attach(".pagination .page-item .page-link"),
      Waves.attach(".dropdown-menu .dropdown-item"),
      Waves.attach(".light-style .list-group .list-group-item-action"),
      Waves.attach(".dark-style .list-group .list-group-item-action", [
        "waves-light",
      ]),
      Waves.attach(".nav-tabs:not(.nav-tabs-widget) .nav-item .nav-link"),
      Waves.attach(".nav-pills .nav-item .nav-link", ["waves-light"]));
    const e = document.getElementById("navbarSupportedContent"),
      a = document.querySelector(".landing-navbar"),
      t = document.querySelectorAll(".navbar-nav .nav-link");
    function o() {
      e.classList.remove("show");
    }
    setTimeout(function () {
      window.Helpers.initCustomOptionCheck();
    }, 1e3),
      [].slice
        .call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .map(function (t) {
          return new bootstrap.Tooltip(t);
        }),
      isRtl &&
        Helpers._addClass(
          "dropdown-menu-end",
          document.querySelectorAll("#layout-navbar .dropdown-menu")
        ),
      window.addEventListener("scroll", (t) => {
        10 < window.scrollY
          ? a.classList.add("navbar-active")
          : a.classList.remove("navbar-active");
      }),
      window.addEventListener("load", (t) => {
        10 < window.scrollY
          ? a.classList.add("navbar-active")
          : a.classList.remove("navbar-active");
      }),
      document.addEventListener("click", function (t) {
        e.contains(t.target) || o();
      }),
      t.forEach((e) => {
        e.addEventListener("click", (t) => {
          e.classList.contains("dropdown-toggle") ? t.preventDefault() : o();
        });
      }),
      isRtl &&
        Helpers._addClass(
          "dropdown-menu-end",
          document.querySelectorAll(".dropdown-menu")
        );
    var s = document.querySelectorAll(".nav-link.mega-dropdown"),
      s =
        (s &&
          s.forEach((t) => {
            new MegaDropdown(t);
          }),
        document.querySelector(".dropdown-style-switcher"));
    const i = document.documentElement.getAttribute("data-style");
    var l,
      n =
        localStorage.getItem(
          "templateCustomizer-" + templateName + "--Style"
        ) ||
        (window.templateCustomizer?.settings?.defaultStyle ?? "light");
    window.templateCustomizer &&
      s &&
      ([].slice
        .call(s.children[1].querySelectorAll(".dropdown-item"))
        .forEach(function (t) {
          t.classList.remove("active"),
            t.addEventListener("click", function () {
              var t = this.getAttribute("data-theme");
              "light" === t
                ? window.templateCustomizer.setStyle("light")
                : "dark" === t
                ? window.templateCustomizer.setStyle("dark")
                : window.templateCustomizer.setStyle("system");
            }),
            setTimeout(() => {
              t.getAttribute("data-theme") === i && t.classList.add("active");
            }, 1e3);
        }),
      (s = s.querySelector("i")),
      "light" === n
        ? (s.classList.add("ri-sun-line"),
          new bootstrap.Tooltip(s, {
            title: "Light Mode",
            fallbackPlacements: ["bottom"],
          }))
        : "dark" === n
        ? (s.classList.add("ri-moon-clear-line"),
          new bootstrap.Tooltip(s, {
            title: "Dark Mode",
            fallbackPlacements: ["bottom"],
          }))
        : (s.classList.add("ri-computer-line"),
          new bootstrap.Tooltip(s, {
            title: "System Mode",
            fallbackPlacements: ["bottom"],
          }))),
      "system" === (l = n) &&
        (l = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"),
      [].slice
        .call(document.querySelectorAll("[data-app-" + l + "-img]"))
        .map(function (t) {
          var e = t.getAttribute("data-app-" + l + "-img");
          t.src = assetsPath + "img/" + e;
        });
    function c(t) {
      "show.bs.collapse" == t.type || "show.bs.collapse" == t.type
        ? (t.target.closest(".accordion-item").classList.add("active"),
          t.target
            .closest(".accordion-item")
            .previousElementSibling?.classList.add("previous-active"))
        : (t.target.closest(".accordion-item").classList.remove("active"),
          t.target
            .closest(".accordion-item")
            .previousElementSibling?.classList.remove("previous-active"));
    }
    [].slice.call(document.querySelectorAll(".accordion")).map(function (t) {
      t.addEventListener("show.bs.collapse", c),
        t.addEventListener("hide.bs.collapse", c);
    });
  })();
