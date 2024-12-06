import { Group, Shape } from "@penpot/plugin-types";
import country from "../public/countries.json";
import names from "../public/names.json";
import usernames from "../public/usernames.json";

import { minidenticon, getRandomColor } from "./avatar";

const namesCombinedList = [...names.male, ...names.female];

penpot.ui.open("Starter Profile Generator", `?theme=${penpot.theme}`);

const createImageElement = async (avatarSeed: string, selection?: Group | Shape) => {
  const svgData = minidenticon(avatarSeed);
  const svgGroup = penpot.createShapeFromSvg(svgData);

  const dimension = [selection ? selection.width : 80, selection ? selection.height : 80];

  if (svgGroup) {
    svgGroup.proportionLock = selection ? false : true;
    svgGroup.resize(dimension[0] * 0.8, dimension[1] * 0.8);

    svgGroup.children.forEach((child) => {
      if (child.name === "base-background") {
        child.remove();
      }
    });

    penpot.flatten([svgGroup]);
    svgGroup.fills = [{ fillOpacity: 1, fillColor: "#ffffff" }];
    svgGroup.name = "base-avatar";

    if (selection && penpot.utils.types.isGroup(selection)) {
      selection.children.forEach((child) => {
        if (child.name === "base-background") {
          child.fills = [{ fillOpacity: 1, fillColor: getRandomColor(avatarSeed) }];
          selection.insertChild(selection.children.length, svgGroup);
          svgGroup.x = child.center.x - svgGroup.width / 2;
          svgGroup.y = child.center.y - svgGroup.height / 2;
        } else {
          child.remove();
        }
      });
    } else if (selection) {
      const avatarGroup = penpot.group([svgGroup]);

      if (avatarGroup) {
        selection.fills = [{ fillOpacity: 1, fillColor: getRandomColor(avatarSeed) }];
        selection.name = "base-background";
        avatarGroup.insertChild(0, selection);
        svgGroup.x = selection.center.x - svgGroup.width / 2;
        svgGroup.y = selection.center.y - svgGroup.height / 2;
        avatarGroup.x = selection ? selection.x : penpot.viewport.center.x;
        avatarGroup.y = selection ? selection.y : penpot.viewport.center.y;

        avatarGroup.name = "avatar-" + avatarSeed;

        penpot.selection = [avatarGroup];
      }
    }
    else {
      const background = penpot.createRectangle()
      background.resize(dimension[0], dimension[1]);
      background.fills = [{ fillOpacity: 1, fillColor: getRandomColor(avatarSeed) }];
      background.name = "base-background";

      const avatarGroup = penpot.group([svgGroup]);

      if (avatarGroup) {
        avatarGroup.insertChild(0, background);
        svgGroup.x = background.center.x - svgGroup.width / 2;
        svgGroup.y = background.center.y - svgGroup.height / 2;
        avatarGroup.x = penpot.viewport.center.x;
        avatarGroup.y = penpot.viewport.center.y;

        avatarGroup.name = "avatar-" + avatarSeed;

        penpot.selection = [avatarGroup];
      }
    }
  }

  /*
  penpot.uploadMediaData('avatar', image, 'image/svg+xml').then((imageData) => {
    const shape = penpot.createRectangle();
    shape.boardX = penpot.viewport.center.x;
    shape.boardY = penpot.viewport.center.y;
    //shape.resize(imageData.width, imageData.height);
    shape.fills = [
      { fillOpacity: 1, fillImage: imageData },
    ];
    //console.log(imageData);
  });*/
};

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
  const second = usernames[Math.floor(Math.random() * usernames.length)];

  if (first.length <= 5 && second.length <= 7) {
    return first + '-' + second;
  }

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
  if (message === "avatar-image") {
    const selection = penpot.selection;

    if (selection.length > 0) {
      selection.forEach((element) => {
        if (penpot.utils.types.isGroup(element) || penpot.utils.types.isEllipse(element) || penpot.utils.types.isRectangle(element)) {
          createImageElement(new Date().getMilliseconds().toString(), element);
        }
        else {
          createImageElement(new Date().getMilliseconds().toString())
        }
      });
    } else {
      createImageElement(new Date().getMilliseconds().toString())
    }
  }

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
