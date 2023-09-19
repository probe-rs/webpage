export default class ProbeRsFilter extends HTMLElement {
  connectedCallback() {
    const selectManufacturer = this.querySelector("select[name=manufacturer]");
    const selectFamily = this.querySelector("select[name=family]");
    const items = this.querySelectorAll(":scope > ul > li");

    const init = new URLSearchParams(window.location.search);

    selectManufacturer.value = init.get('manufacturer') ?? "SHOW_ALL_MANUFACTURERS";
    selectFamily.value = init.get("family") ?? "SHOW_ALL_FAMILIES";

    console.log(init.get("family"));
    console.log(selectFamily.value)

    selectManufacturer.addEventListener("change", (event) => {
      onChange("manufacturer");
      event.preventDefault();
    });

    selectFamily.addEventListener("change", (event) => {
      onChange("family");
      event.preventDefault();
    });

    onChange("manufacturer");

    function onChange(changed) {
      const manufacturer = selectManufacturer.value;
      const family = selectFamily.value;

      if (changed == "manufacturer") {
        filterFamilies()
      } else if (changed == "family") {
        filter()
      }

      const permalink = new URLSearchParams({
        manufacturer,
        family,
      }).toString();

      if (permalink !== document.location.search) {
        const newUrl = permalink ? `?${permalink}` : document.location.pathname;
        history.pushState({}, null, newUrl);
      }
    }

    function filterFamilies() {
      const manufacturer = selectManufacturer.value;
      const familyItems = document.querySelectorAll(":scope select[name=family] > option");
      let reset = false;
      familyItems.forEach((item) => {
        if (manufacturer == "SHOW_ALL_MANUFACTURERS" || item.dataset.manufacturer == manufacturer) {
          item.hidden = false;
        } else {
          item.hidden = true;
          if (item.value == selectFamily.value) {
            selectFamily.value = "SHOW_ALL_FAMILIES"
          }
        }
      });

      filter()
    }

    function filter() {
      const manufacturer = selectManufacturer.value;
      const family = selectFamily.value;

      items.forEach((item) => {
        if ((family == "SHOW_ALL_FAMILIES" || item.dataset.family == family) && (manufacturer == "SHOW_ALL_MANUFACTURERS" || item.dataset.manufacturer == manufacturer)) {
          item.hidden = false;
        } else {
          item.hidden = true;
        }
      });
    }
  }
}
