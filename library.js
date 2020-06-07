let private_options = null;
let listElm = null;
function sTable(id = "", _options = null) {
  private_options = checkForOptions(_options);

  if (private_options.hasOwnProperty("pagination")) {
    createElem(id, private_options);
    let pagination = new Pagination(private_options);
    pagination.init();
  } else {
    createElem(id, private_options);

    loadMore(private_options);
  }
}

function withoutPagination(id = "", options = null) {
  if (id && options) {
    const table = createTable(options);
    if (!table) {
      return;
    }
    const selector = document.getElementById(id);
    selector.innerHTML = table;

    setTimeout(() => {
      if (!listElm) {
        listElm = document;
      }

      document.addEventListener("scroll", function() {
        if (
          listElm.scrollingElement.scrollTop +
            listElm.scrollingElement.clientHeight >=
          listElm.scrollingElement.scrollHeight
        ) {
          loadMore();
        }
      });
    }, 100);
  }
}

function createTable(options) {
  let table = "";
  let maxHeaderCount = 0;
  const data = options.data;
  if (!data && data.length < 0) {
    return;
  }

  const _keys = Object.keys(data[0]);
  maxHeaderCount = _keys.length;
  //   Create Header Starts here
  table = createHeader(_keys);

  if (!table) {
    return;
  }

  let maxCol = getMaxCol(
    options.hasOwnProperty("maxCol") ? options.maxCol : data.length
  );

  for (let i = 0; i < maxCol; i++) {
    const row = data[i];
    let rowLength = Object.keys(row).length;
    if (rowLength > maxHeaderCount) {
      maxHeaderCount = rowLength;
    }

    let str = "<tr>";

    let count = 0;
    let maxCount = 0;
    let maxRows = getMaxRow(rowLength);
    for (const key in row) {
      if (
        row.hasOwnProperty(key) &&
        options.hasOwnProperty("excludeColumns") &&
        options.excludeColumns.indexOf(key) == -1 &&
        maxCount < maxRows
      ) {
        str += `<td>${row[key]}</td>`;
        count++;
        maxCount++;
      }
    }

    str += "</tr>";
    table += str;
  }

  return "<table id='zTable'>" + table + "</table>";
}

function createHeader(keys = []) {
  if (keys.length <= 0) {
    return;
  }

  let str = "<tr>";

  let stickyHeader = private_options.hasOwnProperty("isStickyHeader")
    ? private_options.isStickyHeader
    : false;

  let maxRows = getMaxRow(keys.length);
  for (let i = 0; i < maxRows; i++) {
    if (
      (private_options.hasOwnProperty("excludeColumns") &&
        private_options.excludeColumns.indexOf(keys[i]) == -1) ||
      keys[i]
    ) {
      let isColumnSortable = private_options.hasOwnProperty("sortableColumns")
        ? private_options.sortableColumns
          ? private_options.sortableColumns.indexOf(keys[i]) != -1
          : false
        : false;

      if (isColumnSortable) {
        str += `<th class='${
          stickyHeader ? "sticky-header" : ""
        } sortableIcon ' onclick='sortTable(${i})' >${
          keys[i]
        }  <span class="icon"> &#8593; &#8595; </span></th>`;
      } else {
        str += `<th class='${stickyHeader ? "sticky-header" : ""}'  >
        ${keys[i]}
        </th>`;
      }
    }
  }

  str += "</tr>";
  return str;
}

function addSortFunction(i) {
  return sortTable(i);
}

function getMaxRow(_length = 0) {
  if (!_length) {
    return 0;
  }

  return private_options.hasOwnProperty("maxRow")
    ? private_options.maxRow
    : _length;
}

function getMaxCol(col = 0) {
  return private_options.hasOwnProperty("maxCol")
    ? private_options.maxCol
    : col;
}

function Pagination(_option = null) {
  const objJson = _option.data;
  const prevButton = document.getElementById("button_prev");
  const nextButton = document.getElementById("button_next");
  const clickPageNumber = document.querySelectorAll(".clickPageNumber");

  let current_page = 1;
  let records_per_page = _option.pagination.per_page_record;

  this.init = function() {
    if (_option.pagination) {
      changePage(1);
      pageNumbers();
      selectedPage();
      clickPage();
      addEventListeners();
    } else {
      withoutPagination("tableContainer", _option);
    }
  };

  let addEventListeners = function() {
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);
  };

  let selectedPage = function() {
    let page_number = document
      .getElementById("page_number")
      .getElementsByClassName("clickPageNumber");
    for (let i = 0; i < page_number.length; i++) {
      if (i == current_page - 1) {
        page_number[i].style.opacity = "1.0";
      } else {
        page_number[i].style.opacity = "0.5";
      }
    }
  };

  let checkButtonOpacity = function() {
    current_page == 1
      ? prevButton.classList.add("opacity")
      : prevButton.classList.remove("opacity");
    current_page == numPages()
      ? nextButton.classList.add("opacity")
      : nextButton.classList.remove("opacity");
  };

  let changePage = function(page) {
    //   const listingTable = document.getElementById("listingTable");

    if (page < 1) {
      page = 1;
    }
    if (page > numPages() - 1) {
      page = numPages();
    }

    //   listingTable.innerHTML = "";
    var i = (page - 1) * records_per_page;
    var lL = page * records_per_page;

    _option.data = objJson.slice(i, lL);

    withoutPagination("tableContainer", _option);

    checkButtonOpacity();
    selectedPage();
    return;
  };

  let prevPage = function() {
    if (current_page > 1) {
      current_page--;
      changePage(current_page);
    }
  };

  let nextPage = function() {
    if (current_page < numPages()) {
      current_page++;
      changePage(current_page);
    }
  };

  let clickPage = function() {
    document.addEventListener("click", function(e) {
      if (
        e.target.nodeName == "SPAN" &&
        e.target.classList.contains("clickPageNumber")
      ) {
        current_page = e.target.textContent;
        changePage(current_page);
      }
    });
  };

  let pageNumbers = function() {
    let pageNumber = document.getElementById("page_number");
    pageNumber.innerHTML = "";

    for (let i = 1; i < numPages() + 1; i++) {
      pageNumber.innerHTML += "<span class='clickPageNumber'>" + i + "</span>";
    }
  };

  let numPages = function() {
    return Math.ceil(objJson.length / records_per_page);
  };
}

function createElem(id = "", _options) {
  const wrapper = document.getElementById(id);

  if (id) {
    if (_options.hasOwnProperty("pagination")) {
      wrapper.innerHTML = `
            <div class="pagination">
            <div class="container" id="tableContainer"></div>
            <div class="pagination-block">
            <span class="pageButton outline-none" id="button_prev">Prev</span>
            <span id="page_number" class="outline-none"></span>
            <span class="pageButton outline-none" id="button_next">Next</span>
        </div>
      </div>`;
    } else {
      wrapper.innerHTML = `<div class="container" id="tableContainer"></div>`;
    }
  }
}

function sortTable(n) {
  setTimeout(() => {
    sort(n);
  }, 0);
}

function sort(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("zTable");
  if (!table) {
    return;
  }
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
    no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
      first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
        one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function checkForOptions(options) {
  // Exclude option
  if (!options.hasOwnProperty("excludeColumns")) {
    options["excludeColumns"] = [];
  }

  return options;
}

var endItem = 25;
var loadMore = function() {
  let _options = { ...private_options };
  if (_options.data.length < 25) {
    endItem = _options.data.length;
    _options.data = _options.data.slice(0, endItem);
    withoutPagination("tableContainer", _options);
  } else {
    if (endItem <= _options.data.length) {
      _options.data = _options.data.slice(0, endItem);
      withoutPagination("tableContainer", _options);
      endItem = endItem + 25;
    }
  }
};

// Detect when scrolled to bottom.

module.exports.sTable = sTable;
