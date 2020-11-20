//API
'use strict';

const requester = require('./requester');
const moment = require('moment');

const account_id = '36da5cd1-fa11-4354-b9db-eeb1cc682914';
const secret_key = '9ebdcd12-18b7-4927-a85f-1cd3e92d269a';
const integration_key = '0bab569b-8ab4-45c6-9c4d-133b7d438cf9';
const state = 'ykv2XLx1BpT5Q0F3MRPHb94j';
const scope = 'signature';
const base_path = 'https://demo.docusign.net/';
const base_auth_url = 'https://account-d.docusign.com/oauth/';
const response_type = 'code';
const grant_type = 'authorization_code';

var get_Consent = () => {
    requester.base_api_url(base_auth_url);
    var bodytosend = requester.base_api_url.instance + 
                        "auth?response_type=" + response_type +
                        "&scope=" + scope +
                        "&client_id=" + integration_key + 
                        "&state=" + state +
                        "&redirect_uri=" + encodeURIComponent( 'http://localhost:3000/docusign/callback' );

    return bodytosend;
}

var authorize_Token = async (code) => {
    //set the combination of integration and secret key in a string
    var authorization_header = integration_key + ':' + secret_key;
    //generate Buffer object to convert to base64 string\
    let buff = Buffer.from(authorization_header, "utf8");
    //Convert data to base64 String
    authorization_header = 'Basic ' + buff.toString("base64");
    //Define headers with base64 String
    authorization_header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: authorization_header
    }

    //ensure the base url is the authorization url for DocuSign
    requester.base_api_url(base_auth_url);
    //set the Authorization header in requester
    requester.base_headers(authorization_header);

    //define body for url as url_form_format
    let body = 'grant_type=' + grant_type + '&code=' + code;

    //make call and capture response
    var response = await requester.Post('token', body);
    
    exports.token_expiration = moment().add(response.expires_in, "m");
    exports.refresh_token = response.refresh_token;
    //return response as json
    return response; 
}

var token_refresh = {
    "access_token": "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwAA4YzLsozYSAgAACGw2fWM2EgCAMeumPlr911Lsz7qZ2tDThMVAAEAAAAYAAEAAAAFAAAADQAkAAAAMGJhYjU2OWItOGFiNC00NWM2LTljNGQtMTMzYjdkNDM4Y2Y5IgAkAAAAMGJhYjU2OWItOGFiNC00NWM2LTljNGQtMTMzYjdkNDM4Y2Y5MAAARagksozYSDcAYg93ZiJLkk6BvkQKqUdMJw.T0fnvbwiWHLTrnkH0Gr2_sdTG6PVlUUtphzDpnS-tZFsRYX9wf3hKnaI6lzbds-tgtt1wl8xKIGx7hUxWLisUU59zK2_sTFVz8lhSdJ1evzRdNGw749DVbgkgTwyGmpETpQuvDkb0b64TXFMw6ukkijlwOvQ1UHYGXeZr0pXJYhPVhQjlbGcnY0KwBZ-m155XkZnB1JcgLBMxL3G8KZnNWdNKtIGl7O6mEbqNrDrOG9r4Ucp5uZYKgRds-7mtXpYo8LzSMOyzEh0QM5Eb5Mmgq0CYwkMTbEiutOKfNpDcV_7LMViS1NmtFmVWPJFLz_iWUfMBTVgIuNWNtwHrLzqtw", 
    "token_type": "Bearer", 
    "refresh_token": "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAgABwAA4YzLsozYSAgAAGHxw0Wk2EgCAMeumPlr911Lsz7qZ2tDThMVAAEAAAAYAAEAAAAFAAAADQAkAAAAMGJhYjU2OWItOGFiNC00NWM2LTljNGQtMTMzYjdkNDM4Y2Y5IgAkAAAAMGJhYjU2OWItOGFiNC00NWM2LTljNGQtMTMzYjdkNDM4Y2Y5MAAARagksozYSDcAYg93ZiJLkk6BvkQKqUdMJw.k-y4joKAtXgzNfxeICUo9tLPzpV68TEtCiEqiswsRGn08DUImlUbswOdqk70eAzaNGtrgfpyzTJH0QEPJ64otVaP4lkRRkAugcL43QTn61TYnX5r2f03pyGTjxJbVUF-JlheFurN3SWaXO1uzAYdUludtRymf0mgnZvAQjt8qEhRlESIYxF_MbxcTKlUUmSTXJoZmruL4AUQ2Aqbgfsu-aRAk69oRRO0I-7L2h3sX1LfQ1hm_xGdIUS9tUHlUWB3a6H9pNUXxMqmhMPDV_jnFw6stXxfes0O2J6vZpfoBcij877yUW2Q3CiUM1CO1Dm5I3vvZXc0JcNzraaWo3mBxA", 
    "expires_in": 28800
}

var check_Token = (token) => {
    let notoken = !token;
    let now = moment();
    let needToken = notoken || moment(exports.token_expiration).subtract(3, 'm').isBefore(now);

    return (!needToken);
}

var worker = async(args) => { 
    requester.base_api_url(base_path);   
    requester.base_headers({
        'Content-Type': "application/json",
        Authorization: 'Bearer ' + args.accessToken
    });

    let options = {fromDate: moment().subtract(30, 'days').format()};

    let results = await requester.Get(`restapi/v2/accounts/${account_id}/envelopes?from_date=2016-01-01`);

    console.log("results", results);

    return results;
}

var listEnvelopes = async (token) => {
    var isvalidToken = check_Token(token);

    if(isvalidToken){
        let files = await worker({
            accessToken: token, 
            basePath: base_path,
            accountId: account_id
        });
        
        return files;
    } else {
        return null;
    }

}

exports.get_Consent = get_Consent;
exports.authorize_Token = authorize_Token;
exports.listEnvelopes = listEnvelopes;