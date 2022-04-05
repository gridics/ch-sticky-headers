/**
 * Simple sticky header plugin.
 *
 * @param table
 *   Table element.
 * @param inputOptions
 *   Object with options.
 */
function stickyTableHeader(table, inputOptions = {}) {
  const defaults = {
    mode: 'horizontal',
    noWrapper: false,
  };

  const options = Object.assign({}, defaults, inputOptions);
  const isHorizontal = ['horizontal', 'both'].indexOf(options.mode) > -1;
  const isVertical = ['vertical', 'both'].indexOf(options.mode) > -1;

  if (!table) {
    return;
  }
  const thead = table.getElementsByTagName('thead')[0];
  const tbody = table.getElementsByTagName('tbody')[0];

  if (!tbody) {
    return;
  }
  if (!thead && !isVertical) {
    return;
  }

  function prepareHeader() {
    thead.classList.add('sticky-table-head');

    const arr = Array.from(tbody.getElementsByTagName('tr'));
    if (arr.length > 0) {
      arr[0].classList.add('sticky-table-afterhead-tr');
    }
  }

  function prepareFixedColumn() {
    const arr = Array.from(tbody.getElementsByTagName('th'));

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

export default stickyTableHeader;
