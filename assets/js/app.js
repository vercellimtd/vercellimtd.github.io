document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-button");
  const filterCheckboxes = document.querySelectorAll(".format-checkbox");
  const itemCards = document.querySelectorAll(".filter-simple-item");
  const noResultsMessage = document.getElementById("no-results-message");

  function updateGroupVisibility() {
    document.querySelectorAll(".inventory-type-group").forEach(typeGroup => {
      const collections = typeGroup.querySelectorAll(".inventory-collection-group");
      let typeVisible = false;

      collections.forEach(collectionGroup => {
        const relations = collectionGroup.querySelectorAll(".inventory-relation-group");
        let collectionVisible = false;

        relations.forEach(relationGroup => {
          const items = relationGroup.querySelectorAll(".filter-simple-item");
          const relationVisible = Array.from(items).some(i => i.style.display === "block");
          relationGroup.style.display = relationVisible ? "block" : "none";
          if (relationVisible) collectionVisible = true;
        });

        // Items without a relation group
        const ungroupedItems = Array.from(collectionGroup.children)
          .filter(el => el.classList.contains("filter-simple-item"));
        const showUngrouped = ungroupedItems.some(i => i.style.display === "block");
        if (showUngrouped) collectionVisible = true;
        ungroupedItems.forEach(i => i.style.display = showUngrouped ? "block" : "none");

        collectionGroup.style.display = collectionVisible ? "block" : "none";
        if (collectionVisible) typeVisible = true;
      });

      // Items without a collection group
      const ungroupedTypeItems = Array.from(typeGroup.children)
        .filter(el => el.classList.contains("filter-simple-item"));
      const showTypeUngrouped = ungroupedTypeItems.some(i => i.style.display === "block");
      if (showTypeUngrouped) typeVisible = true;
      ungroupedTypeItems.forEach(i => i.style.display = showTypeUngrouped ? "block" : "none");

      typeGroup.style.display = typeVisible ? "block" : "none";
    });
  }

  function filterItems() {
    const selectedCategories = Array.from(filterButtons)
      .filter(button => button.classList.contains("active"))
      .map(button => button.dataset.category);

    const selectedFormats = Array.from(filterCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.dataset.value);

    let visibleCount = 0;

    itemCards.forEach(card => {
      const itemCategories = (card.dataset.categories || "").split(",");
      const itemFormats = (card.dataset.formats || "").split(",");

      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(cat => itemCategories.includes(cat));

      const matchFormat =
        selectedFormats.length === 0 ||
        selectedFormats.some(fmt => itemFormats.includes(fmt));

      const visible = matchCategory && matchFormat;
      card.style.display = visible ? "block" : "none";
      if (visible) visibleCount++;
    });

    updateGroupVisibility();

    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      filterItems();
    });
  });

  filterCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      filterItems();
    });
  });

  filterItems(); // Initial run

  // --- Lunr search ---
  let lunrIndex, searchDocs;

  fetch('/assets/js/inventory-search-data.json')
    .then(r => r.json())
    .then(docs => {
      searchDocs = docs;
      lunrIndex = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('identifier', { boost: 8 });
        this.field('creator', { boost: 5 });
        this.field('collection');
        this.field('relation');
        this.field('type');
        this.field('temporal');
        this.field('description');
        this.field('ceioa');
        this.field('mibact');
        docs.forEach(doc => this.add(doc));
      });
    });

  const searchInput = document.getElementById('inventory-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim();
      if (!lunrIndex) return;

      if (query === '') {
        filterItems();
        return;
      }

      let matchIds = new Set();
      try {
        lunrIndex.search(query + '*').forEach(r => matchIds.add(parseInt(r.ref)));
        if (matchIds.size === 0) {
          lunrIndex.search(query).forEach(r => matchIds.add(parseInt(r.ref)));
        }
      } catch(e) {
        // lunr throws on malformed queries; ignore
      }

      itemCards.forEach((card, i) => {
        const visible = matchIds.has(i + 1);
        card.style.display = visible ? 'block' : 'none';
      });

      updateGroupVisibility();

      if (noResultsMessage) {
        noResultsMessage.style.display = matchIds.size === 0 ? "block" : "none";
      }
    });
  }

});