import country from "../public/countries.json";
import names from "../public/names.json";

const namesCombinedList = [...names.male, ...names.female];

penpot.ui.open("User Profile Generator", `?theme=${penpot.theme}`);

const getRandomDate = () => {
  const now = new Date(new Date().valueOf() - Math.random() * 1e12);
  const day = String(now.getDate()).padStart(2, '0'); // Ensure 2-digit format
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(now.getFullYear()); // Get last two digits of year
  return `${day}-${month}-${year}`;
}

penpot.ui.onMessage<any>((message) => {
  if (message === "country-text") {
    const selec = penpot.selection;

    if (selec.length > 0) {
      selec.forEach(selected => {
        if (penpot.utils.types.isText(selected)) {
          selected.characters = country[Math.floor(Math.random() * country.length)];
        }
      });
    }
  }

  if (message.msg === "name-text") {
    const selec = penpot.selection;

    if (selec.length > 0) {
      selec.forEach(selected => {
        if (penpot.utils.types.isText(selected)) {
          if (message.type === "male") {
            selected.characters = names.male[Math.floor(Math.random() * names.male.length)];
          } else if (message.type === "female") {
            selected.characters = names.female[Math.floor(Math.random() * names.female.length)];
          } else {
            selected.characters = namesCombinedList[Math.floor(Math.random() * namesCombinedList.length)];
          }
        }
      });
    }
  }

  if (message === "date-text") {
    const selec = penpot.selection;

    if (selec.length > 0) {
      selec.forEach(selected => {
        if (penpot.utils.types.isText(selected)) {
          selected.characters = getRandomDate();
        }
      });
    }
  }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});
