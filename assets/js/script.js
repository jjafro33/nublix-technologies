/* NUBLIX TECHNOLOGIES — shared interactions */
(function(){
  "use strict";

  /* ---- Loader ---- */
  window.addEventListener("load", function(){
    var l = document.getElementById("nx-loader");
    if(l){ setTimeout(function(){ l.classList.add("hide"); }, 280); }
  });

  /* ---- Theme (dark/light) ---- */
  var root = document.documentElement;
  var saved = localStorage.getItem("nx-theme");
  if(saved){ root.setAttribute("data-theme", saved); }
  else if(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches){
    root.setAttribute("data-theme","light");
  }
  document.querySelectorAll(".theme-toggle").forEach(function(btn){
    btn.addEventListener("click", function(){
      var cur = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = cur === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("nx-theme", next);
    });
  });

  /* ---- Nav scroll state + mobile burger ---- */
  var nav = document.querySelector(".nx-nav");
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 12) nav.classList.add("scrolled"); else nav.classList.remove("scrolled");
    var btt = document.querySelector(".back-to-top");
    if(btt){ if(window.scrollY > 500) btt.classList.add("show"); else btt.classList.remove("show"); }
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  var burger = document.querySelector(".nav-burger");
  var links = document.querySelector(".nx-links");
  if(burger && links){
    burger.addEventListener("click", function(){
      links.classList.toggle("open");
      burger.setAttribute("aria-expanded", links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ links.classList.remove("open"); });
    });
  }

  /* ---- Back to top ---- */
  var btt = document.querySelector(".back-to-top");
  if(btt){ btt.addEventListener("click", function(){ window.scrollTo({top:0, behavior:'smooth'}); }); }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold:0.15 });
    revealEls.forEach(function(el, i){ el.style.setProperty("--i", i % 8); io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  if(counters.length){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = null;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target < 10 ? (target*eased).toFixed(1) : Math.floor(target*eased);
          el.textContent = val + suffix;
          if(p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold:0.4 });
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* ---- Cookie consent ---- */
  var cookieBanner = document.getElementById("cookie-banner");
  if(cookieBanner){
    if(!localStorage.getItem("nx-cookie-consent")){
      setTimeout(function(){ cookieBanner.classList.add("show"); }, 900);
    }
    var accept = document.getElementById("cookie-accept");
    var decline = document.getElementById("cookie-decline");
    if(accept) accept.addEventListener("click", function(){
      localStorage.setItem("nx-cookie-consent","accepted");
      cookieBanner.classList.remove("show");
    });
    if(decline) decline.addEventListener("click", function(){
      localStorage.setItem("nx-cookie-consent","declined");
      cookieBanner.classList.remove("show");
    });
  }

  /* ---- Live chat placeholder ---- */
  var chatToggle = document.getElementById("chat-toggle");
  var chatBubble = document.getElementById("chat-bubble");
  var chatClose = document.getElementById("chat-close");
  if(chatToggle && chatBubble){
    chatToggle.addEventListener("click", function(){ chatBubble.classList.toggle("open"); });
  }
  if(chatClose && chatBubble){
    chatClose.addEventListener("click", function(){ chatBubble.classList.remove("open"); });
  }

  /* ---- Accordion (FAQ) ---- */
  document.querySelectorAll(".accordion-nx .acc-q").forEach(function(btn){
    btn.addEventListener("click", function(){
      var item = btn.closest(".acc-item");
      var body = item.querySelector(".acc-a");
      var wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".acc-item.open").forEach(function(o){
        if(o !== item){ o.classList.remove("open"); o.querySelector(".acc-a").style.maxHeight = null; }
      });
      if(wasOpen){ item.classList.remove("open"); body.style.maxHeight = null; }
      else{ item.classList.add("open"); body.style.maxHeight = body.scrollHeight + "px"; }
    });
  });

  /* ---- Project / blog filters ---- */
  document.querySelectorAll(".filter-row").forEach(function(row){
    var targetSelector = row.getAttribute("data-target");
    var items = targetSelector ? document.querySelectorAll(targetSelector) : [];
    row.querySelectorAll(".filter-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        row.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        items.forEach(function(it){
          var match = cat === "all" || it.getAttribute("data-cat") === cat;
          it.style.display = match ? "" : "none";
        });
      });
    });
  });

  /* ---- Project search ---- */
  var searchInput = document.getElementById("project-search");
  if(searchInput){
    searchInput.addEventListener("input", function(){
      var q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll("[data-cat]").forEach(function(it){
        var title = (it.getAttribute("data-title") || "").toLowerCase();
        it.style.display = title.indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  /* ---- Sort projects ---- */
  var sortSelect = document.getElementById("project-sort");
  if(sortSelect){
    sortSelect.addEventListener("change", function(){
      var grid = document.getElementById("project-grid");
      if(!grid) return;
      var items = Array.prototype.slice.call(grid.children);
      var mode = sortSelect.value;
      items.sort(function(a,b){
        if(mode === "az") return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"));
        if(mode === "za") return b.getAttribute("data-title").localeCompare(a.getAttribute("data-title"));
        if(mode === "newest") return b.getAttribute("data-year") - a.getAttribute("data-year");
        return 0;
      });
      items.forEach(function(it){ grid.appendChild(it); });
    });
  }

  /* ---- Contact / Quote / Newsletter form handling (client-side demo) ---- */
  document.querySelectorAll("form[data-nx-form]").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      var valid = true;
      form.querySelectorAll("[required]").forEach(function(f){
        if(!f.value.trim()){ valid = false; f.style.borderColor = "#FF6B6B"; }
        else{ f.style.borderColor = ""; }
      });
      if(!valid){
        if(msg){ msg.textContent = "Please fill in all required fields."; msg.style.color = "#FF6B6B"; }
        return;
      }
      if(msg){ msg.textContent = "Thanks — your message has been received. We'll reply within 1 business day."; msg.style.color = "var(--cyan)"; }
      form.reset();
    });
  });

  /* ---- Year in footer ---- */
  document.querySelectorAll(".cur-year").forEach(function(el){ el.textContent = new Date().getFullYear(); });

})();
