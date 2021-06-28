//API
'use strict';

const requester = require('./requester');
const moment = require('moment');
const docusign = require('docusign-esign');

const account_id = '';
const secret_key = '';
const integration_key = '';
const state = '';
const scope = 'signature';
const base_path = 'https://demo.docusign.net/';
const base_auth_url = 'https://account-d.docusign.com/oauth/';
const response_type = 'code';
const grant_type = 'authorization_code';
let jsonHeaders = {
    'Content-Type': "application/json",
    Authorization: ''
}
let account_path = `accounts/${account_id}`;
let dsApiClient = new docusign.ApiClient();
dsApiClient.setBasePath(`${base_path}restapi`);


// let envelope_path = (value) => {
//     if(!envelope_path.instance || (typeof value === 'string' && value.trim().length > 0)) {
//         envelope_path.instance = `envelopes/${value}`;
//     }

//     return envelope_path.instance;
// }
// let document_path = (value) => {
//     if(!document_path.instance || (typeof value === 'string' && value.trim().length > 0)) {
//         document_path.instance = `documents/${value}`;
//     }

//     return document_path.instance;
// }

var get_Consent = () => {
    requester.base_api_url(base_auth_url);
    var bodytosend = requester.base_api_url.instance + 
                        "auth?response_type=" + response_type +
                        "&scope=" + scope +
                        "&client_id=" + integration_key + 
                        "&state=" + state +
                        "&redirect_uri=" + encodeURIComponent( 'http://...' );

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
    jsonHeaders.Authorization = 'Bearer ' + response.access_token;
    dsApiClient.addDefaultHeader('Authorization', jsonHeaders.Authorization);
    //return response as json
    return response; 
}

var token_refresh = {
    "access_token": "", 
    "token_type": "Bearer", 
    "refresh_token": "", 
    "expires_in": 28800
}

var check_Token = (token) => {
    let notoken = !token;
    let now = moment();
    let needToken = notoken || moment(exports.token_expiration).subtract(3, 'm').isBefore(now);

    return (!needToken);
}

var listEnvelopes = async (accessToken) => {
    var isvalidToken = check_Token(accessToken);

    if(isvalidToken){
        requester.base_api_url(base_path);   
        requester.base_headers(jsonHeaders);

        let fromDate = '2016-01-01';
        let files =  await requester.Get(`restapi/v2/${account_path}/envelopes?from_date=${fromDate}`);

        console.log("results", files);
        
        return files;
    } else {
        return null;
    }

}

var listEnvelopeDocuments = async (accessToken, subpath) => {
    var isvalidToken = check_Token(accessToken);

    if(isvalidToken){
        requester.base_api_url(base_path);
        requester.base_headers(jsonHeaders);

        let documents = await requester.Get(`restapi/v2/${account_path}/${subpath}`);

        return documents;
    } else {
        return null;
    }
}

var hasPDFsuffix = (filename) => {
    return filename.toUpperCase().includes('.PDF');
}

var getEnvelopeDocument = async (accessToken, envelopeId, docId, docName, type) => {
    var isvalidToken = check_Token(accessToken);

    if(isvalidToken){
        
        let pdfFile = hasPDFsuffix(docName);
        // Add .pdf if it's a content or summary doc and doesn't already end in .pdf
        if ((type === "content" || type === "summary") && !pdfFile) {
            docName += ".pdf";
            pdfFile = true;
        }
        // Add .zip as appropriate
        if (type === "zip") {
            docName += ".zip"
        }
        
        // Return the file information
        // See https://stackoverflow.com/a/30625085/64904
        let mimetype;
        if (pdfFile) {
            mimetype = 'application/pdf'
        } else if (type === 'zip') {
            mimetype = 'application/zip'
        } else {
            mimetype = 'application/octet-stream'
        }
        
        let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
        let document = await envelopesApi.getDocument(account_id, envelopeId, docId, null).catch((reason) => {
            console.log(reason);
        });
        
        // let documentHeaders = jsonHeaders;
        // documentHeaders.Accept = "application/pdf";

        // let document = await requester.Get(`restapi/v2/${account_path}${subpath}`, 'pdf');

        return ({mimetype: mimetype, docName: docName, fileBytes: document});
    } else {
        return null;
    }
}

var combinedEnvelopeDocuments = async(args) => {
    // let dsApiClient = new docusign.ApiClient();
    // dsApiClient.setBasePath(base_path);
    // dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
    // let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

    // EnvelopeDocuments::get.
    // Exceptions will be caught by the calling function
    let results = await getEnvelopeDocument(args.accessToken, args.subpath);

    let docItem = results.find(item => item.documentId === args.documentId);
    let docName = docItem.name;
    let hasPDFsuffix = docName.substr(docName.length - 4).toUpperCase() === '.PDF';
    let pdfFile = hasPDFsuffix;
    // Add .pdf if it's a content or summary doc and doesn't already end in .pdf
    if ((docItem.type === "content" || docItem.type === "summary") && !hasPDFsuffix){
        docName += ".pdf";
        pdfFile = true;
    }
    // Add .zip as appropriate
    if (docItem.type === "zip") {
        docName += ".zip"
    }

    // Return the file information
    // See https://stackoverflow.com/a/30625085/64904
    let mimetype;
    if (pdfFile) {
        mimetype = 'application/pdf'
    } else if (docItem.type === 'zip') {
        mimetype = 'application/zip'
    } else {
        mimetype = 'application/octet-stream'
    }

    return ({mimetype: mimetype, docName: docName, fileBytes: results});
}

exports.get_Consent = get_Consent;
exports.authorize_Token = authorize_Token;
exports.listEnvelopes = listEnvelopes;
exports.listEnvelopeDocuments = listEnvelopeDocuments;
exports.combinedEnvelopeDocuments = combinedEnvelopeDocuments;
exports.getEnvelopeDocument = getEnvelopeDocument;
