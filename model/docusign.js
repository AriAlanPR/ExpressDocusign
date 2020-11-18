//API
var requester = require('./requester');

var secret_key = '9ebdcd12-18b7-4927-a85f-1cd3e92d269a';
var integration_key = '0bab569b-8ab4-45c6-9c4d-133b7d438cf9';
requester.base_api_url('https://account-d.docusign.com/oauth/auth');

var authorize_Token = async () => {
    var bodytosend = "?response_type=code" +
                        "&scope=signature" +
                        "&client_id=" + integration_key + 
                        "&state=ykv2XLx1BpT5Q0F3MRPHb94j" +
                        "&redirect_uri=" + encodeURIComponent( 'http://localhost:3000/callback' );

    return bodytosend;
}

exports.authorize_Token = authorize_Token;