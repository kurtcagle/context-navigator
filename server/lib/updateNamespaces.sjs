'use strict';
declareUpdate();
var NS = require("/lib/ns.js");
var ns = new NS();
let prefix = xdmp.getRequestField('prefix');
let namespace = xdmp.getRequestField('namespace');
let action = xdmp.getRequestField('action','add');
if (action === "delete"){
    ns.removePrefix(prefix,namespace);    
}
else if (action === "add"){
    ns.addPrefix(prefix,namespace);    
}
else {
}
ns.prefixMap