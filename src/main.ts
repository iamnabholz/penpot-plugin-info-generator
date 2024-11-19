import "./style.css";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const choiceSelector = document.querySelector(".choice-selector")!;
let selectedValue = "Any";

choiceSelector.addEventListener("click", (event: Event) => {
  const target = event.target as HTMLElement;

  if (target.tagName === "P") {
    // Remove current selection
    const currentSelected = choiceSelector.querySelector(".choice-selected");
    currentSelected?.classList.remove("choice-selected");

    // Add selection to clicked item
    target.classList.add("choice-selected");
    selectedValue = target.textContent || "Any";
  }
});

document
  .querySelector("[data-handler='date-text']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts
    parent.postMessage("date-text", "*");
  });

document
  .querySelector("[data-handler='username-text']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts
    parent.postMessage("username-text", "*");
  });

document
  .querySelector("[data-handler='country-text']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts
    parent.postMessage("country-text", "*");
  });

document
  .querySelector("[data-handler='name-text']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts
    parent.postMessage({ msg: "name-text", type: selectedValue }, "*");
  });

// Listen plugin.ts messages
window.addEventListener("message", (event) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = event.data.theme;
  }
});
