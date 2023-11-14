addEventListener(
  "DOMContentLoaded",
  () => {
    docsearch({
      appId: "3ZQ68LINL8",
      apiKey: "76ecd647479d81cdf7630de9b37c9955",
      indexName: "probe",
      container: document.getElementById("search"),
      debug: false,
    });
  },
  false
);
