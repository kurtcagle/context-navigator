'use strict';
declareUpdate();
var NS = require("/lib/ns.js");
var ns = new NS();
//xdmp.addResponseHeader("Access-Control-Allow-Origin", "http://localhost:9000/");
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
//let update = xdmp.getRequestField("update").replace(/%%%/g,'#');
//sem.sparqlUpdate(update);
let updateJSON = xdmp.getRequestBody("json");
let fileObj = JSON.parse(updateJSON);
let date = (new Date()).toISOString().replace(/:/g,'_').substr(0,19);
let filepath = `/files/${date}/${fileObj.filename}`
let xquery = `
declare namespace temp = "http://semantical.llc/ns/temp/";
declare variable $temp:base64 external;
declare variable $temp:path external;
let $binary := binary{xs:hexBinary(xs:base64Binary($temp:base64))}
return (
  xdmp:document-insert(
    $temp:path,
    $binary
    )
  )`;
xdmp.xqueryEval(xquery,{"{http://semantical.llc/ns/temp/}base64":fileObj.fileData,"{http://semantical.llc/ns/temp/}path":filepath})
JSON.stringify({filepath:filepath},null,4)