'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Simple sticky header plugin.
 *
 * @param table
 *   Table element.
 * @param options
 *   Object with options.
 */
function stickyTableHeader(table) {
  var inputOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var defaults = {
    scrollParent: document.body,
    mode: 'horizontal',
    noWrapper: false,
    horizontalAddHeight: 0
  };

  var options = Object.assign({}, defaults, inputOptions);
  var isHorizontal = ['horizontal', 'both'].indexOf(options.mode) > -1;
  var isVertical = ['vertical', 'both'].indexOf(options.mode) > -1;
  var horizontalAddHeight = options.horizontalAddHeight;


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

  var headerCells = thead.getElementsByTagName('th');

  var resizeTimeout = null;
  var sticked = false;
  var stickyTableHorizontal = null;
  var stickyTableHorizontalWrapper = null;
  var stickyTableVertical = null;
  var stickyHeadTimeout = null;
  var stickyColTimeout = null;
  var stickyTableWrapper = null;
  var stickyTableVerticalHead = null;

  function setWidth() {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
    var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    // Function to apply sticky table width, etc.
    function applyWidth() {
      // Set sticky table dynamic styles.
      var computedTableStyle = window.getComputedStyle(table);
      var tableWidth = parseFloat(computedTableStyle.getPropertyValue('width'));
      stickyTableHorizontalWrapper.style.width = tableWidth + 'px';
      stickyTableHorizontalWrapper.style.left = tableBox.left + 'px';
      stickyTableHorizontalWrapper.style.top = parentBox.top + 'px';
      scrollEventListener();
    }
    clearTimeout(stickyHeadTimeout);

    var parentBox = options.scrollParent.getBoundingClientRect();
    var tableBox = stickyTableWrapper.getBoundingClientRect();
    applyWidth();
    stickyHeadTimeout = setTimeout(function () {
      applyWidth();
    }, timeout);
  }

  function prepareHeader() {
    var clonedThead = thead.cloneNode(true);
    var clonedBody = tbody.cloneNode(true);
    stickyTableHorizontalWrapper = document.createElement('div');
    stickyTableHorizontal = document.createElement('table');

    // Set base styles for sticky table.
    Object.assign(stickyTableHorizontalWrapper.style, {
      position: 'fixed',
      overflow: 'hidden',
      display: 'none',
      pointerEvents: 'none',
      height: thead.offsetHeight + horizontalAddHeight + 'px',
      zIndex: 2
    });
    stickyTableHorizontal.classList.add('sticky-table');
    stickyTableHorizontalWrapper.classList.add('sticky-horizontal-wrapper');

    // Set base styles for sticky table's head.
    clonedThead.style.transition = 'none';

    stickyTableHorizontal.appendChild(clonedThead);
    stickyTableHorizontal.appendChild(clonedBody);
    stickyTableHorizontalWrapper.appendChild(stickyTableHorizontal);
    table.parentNode.appendChild(stickyTableHorizontalWrapper);
    setWidth(300, true);
  }

  function setColumnWidth() {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;

    if (stickyTableVertical) {
      var setCorrectDimension = function setCorrectDimension(rows, parent) {
        [].forEach.call(rows, function (tr, rowKey) {
          [].forEach.call(tr.children, function (cell, cellKey) {
            if (parent.children[rowKey] && parent.children[rowKey].children[cellKey]) {
              var computedCellStyle = window.getComputedStyle(parent.children[rowKey].children[cellKey]);
              cell.style.width = parent.children[rowKey].children[cellKey].offsetWidth + 'px';
              cell.style.height = parent.children[rowKey].children[cellKey].offsetHeight + 'px';
            }
          });
        });
      };

      clearTimeout(stickyColTimeout);

      stickyColTimeout = setTimeout(function () {
        var headRows = stickyTableVertical.querySelectorAll('thead tr');
        var bodyRows = stickyTableVertical.querySelectorAll('tbody tr');
        setCorrectDimension(headRows, thead);
        setCorrectDimension(bodyRows, tbody);
      }, timeout);
    }
  }

  function prepareFixedColumn() {
    if (!tbody.getElementsByTagName('th').length) {
      return;
    }
    stickyTableVertical = document.createElement('table');
    stickyTableVertical.classList.add('sticky-table-vertical');
    var stickyTableVerticalBody = document.createElement('tbody');
    var bodyTRs = tbody.getElementsByTagName('tr');
    var cols = 0;
    while (bodyTRs[0].children[cols].nodeName.toLowerCase() === 'th') {
      cols++;
    }
    if (cols) {
      var generateRows = function generateRows(rows, rowsContainer) {
        [].forEach.call(rows, function (row) {
          var newTr = document.createElement('tr');
          for (var i = 0; i < cols; i++) {
            var col = row.children[i];
            if (col) {
              newTr.appendChild(col.cloneNode(true));
            }
          }
          rowsContainer.appendChild(newTr);
        });
      };

      generateRows(tbody.getElementsByTagName('tr'), stickyTableVerticalBody);
      if (thead) {
        stickyTableVerticalHead = document.createElement('thead');
        generateRows(thead.getElementsByTagName('tr'), stickyTableVerticalHead);
        Object.assign(stickyTableVerticalHead.style, {
          left: 0,
          top: 0,
          transition: 'none'
        });
        stickyTableVertical.appendChild(stickyTableVerticalHead);
      }
      stickyTableVertical.appendChild(stickyTableVerticalBody);
    }
    Object.assign(stickyTableVertical.style, {
      position: 'absolute',
      top: thead ? getTheadOffset() + 'px' : 0,
      left: 0,
      margin: 0,
      zIndex: 3,
      display: 'none',
      overflow: 'visible',
      transition: 'none'
    });

    table.parentNode.appendChild(stickyTableVertical);
    setColumnWidth();
  }

  function getTheadOffset() {
    var theadOffset = thead ? thead.offsetTop : 0;
    // Check if it's caption and it has greater height than thead top offset.
    if (theadOffset > 0) {
      var caption = table.querySelector('caption');
      if (caption) {
        var captionStyle = window.getComputedStyle(caption);
        var captionHeight = parseFloat(captionStyle.getPropertyValue('height'));
        if (captionHeight > theadOffset) {
          theadOffset = captionHeight;
        }
      }
    }
    return theadOffset;
  }

  function scrollEventListener() {
    var _stickyTableWrapper = stickyTableWrapper,
        offsetTop = _stickyTableWrapper.offsetTop;

    var bottomStickOffset = offsetTop + table.offsetHeight - thead.offsetHeight;
    var topStickOffset = offsetTop - options.scrollParent.scrollTop;
    var theadOffset = getTheadOffset();
    if (topStickOffset + theadOffset < 0 && bottomStickOffset + theadOffset > options.scrollParent.scrollTop) {
      sticked = true;
      stickyTableHorizontalWrapper.style.removeProperty('display');
      if (table.scrollLeft !== stickyTableHorizontal.scrollLeft) {
        stickyTableHorizontal.scrollLeft = table.scrollLeft;
      }

      if (stickyTableVerticalHead) {
        stickyTableVertical.style.paddingTop = thead.offsetHeight + 'px';
        stickyTableVertical.classList.add('head-sticked');
        Object.assign(stickyTableVerticalHead.style, {
          transform: 'translate3d(0px, ' + (Math.abs(topStickOffset) - theadOffset) + 'px, 0px)',
          position: 'absolute'
        });
      }
    }
    if (sticked === true && (topStickOffset > 0 || bottomStickOffset < options.scrollParent.scrollTop)) {
      sticked = false;
      stickyTableHorizontalWrapper.style.display = 'none';
      if (stickyTableVerticalHead) {
        stickyTableVertical.style.paddingTop = null;
        stickyTableVertical.style.removeProperty('paddingTop');
        stickyTableVertical.classList.remove('head-sticked');
        stickyTableVerticalHead.style.removeProperty('transform');
        stickyTableVerticalHead.style.removeProperty('position');
      }
    }
  }

  if (!options.noWrapper) {
    stickyTableWrapper = document.createElement('div');
    stickyTableWrapper.classList.add('sticky-table-wrapper');
    table.parentNode.insertBefore(stickyTableWrapper, table);
    stickyTableWrapper.appendChild(table);
  } else {
    stickyTableWrapper = table.parentNode;
  }
  if (stickyTableWrapper) {
    stickyTableWrapper.style.position = 'relative';
  }

  // Prepare header with base styles and html.
  if (isHorizontal && thead) {
    prepareHeader();
  }

  // Prepare vertical sticky column.
  if (isVertical && tbody) {
    prepareFixedColumn();
  }
  // Start listen for parent scroll.
  options.scrollParent.addEventListener('scroll', scrollEventListener);

  // Table scroll event, to have same scrollLeft position for sticky table based on parent one.
  table.addEventListener('scroll', function () {
    var scrollLeft = table.scrollLeft;
    // We need this

    if (scrollLeft && table.offsetWidth + scrollLeft >= table.scrollWidth) {
      stickyTableHorizontal.style.marginLeft = '-1px';
    } else {
      stickyTableHorizontal.style.marginLeft = null;
      stickyTableHorizontal.style.removeProperty('marginLeft');
    }
    stickyTableHorizontal.scrollLeft = scrollLeft;
    // Scroll event handler for vertical sticky table if exists.
    if (stickyTableVertical) {
      if (scrollLeft) {
        stickyTableVertical.style.removeProperty('display');
      } else {
        stickyTableVertical.style.display = 'none';
      }
    }
  });

  // Resize with debounce to update widths.
  function resizeDebounce(e) {
    var timeout = e.detail && e.detail.timeout ? e.detail.timeout : 500;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      setWidth();
      setColumnWidth();
    }, timeout);
  }
  window.addEventListener('resize', resizeDebounce);
}

exports.default = stickyTableHeader;