import country from "../public/countries.json";
import names from "../public/names.json";
import usernames from "../public/usernames.json";

const namesCombinedList = [...names.male, ...names.female];

penpot.ui.open("Starter Profile Generator", `?theme=${penpot.theme}`);

const createTextElement = (text: string) => {
  const element = penpot.createText(text);
  if (element) {
    element.x = penpot.viewport.center.x;
    element.y = penpot.viewport.center.y;

    penpot.selection = [element];
  }
};

const getRandomName = (type: string) => {
  if (type.toLowerCase() === "male") {
    return names.male[Math.floor(Math.random() * names.male.length)];
  } else if (type.toLowerCase() === "female") {
    return names.female[Math.floor(Math.random() * names.female.length)];
  }
  return namesCombinedList[
    Math.floor(Math.random() * namesCombinedList.length)
  ];
};

const getRandomUsername = () => {
  const first = usernames[Math.floor(Math.random() * usernames.length)];
  //const second = usernames[Math.floor(Math.random() * usernames.length)];

  return first + Math.floor(Math.random() * 9999).toString();
};

const getRandomDate = () => {
  const now = new Date(new Date().valueOf() - Math.random() * 1e12);
  const day = String(now.getDate()).padStart(2, "0"); // Ensure 2-digit format
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = String(now.getFullYear()); // Get last two digits of year
  return `${day}/${month}/${year}`;
};

penpot.ui.onMessage<any>((message) => {
  if (message === "country-text") {
    const selection = penpot.selection;

    if (selection.length > 0) {
      selection.forEach((element) => {
        if (penpot.utils.types.isText(element)) {
          element.characters =
            country[Math.floor(Math.random() * country.length)];
        }
      });
    } else {
      createTextElement(country[Math.floor(Math.random() * country.length)]);
    }
  }

  if (message === "username-text") {
    const selection = penpot.selection;

    if (selection.length > 0) {
      selection.forEach((element) => {
        if (penpot.utils.types.isText(element)) {
          element.characters = getRandomUsername();
        }
      });
    } else {
      createTextElement(getRandomUsername());
    }
  }

  if (message.msg === "name-text") {
    const selec = penpot.selection;

    if (selec.length > 0) {
      selec.forEach((selected) => {
        if (penpot.utils.types.isText(selected)) {
          selected.characters = getRandomName(message.type);
        }
      });
    } else {
      createTextElement(getRandomName(message.type));
    }
  }

  if (message === "date-text") {
    const selection = penpot.selection;

    if (selection.length > 0) {
      selection.forEach((element) => {
        if (penpot.utils.types.isText(element)) {
          element.characters = getRandomDate();
        }
      });
    } else {
      createTextElement(getRandomDate());
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
