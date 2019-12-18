'use strict';
declareUpdate();
var NS = require("/lib/ns.js");
var ns = new NS();
let path=xdmp.getRequestField("path");
let filename = path.split(/\//).pop();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
xdmp.addResponseHeader("Content-Disposition", `attachment; filename="${filename}`);
fn.doc(path)