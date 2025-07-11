
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-button");
  const filterCheckboxes = document.querySelectorAll(".format-checkbox");
  const itemCards = document.querySelectorAll(".filter-simple-item");
  const noResultsMessage = document.getElementById("no-results-message");

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

    // Show/hide parent sections based on visible child elements
    document.querySelectorAll(".inventory-type-group").forEach(typeGroup => {
      const collections = typeGroup.querySelectorAll(".inventory-collection-group");
      let typeVisible = false;

      collections.forEach(collectionGroup => {
        const relations = collectionGroup.querySelectorAll(".inventory-relation-group");
        let collectionVisible = false;

        relations.forEach(relationGroup => {
          const items = relationGroup.querySelectorAll(".filter-simple-item");
          const relationVisible = Array.from(items).some(i => i.style.display !== "none");
          relationGroup.style.display = relationVisible ? "block" : "none";
          if (relationVisible) collectionVisible = true;
        });

        // Show items without relation
        const ungroupedItems = Array.from(collectionGroup.querySelectorAll("> .filter-simple-item"))
          .filter(i => !i.closest(".inventory-relation-group"));
        const showUngrouped = ungroupedItems.some(i => i.style.display !== "none");
        if (showUngrouped) collectionVisible = true;
        ungroupedItems.forEach(i => i.style.display = showUngrouped ? "block" : "none");

        collectionGroup.style.display = collectionVisible ? "block" : "none";
        if (collectionVisible) typeVisible = true;
      });

      // Show items without collection
      const ungroupedTypeItems = Array.from(typeGroup.querySelectorAll("> .filter-simple-item"))
        .filter(i => !i.closest(".inventory-collection-group"));
      const showTypeUngrouped = ungroupedTypeItems.some(i => i.style.display !== "none");
      if (showTypeUngrouped) typeVisible = true;
      ungroupedTypeItems.forEach(i => i.style.display = showTypeUngrouped ? "block" : "none");

      typeGroup.style.display = typeVisible ? "block" : "none";
    });

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
});
