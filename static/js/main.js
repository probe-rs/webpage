// Set darkmode
document.getElementById("mode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

const targets = {
  windows64: "x86_64-pc-windows-msvc",
  windows32: "i686-pc-windows-msvc",
  windowsArm: "aarch64-pc-windows-msvc",

  mac64: "x86_64-apple-darwin",
  mac32: "i686-apple-darwin",
  macSilicon: "aarch64-apple-darwin",

  linux64: "x86_64-unknown-linux-gnu",
  linux32: "i686-unknown-linux-gnu",
  linuxArm: "aarch64-unknown-linux-gnu",
};

const installString = () => {
  const version = "v0.20.0";
  const target = document.getElementsByClassName("target-selector")[0].value;
  const packageManager = document.querySelectorAll(
    "ul.platform-selector li.selected"
  )[0].innerHTML;
  let string;
  switch (packageManager) {
    case "shell":
      if (target == targets.windows64) {
        string = `irm https://github.com/probe-rs/probe-rs/releases/download/${version}/probe-rs-installer.ps1 | iex`;
      } else {
        string = `curl --proto '=https' --tlsv1.2 -LsSf https://github.com/probe-rs/probe-rs/releases/download/${version}/probe-rs-installer.sh | sh`;
      }
      break;
    case "cargo":
      string = "cargo install probe-rs --locked --features cli";
      break;
    case "tarball":
      string = `https://github.com/probe-rs/probe-rs/releases/download/${version}/probe-rs-${target}.tar.xz`;
      break;
    case "brew":
      string = "brew install probe-rs/probe-rs/probe-rs";
      break;
  }

  return string;
};

const selectPackageManager = (elements, element) => {
  elements.forEach((element) => element.classList.remove("selected"));
  let platform = document.getElementsByClassName("platform-selector")[0];
  const commandElement = document.getElementsByClassName(
    "install-command-text"
  )[0];
  element.classList.add("selected");
  commandElement.innerHTML = installString();
};

const elements = document.querySelectorAll("ul.platform-selector li");
elements.forEach((element) =>
  element.addEventListener("click", () => {
    selectPackageManager(elements, element);
  })
);
selectPackageManager(elements, elements[0]);

document
  .getElementsByClassName("install-command-copy")[0]
  .addEventListener("click", (event) => {
    let element = event.target;
    navigator.clipboard.writeText(installString());
  });

function isAppleSilicon() {
  try {
    var glcontext = document.createElement("canvas").getContext("webgl");
    var debugrenderer = glcontext
      ? glcontext.getExtension("WEBGL_debug_renderer_info")
      : null;
    var renderername =
      (debugrenderer &&
        glcontext.getParameter(debugrenderer.UNMASKED_RENDERER_WEBGL)) ||
      "";
    if (renderername.match(/Apple M/) || renderername.match(/Apple GPU/)) {
      return true;
    }

    return false;
  } catch (e) {}
}

function getOS() {
  var OS = targets.windows64.default;
  var userAgent = navigator.userAgent;
  var platform = navigator.platform;

  if (navigator.appVersion.includes("Win")) {
    if (
      !userAgent.includes("Windows NT 5.0") &&
      !userAgent.includes("Windows NT 5.1") &&
      (userAgent.indexOf("Win64") > -1 ||
        platform == "Win64" ||
        userAgent.indexOf("x86_64") > -1 ||
        userAgent.indexOf("x86_64") > -1 ||
        userAgent.indexOf("amd64") > -1 ||
        userAgent.indexOf("AMD64") > -1 ||
        userAgent.indexOf("WOW64") > -1)
    ) {
      OS = targets.windows64;
    } else {
      if (
        window.external &&
        window.external.getHostEnvironmentValue &&
        window.external
          .getHostEnvironmentValue("os-architecture")
          .includes("ARM64")
      ) {
        OS = targets.windowsArm;
      } else {
        try {
          var canvas = document.createElement("canvas");
          var gl = canvas.getContext("webgl");

          var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer.includes("Qualcomm")) OS = targets.windowsArm;
        } catch (e) {}
      }
    }
  }

  if (navigator.appVersion.includes("Mac")) {
    if (
      navigator.userAgent.includes("OS X 10.5") ||
      navigator.userAgent.includes("OS X 10.6")
    ) {
      OS = targets.mac32;
    } else {
      OS = targets.mac64;

      const isSilicon = isAppleSilicon();
      if (isSilicon) {
        OS = targets.macSilicon;
      }
    }
  }

  if (platform.includes("Linux")) {
    OS = targets.linux64;
    // FIXME: Can we find out whether linux 32-bit or ARM are used?
  }

  return OS;
}

document
  .getElementsByClassName("target-selector")[0]
  .addEventListener("change", () => {
    selectPackageManager(
      elements,
      document.querySelectorAll("ul.platform-selector li.selected")[0]
    );
  });
document.getElementsByClassName("target-selector")[0].value = getOS();
