var http = require("https");

function getSuggestion(key, params = {}, callback) {

  let options = {
    "method": "POST",
    // "hostname": "www.producthunt.com",
    // "port": 443,
    // "path": "/frontend/graphql",
    "headers": {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0',
      'Accept': '*/*',
      'Accept-Language': 'it,en;q=0.8,fr;q=0.5,de;q=0.3',
      'Referer': 'https://www.producthunt.com/',
      'content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://www.producthunt.com',
      'DNT': '1',
      'Connection': 'keep-alive',
      'TE': 'Trailers',
      'Cookie': '__cfduid=da0014b7cbafe013f4fedb99cecf585f81552751711; ajs_user_id=null; ajs_group_id=null; ajs_anonymous_id=%22161f1849-2992-40b0-9e2b-1637052a091b%22; track_code=576584de81; intercom-id-fe4ce68d4a8352909f553b276994db414d33a55c=51e2b50a-ccbb-432b-bca0-ed88b3532493; first_visit_at=1562233315; first_referer=https://www.producthunt.com/; visitor_id=b13e847f-07c0-43e0-9697-e732fea475ee'
    }
  };

  var req = http.request("https://www.producthunt.com/frontend/graphql", options, function (res) {
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

  let data = {
    "operationName": "SearchPosts",
    "variables": {
      "first": 5,
      "featured": true,
      "query": "'+key+'"
    },
    "query": "query SearchPosts($featured: Boolean, $first: Int, $postedDate: String, $query: String) {\n  search_posts(featured: $featured, first: $first, postedDate: $postedDate, query: $query) {\n    edges {\n      node {\n        id\n        name\n        tagline\n        slug\n        ...PostThumbnail\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PostThumbnail on Post {\n  id\n  name\n  thumbnail {\n    id\n    media_type\n    ...MediaThumbnail\n    __typename\n  }\n  ...PostStatusIcons\n  __typename\n}\n\nfragment MediaThumbnail on Media {\n  id\n  image_uuid\n  __typename\n}\n\nfragment PostStatusIcons on Post {\n  name\n  product_state\n  __typename\n}\n"
  };


  // var dataString = '{"operationName":"SearchPosts","variables":{"first":5,"featured":true,"query":"' + key + '"},"query":"query SearchPosts($featured: Boolean, $first: Int, $postedDate: String, $query: String) {\n  search_posts(featured: $featured, first: $first, postedDate: $postedDate, query: $query) {\n    edges {\n      node {\n        id\n        name\n        tagline\n        slug\n        ...PostThumbnail\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PostThumbnail on Post {\n  id\n  name\n  thumbnail {\n    id\n    media_type\n    ...MediaThumbnail\n    __typename\n  }\n  ...PostStatusIcons\n  __typename\n}\n\nfragment MediaThumbnail on Media {\n  id\n  image_uuid\n  __typename\n}\n\nfragment PostStatusIcons on Post {\n  name\n  product_state\n  __typename\n}\n"}';


  req.write(data.toString());
  req.end();

}

function parseSuggestion(data, params = {}, callback) {

  let dataString = data.toString()
  let dataObject = JSON.parse(dataString)

  let finalResult = [params.key, []]

  if (dataObject && dataObject.data && dataObject.data.search_posts && dataObject.data.search_posts.edges && dataObject.data.search_posts.edges.length > 0) {

    let suggestions = dataObject.data.search_posts.edges
    suggestions.forEach(suggestion => {
      finalResult[1].push(suggestion.node.slug)
    });
  }

  callback(finalResult)
}

module.exports = {
  getSuggestion
};
