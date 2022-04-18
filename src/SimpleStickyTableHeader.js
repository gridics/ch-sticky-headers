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
    const headArr = Array.from(thead.getElementsByTagName('tr'));

    thead.classList.add('sticky-table-head');
    headArr.forEach(function (tr) {
      const thArr = Array.from(tr.getElementsByTagName('th'));

      thArr.forEach(function (th) {
        const nodeEl = document.createElement('div');

        th.classList.add('fake-div-wrapper');
        nodeEl.classList.add('fake-div-border');
        th.appendChild(nodeEl);
      });
    });

    const arr = Array.from(tbody.getElementsByTagName('tr'));
    if (arr.length > 0) {
      arr[0].classList.add('sticky-table-afterhead-tr');
    }
  }

  function prepareFixedColumn() {
    const arr = Array.from(tbody.getElementsByTagName('tr'));

    if (!arr.length) {
      return;
    }

    arr.forEach(function (tr) {
      const thArr = Array.from(tr.getElementsByTagName('th'));

      if(!thArr.length) {
        return;
      }

      const nodeEl = document.createElement('div');

      tr.classList.add('sticky-table-column');
      thArr[0].classList.add('fake-div-wrapper');
      nodeEl.classList.add('fake-div-border');
      thArr[0].appendChild(nodeEl);
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
