let Data = null;

const request = async () => {
  const response = await fetch("https://restcountries.eu/rest/v2/all");
  if (Data) {
    return;
  }
  Data = await response.json();
  _createTable();
};

request();

function _createTable() {
  option = {
    data: Data,
    maxRow: 5,
    excludeColumns: [
      "regionalBlocs",
      "languages",
      "currencies",
      "translations"
    ],
    sortableColumns: ["name"],
    isStickyHeader: false,
    pagination: {
      per_page_record: 15
    }
  };

  sTable("wrapper", option);
}
