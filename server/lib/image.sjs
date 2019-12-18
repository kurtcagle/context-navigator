'use strict';
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
//xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
let query = `${ns.sparql()}
select ?imageURL where {
    ${context} term:hasPrimaryImageURL ?imageURL
}`
let rows = Array.from(sem.sparql(query));
let path = rows[0].imageURL;
Array.from(xdmp.httpGet(path,{headers:{"Access-Control-Allow-Origin":"*","Content-Type":"image/*"}}))[1]
