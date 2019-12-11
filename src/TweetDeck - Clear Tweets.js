// ==UserScript==
// @name            TweetDeck - Clear Tweets
// @version         1.1.2
// @author          Brad Candell
// @description     Adds a more convenient ways to clear a column or columns using the TD Controller for a much smoother interaction
// @match           https://tweetdeck.twitter.com/*
// @match           https://www.tweetdeck.twitter.com/*
// @grant           none
// @license         License:X11 (MIT)
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName("head")[0];
  if (!head) {
    return;
  }
  style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css.replace(/;/g, " !important;");
  head.appendChild(style);
}

// Arrange the markup for the clear options
var clearButton =
  '<a class="tdc-clear-column column-header-link"><i class="icon icon-clear-timeline tdc-icon-clear-timeline js-show-tip" data-placement="bottom" title="Clear Timeline" data-original-title="Clear Timeline"></i></a>';
var clearAllButton =
  '<a class="tdc-clear-all js-header-action js-app-settings link-clean cf app-nav-link padding-h--16" data-action="clear-all" data-title="Clear All"> <div class="obj-left margin-l--2"> <i class="icon icon-clear-timeline tdc-icon-clear-all-timelines icon-medium"></i> </div> <div class="nbfc padding-ts hide-condensed txt-size--16 app-nav-link-text">Clear All</div> </a>';

// Modify the mustache template to include the respective modifications
window.TD_mustaches["column/column_header.mustache"] = window.TD_mustaches[
  "column/column_header.mustache"
].replace(
  '<div class="column-header-links">',
  '<div class="column-header-links">' + clearButton
);
window.TD_mustaches["topbar/app_header.mustache"] = window.TD_mustaches[
  "topbar/app_header.mustache"
].replace("</a> </nav>", "</a>" + clearAllButton + "</nav>");

// Add the Click Event to all of the Columns
document.addEventListener("click", function(e) {
  if (!e.target.matches(".tdc-icon-clear-timeline")) return;
  e.preventDefault();

  var element = e.target;
  var columnID = null;

  do {
    element = element.parentElement;
    if (element === undefined || element === null) {
      break;
    }
    if (element.hasAttribute("data-column")) {
      columnID = element.getAttribute("data-column");
    }
  } while (columnID === null);

  if (columnID !== undefined) {
    window.TD.controller.columnManager.get(columnID).clear();
  }
});

// Add a Click Event for the Clear All button
document.addEventListener("click", function(e) {
  if (!e.target.matches(".tdc-icon-clear-all-timelines")) return;
  e.preventDefault();
  window.TD.controller.columnManager.getAllOrdered().forEach(col => {
    if (col.model.state.type == "other") {
      col.clear();
    }
  });
});

// Add Global Styles
addGlobalStyle("html.dark .column-title .attribution { font-size: 11px; }");
addGlobalStyle(".tdc-clear-column { cursor: pointer; }");
