var http = require("https");

function getSuggestion(key, params = {}, callback) {

  // https://www.npmjs.com/search/suggestions?q=test

  let options = {
    "method": "GET",
  };

  var req = http.get("https://www.npmjs.com/search/suggestions?q=" + key, options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);

      parseSuggestion(body, {
        key: key
      }, callback)

    });
  });

  req.end();

}

function parseSuggestion(data, params = {}, callback) {

  let dataString = data.toString()
  let dataObject = JSON.parse(dataString)

  let finalResult = [params.key, []]

  if (dataObject && dataObject.length > 0) {

    let suggestions = dataObject
    suggestions.forEach(suggestion => {
      finalResult[1].push(suggestion.name)
    });
  }

  callback(finalResult)
}

module.exports = (req, res) => {

  const { query = false } = req.query

  res.setHeader('Cache-Control', 'Cache-Control: s-maxage=1, stale-while-revalidate')


  if (query) {

    getSuggestion(query, {}, (parsedData) => {
      res.status(200).json(parsedData)
    })
  } else {
    res.status(404).json([])
  }

}
