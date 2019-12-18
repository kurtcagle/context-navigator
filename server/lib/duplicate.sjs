'use strict';
declareUpdate();
var NS = require("/lib/ns.js");
var ns = new NS();
//xdmp.addResponseHeader("Access-Control-Allow-Origin", "http://localhost:9000/");
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
//let update = xdmp.getRequestField("update").replace(/%%%/g,'#');
//sem.sparqlUpdate(update);
let updateJSON = xdmp.getRequestBody("json");
let updateObj = JSON.parse(updateJSON);
let update = updateObj.query;
let action = sem.sparqlUpdate(update);
updateObj.curie