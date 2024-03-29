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
  const colsToStick = [];

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

      if (isVertical) {
        tr.classList.add('sticky-table-column-header');
        colsToStick.forEach((thIndex) => {
          thArr[thIndex].classList.add('sticky-column-cell');
        });
      }
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

    let index = 0;
    while (arr[0].children[index] && (arr[0].children[index].nodeName.toLowerCase() === 'th')) {
      colsToStick.push(index);
      index++;
    }

    arr.forEach(function (tr) {
      const thArr = Array.from(tr.getElementsByTagName('th'));

      if(!thArr.length) {
        return;
      }

      const nodeEl = document.createElement('div');

      nodeEl.classList.add('fake-div-border');
      tr.classList.add('sticky-table-column');

      colsToStick.forEach((thIndex) => {
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

export default stickyTableHeader;
