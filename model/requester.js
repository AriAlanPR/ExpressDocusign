const fetch = require("node-fetch");

const get = async function(opts) {
  var url = opts.url;
  var headers = opts.headers;
	// Default options are marked with *
	console.log("Get the to: ", url);
	const response = await fetch(url, {
		method: "GET", // *GET, POST, PUT, DELETE, etc.
		headers: headers
	}).catch(handlererror);
	return await response;
};

const post = async function(opts) {
  var url = opts.url;
  var body = opts.body;
  var headers = opts.headers;
	console.log("Post to: ", url);
	// Default options are marked with *
	const response = await fetch(url, {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		//   mode: 'cors', // no-cors, *cors, same-origin
		//   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: headers,
		//   redirect: 'follow', // manual, *follow, error
		//   referrerPolicy: 'no-referrer', // no-referrer, *client
		body: body // body data type must match "Content-Type" header
	}).catch(handlererror);
	return await response;
};

const put = async function(opts) {
  var url = opts.url;
  var body = opts.body;
  var headers = opts.headers;
	console.log("Put to: ", url);
	// Default options are marked with *
	const response = await fetch(url, {
		method: "PUT", // *GET, POST, PUT, DELETE, etc.
		//   mode: 'cors', // no-cors, *cors, same-origin
		//   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: headers,
		//   redirect: 'follow', // manual, *follow, error
		//   referrerPolicy: 'no-referrer', // no-referrer, *client
		body: body // body data type must match "Content-Type" header
	}).catch(handlererror);
	return await response;
};

const _delete = async function(opts) {
	var url = opts.url;
	var body = opts.body;
	var headers = opts.headers;
	  console.log("Delete to: ", url);
	  // Default options are marked with *
	  const response = await fetch(url, {
		  method: "DELETE", // *GET, POST, PUT, DELETE, etc.
		  //   mode: 'cors', // no-cors, *cors, same-origin
		  //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		  credentials: "same-origin", // include, *same-origin, omit
		  headers: headers,
		  //   redirect: 'follow', // manual, *follow, error
		  //   referrerPolicy: 'no-referrer', // no-referrer, *client
		  body: body // body data type must match "Content-Type" header
	  }).catch(handlererror);
	  return await response; // adding .json() parses JSON response into native JavaScript objects
  };

var handlererror = (error) => {
  console.log("Error: ", error);
}

//Class to make easy REST calls, also added code to

//Base API URL
var base_api_url = function(value) {
	if (base_api_url.instance) {
		return base_api_url.instance;
	}

	var api_url = value;
	base_api_url.instance = api_url;

	return api_url;
}

//Base headers
var base_headers = function(value) {
	if (base_headers.instance) {
		return base_headers.instance;
	}

	var props = value;
	base_headers.instance = props;

	return props;
}

var Get = async function(suburl) {
	logger("Get", base_api_url("") + suburl);
	var res = await get({
		url: base_api_url("") + suburl,
		headers: base_headers({})
	});

	return await res.json();
};

var Post = async function(suburl, body) {
	logger("Base api url", JSON.stringify(base_api_url("")));
	logger("Post to", base_api_url("") + suburl);
	logger("Headers", JSON.stringify(base_headers({}), null, 4));
	logger("Body", "Content of body: " + JSON.stringify(body));
	var res =  await post({
		url: base_api_url("") + suburl,
		body: body,
		headers: base_headers({})
	});

	return await res.json();
};

var Put = async function(suburl, body) {
	logger("Put", base_api_url("") + suburl);
	logger("Headers", JSON.stringify(base_headers({}), null, 4));
	var res = await put({
		url: base_api_url("") + suburl,
		body: body,
		headers: base_headers({})
	});

	return await res.json();
};

var _Delete = async function(suburl, body) {
	logger("Delete", base_api_url("") + suburl);
	logger("Headers", JSON.stringify(base_headers({}), null, 4));
	var res = await _delete({
		url: base_api_url("") + suburl,
		body: body,
		headers: base_headers({})
	});

	return await res.json();
};

exports.Get = Get;
exports.Post = Post;
exports.Put = Put;
exports.Delete = _Delete;
exports.base_api_url = base_api_url;
exports.base_headers = base_headers;