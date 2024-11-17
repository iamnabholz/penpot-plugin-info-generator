import "./style.css";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

document.querySelector("[data-handler='date-text']")?.addEventListener("click", () => {
  // send message to plugin.ts
  parent.postMessage("date-text", "*");
});

document.querySelector("[data-handler='country-text']")?.addEventListener("click", () => {
  // send message to plugin.ts
  parent.postMessage("country-text", "*");
});

document.querySelector("[data-handler='name-text']")?.addEventListener("click", () => {
  // send message to plugin.ts
  //const value = document.querySelector("[data-handler='name-type']");
  const val = document.querySelectorAll("[data-handler='name-type']");

  for (let index = 0; index < val.length; index++) {
    const element = val[index] as HTMLInputElement;
    if (element.checked) {
      parent.postMessage({ msg: "name-text", type: element.value }, "*");
    }
  }
});

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
