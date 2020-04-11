import { csv } from "d3-fetch";

async function manipulateData() {
  console.time('manipulateData')
  let data = await csv('../data/vulnerability-data.csv')
  // console.log(`data length: ${data.length}`)
  // console.log(data[0])
  const allIds = new Set(data.map(row => row["GEOID"]))
  // data = data.slice(0, 10000); // temporarily reduce data size
  const idsArr = new Set(data.map(row => row["GEOID"]))
  let output = []
  // console.log(data.filter(item => item["GEOID"] == '02020000101'))
  
  idsArr.forEach(id => {
    let filtered = data.filter(item => item["GEOID"] == id).reduce((accum, currVal) => {
      const colName = currVal["aspect_name"];
      accum[colName] = currVal["value"];
      accum[`${colName}_prank`] = currVal["prank"];

      return accum;
    }, {
      id,
    })

    output.push(filtered)



  })
  console.timeEnd('manipulateData')
  return output
}

manipulateData().then(data => {
  // console.log(data)
  console.time('parsing json')
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = "data.json"
  a.href = url
  a.textContent = "DL"
  document.querySelector('div').appendChild(a)
  console.timeEnd('parsing json')
})
