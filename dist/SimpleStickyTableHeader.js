'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
    thead.classList.add('sticky-table-head');

    var arr = Array.from(tbody.getElementsByTagName('tr'));
    if (arr.length > 0) {
      arr[0].classList.add('sticky-table-afterhead-tr');
    }
  }

  function prepareFixedColumn() {
    var arr = Array.from(tbody.getElementsByTagName('th'));

    if (!arr.length) {
      return;
    }

    arr.forEach(function (tr) {
      tr.classList.add('sticky-table-column');
    });
  }

  // Prepare header with base styles and html.
  if (isHorizontal && thead) {
    prepareHeader();
  }

  // Prepare vertical sticky column.
  if (isVertical && tbody) {
    prepareFixedColumn();
  }
}

exports.default = stickyTableHeader;