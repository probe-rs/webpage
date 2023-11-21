import ProbeRsCode from "./scripts/components/probe_rs_code.js";
import ProbeRsCarousel from "./scripts/vendor/carousel/carousel.js";
import ProbeRsCarouselControls from "./scripts/components/probe_rs_carousel_controls.js";
import ProbeRsFilter from "./scripts/components/probe_rs_filter.js";

customElements.define("probe-rs-code", ProbeRsCode);
customElements.define("probe-rs-carousel", ProbeRsCarousel);
customElements.define("probe-rs-carousel-controls", ProbeRsCarouselControls);
customElements.define("probe-rs-filter", ProbeRsFilter);

// For testing purpose of CSP middleware
const userAgentString = navigator.userAgent;
const chromeAgent = userAgentString.indexOf("Chrome") > -1;

if (chromeAgent) {
  const observer = new ReportingObserver(
    (reports) => {
      for (const report of reports) {
        console.log(report.type, report.url, report.body);
      }
    },
    { buffered: true }
  );

  observer.observe();
}
