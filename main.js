// let Data = null;
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
    excludeColumns: ["languages", "translations", "currencies"]
  };

  sTable("wrapper", option);
}
