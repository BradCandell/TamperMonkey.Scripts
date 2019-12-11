// ==UserScript==
// @name         FontAwesome - Add the Ability to Copy only the Class Names
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a convenient way for to copy only the Class Names of a specific FontAwesome icon.
// @author       Brad Candell
// @match        https://fontawesome.com/icons/*
// @grant        GM_setClipboard
// ==/UserScript==

function init() {
  if (document.querySelector("code.dib") == null) {
    setTimeout(init, 400);
    return;
  }

  var dotVector = document.querySelector('svg[data-icon="dot"]');
  var fullCode = document.querySelectorAll("code.dib")[1];
  var list = fullCode.parentElement.parentElement;

  var vectorCopy = dotVector.cloneNode(true);
  var classNamesOnly = fullCode.cloneNode(true);
  classNamesOnly.removeChild(classNamesOnly.querySelector("span"));
  classNamesOnly.removeChild(classNamesOnly.querySelector("span"));
  classNamesOnly.setAttribute("data-balloon", "Copy Class Names");

  classNamesOnly.onclick = () => {
    classNamesOnly.setAttribute("data-balloon", "Copied");
    classNamesOnly.classList.add("animated");
    classNamesOnly.classList.add("bounceIn");
    console.log(
      "Copying the Class Names to the Clipboard",
      classNamesOnly.innerText
    );
    GM_setClipboard(classNamesOnly.innerText);

    setTimeout(() => {
      classNamesOnly.classList.remove("animated");
      classNamesOnly.classList.remove("bounceIn");
      classNamesOnly.setAttribute("data-balloon", "Copy Class Names");
    }, 750);
  };

  var separator = document.createElement("li");
  separator.append(vectorCopy);
  separator.setAttribute("class", "mr2 gray5");
  separator.style.order = 14;
  separator.style.marginLeft = "5px";

  var classListItem = document.createElement("li");
  classListItem.append(classNamesOnly);
  classListItem.setAttribute(
    "class",
    "mt2 mt0-l mr2-l w-100 w-auto-l pt2 pt0-l bt bt-0-l bw1 b--gray1"
  );
  classListItem.style.order = 14;

  list.append(separator);
  list.append(classListItem);
}

init();
