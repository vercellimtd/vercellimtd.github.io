// inventory-filter.js
// Drop-in replacement for the filter block in app.js
// Handles: search (Lunr) + category checkboxes + format checkboxes, unified
// Mobile: toggle button for filter panel drawer
// Shared candidate: VidentesMSI uses same pattern — extract to digitalarcplatform later

document.addEventListener("DOMContentLoaded", function () {

  // ── Element refs ────────────────────────────────────────────────────────────
  const panel        = document.getElementById("filter-panel");
  const toggleBtn    = document.getElementById("filter-toggle");
  const searchInput  = document.getElementById("inventory-search");
  const clearBtn     = document.getElementById("filter-clear");
  const resultCount  = document.getElementById("filter-result-count");
  const noResults    = document.getElementById("no-results-message");
  const itemCards    = document.querySelectorAll(".filter-simple-item");

  // Unified checkbox selector — both category and format use same class now
  const allCheckboxes = document.querySelectorAll(".filter-checkbox");

  // ── Mobile drawer ───────────────────────────────────────────────────────────
  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", function () {
      const open = panel.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close panel on outside tap (mobile)
    document.addEventListener("click", function (e) {
      if (
        panel.classList.contains("is-open") &&
        !panel.contains(e.target) &&
        e.target !== toggleBtn
      ) {
        panel.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ── Group visibility ────────────────────────────────────────────────────────
  function updateGroupVisibility() {
    document.querySelectorAll(".inventory-type-group").forEach(function (typeGroup) {
      var typeVisible = false;

      typeGroup.querySelectorAll(".inventory-collection-group").forEach(function (collGroup) {
        var collVisible = false;

        collGroup.querySelectorAll(".inventory-relation-group").forEach(function (relGroup) {
          var relVisible = Array.from(
            relGroup.querySelectorAll(".filter-simple-item")
          ).some(function (i) { return i.style.display === "block"; });
          relGroup.style.display = relVisible ? "block" : "none";
          if (relVisible) collVisible = true;
        });

        // Ungrouped items directly in collection
        Array.from(collGroup.children)
          .filter(function (el) { return el.classList.contains("filter-simple-item"); })
          .forEach(function (i) {
            if (i.style.display === "block") collVisible = true;
          });

        collGroup.style.display = collVisible ? "block" : "none";
        if (collVisible) typeVisible = true;
      });

      // Ungrouped items directly in type
      Array.from(typeGroup.children)
        .filter(function (el) { return el.classList.contains("filter-simple-item"); })
        .forEach(function (i) {
          if (i.style.display === "block") typeVisible = true;
        });

      typeGroup.style.display = typeVisible ? "block" : "none";
    });
  }

  // ── Parent indicator (has-active-child) ─────────────────────────────────────
  function updateParentIndicators() {
    // Clear all
    document.querySelectorAll(".filter-checklist__item.has-active-child").forEach(function (el) {
      el.classList.remove("has-active-child");
    });

    // Set on type items when a child collection/relation is checked
    document.querySelectorAll(".filter-checkbox--format:checked").forEach(function (cb) {
      var level = cb.dataset.level;
      if (level === "collection" || level === "relation") {
        var parentLi = cb.closest(".filter-checklist__item");
        // Walk up to type-level li
        var ancestor = parentLi && parentLi.parentElement &&
                       parentLi.parentElement.closest(".filter-checklist__item--type");
        if (ancestor) ancestor.classList.add("has-active-child");
        // Also mark collection-level if relation is checked
        if (level === "relation") {
          var collAncestor = parentLi &&
                             parentLi.parentElement &&
                             parentLi.parentElement.closest(".filter-checklist__item--collection");
          if (collAncestor) collAncestor.classList.add("has-active-child");
        }
      }
    });
  }

  // ── Clear button visibility ──────────────────────────────────────────────────
  function updateClearBtn() {
    if (!clearBtn) return;
    var anyActive =
      (searchInput && searchInput.value.trim() !== "") ||
      Array.from(allCheckboxes).some(function (cb) { return cb.checked; });
    clearBtn.hidden = !anyActive;
  }

  // ── Core filter ──────────────────────────────────────────────────────────────
  // State shared between filter and search passes
  var currentSearchIds = null; // null = no search active; Set = lunr results

  function applyFilters() {
    var selectedCategories = Array.from(allCheckboxes)
      .filter(function (cb) { return cb.checked && cb.dataset.filterType === "category"; })
      .map(function (cb) { return cb.dataset.value; });

    var selectedFormats = Array.from(allCheckboxes)
      .filter(function (cb) { return cb.checked && cb.dataset.filterType === "format"; })
      .map(function (cb) { return cb.dataset.value; });

    var visibleCount = 0;

    itemCards.forEach(function (card, i) {
      var itemCategories = (card.dataset.categories || "").split(",").map(function (s) { return s.trim(); });
      var itemFormats    = (card.dataset.formats    || "").split(",").map(function (s) { return s.trim(); });

      var matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(function (cat) { return itemCategories.indexOf(cat) !== -1; });

      var matchFormat =
        selectedFormats.length === 0 ||
        selectedFormats.some(function (fmt) { return itemFormats.indexOf(fmt) !== -1; });

      // Search: currentSearchIds is null when no query, Set of 1-based indices when active
      var matchSearch =
        currentSearchIds === null ||
        currentSearchIds.has(i + 1);

      var visible = matchCategory && matchFormat && matchSearch;
      card.style.display = visible ? "block" : "none";
      if (visible) visibleCount++;
    });

    updateGroupVisibility();
    updateParentIndicators();
    updateClearBtn();

    if (resultCount) {
      resultCount.textContent = visibleCount === itemCards.length
        ? ""
        : visibleCount + " result" + (visibleCount !== 1 ? "s" : "");
    }
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  // ── Checkbox listeners ───────────────────────────────────────────────────────
  allCheckboxes.forEach(function (cb) {
    cb.addEventListener("change", applyFilters);
  });

  // ── Clear all ────────────────────────────────────────────────────────────────
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      allCheckboxes.forEach(function (cb) { cb.checked = false; });
      if (searchInput) searchInput.value = "";
      currentSearchIds = null;
      applyFilters();
    });
  }

  // ── Lunr search ──────────────────────────────────────────────────────────────
  var lunrIndex, searchDocs;

  fetch("/assets/js/inventory-search-data.json")
    .then(function (r) { return r.json(); })
    .then(function (docs) {
      searchDocs = docs;
      lunrIndex = lunr(function () {
        this.ref("id");
        this.field("title",       { boost: 10 });
        this.field("identifier",  { boost: 8  });
        this.field("creator",     { boost: 5  });
        this.field("collection");
        this.field("relation");
        this.field("type");
        this.field("temporal");
        this.field("description");
        this.field("ceioa");
        this.field("mibact");
        docs.forEach(function (doc) { this.add(doc); }, this);
      });
    });

  if (searchInput) {
    // Debounce — avoids firing on every keystroke for large datasets
    var searchTimer;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        var query = searchInput.value.trim();

        if (!lunrIndex || query === "") {
          currentSearchIds = null;
          applyFilters();
          return;
        }

        var matchIds = new Set();
        try {
          lunrIndex.search(query + "*").forEach(function (r) {
            matchIds.add(parseInt(r.ref, 10));
          });
          if (matchIds.size === 0) {
            lunrIndex.search(query).forEach(function (r) {
              matchIds.add(parseInt(r.ref, 10));
            });
          }
        } catch (e) {
          // Lunr throws on malformed queries — treat as no results
        }

        currentSearchIds = matchIds;
        applyFilters();
      }, 200);
    });
  }

  // ── Initial render ───────────────────────────────────────────────────────────
  applyFilters();

});