// ==UserScript==
// @name            TweetDeck - Clear Tweets
// @version         1.1.0
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
  '<a class="tdc-clear-column js-action-header-button column-header-link clear-all-link" data-action="clear"><i class="icon icon-clear-timeline js-show-tip" data-placement="bottom" title="Clear Timeline" data-original-title="Clear Timeline"></i></a>';
var clearAllButton =
  '<a class="tdc-clear-all js-header-action js-app-settings link-clean cf app-nav-link padding-h--16" data-action="clear-all" data-title="Clear All"> <div class="obj-left margin-l--2"> <i class="icon icon-clear-timeline icon-medium"></i> </div> <div class="nbfc padding-ts hide-condensed txt-size--16 app-nav-link-text">Clear All</div> </a>';

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

function init() {
  // Make sure that all of the Columns are Initialized
  if (document.querySelector(".tdc-clear-column") === null) {
    setTimeout(init, 3000);
    return;
  }

  // Add the Click Event to all of the Columns
  document.querySelectorAll(".tdc-clear-column").forEach(cc => {
    cc.onclick = () => {
      // Find the Column ID by traversing up the Parent until a <section> tag is found with the data-column attribute
      var el = cc;
      var columnID = null;
      do {
        el = el.parentElement;
        if (el.hasAttribute("data-column")) {
          columnID = el.getAttribute("data-column");
        }
      } while (columnID === null);

      // Use the TweetDeck controller to clear the column
      window.TD.controller.columnManager.get(columnID).clear();
      return false;
    };
  });

  // Add the Click Event to the 'Clear All' button
  document.querySelector(".tdc-clear-all").onclick = () => {
    window.TD.controller.columnManager.getAllOrdered().forEach(y => {
      if (y.model.state.type == "other") {
        y.clear();
      }
    });
    return false;
  };
}

// Add Global Styles
addGlobalStyle("html.dark .column-title .attribution { font-size: 11px; }");
addGlobalStyle(".tdc-clear-column { cursor: pointer; }");

// Initialize
init();
