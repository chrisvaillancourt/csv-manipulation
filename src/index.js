import { csv } from "d3-fetch";
async function getCsv() {
  let data = await csv('../data/vulnerability-data.csv')
  console.log(`data length: ${data.length}`)
  console.log(data[0])
  
  data = data.slice(0, 10000); // temporarily reduce data size
  const idsArr = new Set(data.map(row => row["GEOID"]))
  let output = []
  console.time('forEach loop')
  idsArr.forEach((id, index) => {

    let filtered = data.filter(item => item["GEOID"] == id).reduce((accum, currVal) => {
      accum[currVal["aspect_name"]] = currVal["value"];
      // TODO ADD PRANK ATTRIBUTE
      //TODO USE A MAP INSTEAD OF OBJECT LITERAL
      return accum;
    }, {
      id,
    })

    output.push(filtered)



  })
  console.timeEnd('forEach loop')
  return output
}


function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      };
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}






// exportToCsv('export.csv', [
//   ['name', 'description'],
//   ['david', '123'],
//   ['jona', '""'],
//   ['a', 'b'],

// ])


function ConvertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }
  var blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  }
  // return str;
}



getCsv().then(data => {
  console.log(data)
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = "data.json"
  a.href = url
  a.textContent = "DL"
  document.querySelector('div').appendChild(a)
  console.log('end')
})
