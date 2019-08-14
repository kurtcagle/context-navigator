'use strict';
declareUpdate();


var NS = require("/lib/ns.js");
var ns = new NS();
let doc = xdmp.getRequestBody("json");
ns.write("/files/analysis.json",doc)
