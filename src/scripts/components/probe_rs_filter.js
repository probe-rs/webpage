export default class ProbeRsFilter extends HTMLElement {
  connectedCallback() {
    const select = this.querySelector("select[name=family]");
    const items = this.querySelectorAll(":scope > ul > li");

    const init = new URLSearchParams(window.location.search);

    select.value = init.family ?? "SHOW_ALL_FAMILIES";

    select.addEventListener("change", (event) => {
      onChange();
      event.preventDefault();
    });

    onChange();

    function onChange() {
      const family = select.value;
      filter();
      const permalink = new URLSearchParams({
        family,
      }).toString();

      if (permalink !== document.location.search) {
        const newUrl = permalink ? `?${permalink}` : document.location.pathname;
        history.pushState({}, null, newUrl);
      }
    }

    function filter() {
      const family = select.value;

      items.forEach((item) => {
        if (family == "SHOW_ALL_FAMILIES" || item.dataset.family == family) {
          item.hidden = false;
        } else {
          item.hidden = true;
        }
      });
    }
  }
}
