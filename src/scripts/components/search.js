addEventListener(
  "DOMContentLoaded",
  () => {
    docsearch({
      appId: "ITJWIR3Q7U",
      apiKey: "12cf716077f5024aa912d2ef899f399b",
      indexName: "probe-rs",
      container: document.getElementById("search"),
      debug: false,
    });
  },
  false,
);
