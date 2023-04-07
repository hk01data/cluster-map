const Papa = require('papaparse');
const fs = require("fs");


function main () {
  // read geojson
  fs.open("js/data.geojson", "r", function(err, fileToRead) {
    if (!err) {
      fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err, data) {
      if (!err) {
        const ajson = JSON.parse(data);
        console.log('received data: ', ajson["features"][0]);

        var csv = Papa.unparse(ajson["features"].map((item) => {
          return {
            "lat": item.geometry.coordinates[1],
            "lng": item.geometry.coordinates[0],
            ...item.properties
          }
        }), {
          quotes: true, //or array of booleans
          quoteChar: '"',
          escapeChar: '"',
          delimiter: ",",
          header: true,
          newline: "\r\n",
          skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
          columns: null //or array of strings
        });
        console.log('received csv: ', csv);

        /**
         * Write
         */
        fs.writeFile("js/data.csv", csv, function(err) {
          if (err) {
              return console.log(err);
          }
          console.log("The file was saved!");
        }); 

      } else {
        console.log(err);
      }
      });
    } else {
      console.log(err);
    }
  });

  // output csv
}

main();
