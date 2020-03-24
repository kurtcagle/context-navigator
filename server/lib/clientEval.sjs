'use strict';
declareUpdate();
var NS = require("/lib/ns.js");
var ns = new NS();
var sem = require("/MarkLogic/semantics.xqy");

xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
let jsonBody = xdmp.getRequestBody("json");
let json = JSON.parse(jsonBody);
json.query = json.query.replace(/&nbsp;/g, " ");
let query = `${ns.sparql()}
 ${json.query}`;
let results = ns.cure(sem.sparql(query))

{results:results}  


