"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Simple sticky header plugin.
 *
 * @param table
 *   Table element.
 * @param inputOptions
 *   Object with options.
 */
function stickyTableHeader(table) {
  var inputOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaults = {
    mode: 'horizontal',
    noWrapper: false
  };
  var options = Object.assign({}, defaults, inputOptions);
  var isHorizontal = ['horizontal', 'both'].indexOf(options.mode) > -1;
  var isVertical = ['vertical', 'both'].indexOf(options.mode) > -1;
  var colsToStick = [];
  if (!table) {
    return;
  }
  var thead = table.getElementsByTagName('thead')[0];
  var tbody = table.getElementsByTagName('tbody')[0];
  if (!tbody) {
    return;
  }
  if (!thead && !isVertical) {
    return;
  }
  function prepareHeader() {
    var headArr = Array.from(thead.getElementsByTagName('tr'));
    thead.classList.add('sticky-table-head');
    headArr.forEach(function (tr) {
      var thArr = Array.from(tr.getElementsByTagName('th'));
      if (isVertical) {
        tr.classList.add('sticky-table-column-header');
        colsToStick.forEach(function (thIndex) {
          thArr[thIndex].classList.add('sticky-column-cell');
        });
      }
      thArr.forEach(function (th) {
        var nodeEl = document.createElement('div');
        th.classList.add('fake-div-wrapper');
        nodeEl.classList.add('fake-div-border');
        th.appendChild(nodeEl);

        // Fix accessibility: add aria-hidden to empty table headers
        var text = th.textContent.trim();
        var hasVisibleContent = text || th.querySelector('*:not(.fake-div-border)');
        if (!hasVisibleContent) {
          th.setAttribute('aria-hidden', 'true');
        }
      });
    });
    var arr = Array.from(tbody.getElementsByTagName('tr'));
    if (arr.length > 0) {
      arr[0].classList.add('sticky-table-afterhead-tr');
    }
  }
  function prepareFixedColumn() {
    var arr = Array.from(tbody.getElementsByTagName('tr'));
    if (!arr.length) {
      return;
    }
    var index = 0;
    while (arr[0].children[index] && arr[0].children[index].nodeName.toLowerCase() === 'th') {
      colsToStick.push(index);
      index++;
    }
    arr.forEach(function (tr) {
      var thArr = Array.from(tr.getElementsByTagName('th'));
      if (!thArr.length) {
        return;
      }
      var nodeEl = document.createElement('div');
      nodeEl.classList.add('fake-div-border');
      tr.classList.add('sticky-table-column');
      colsToStick.forEach(function (thIndex) {
        if (thArr[thIndex]) {
          thArr[thIndex].classList.add('fake-div-wrapper');
          thArr[thIndex].appendChild(nodeEl);
          thArr[thIndex].classList.add('sticky-column-cell');
        }
      });
    });
  }

  // Prepare vertical sticky column.
  if (isVertical && tbody) {
    prepareFixedColumn();
  }

  // Prepare header with base styles and html.
  if (isHorizontal && thead) {
    prepareHeader();
  }
}
var _default = exports["default"] = stickyTableHeader;