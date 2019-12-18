declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
try {
let triples = sem.graph(sem.defaultGraphIri());
let turtle = ns.convertToTurtle(triples);
let path = `/backup/${(''+fn.currentDateTime()).replace(/[:\.]/g,'-')}.ttl.txt`
ns.writeToTtlFile(path,triples);
ns.writeToTtlFile(`/backup/latest.ttl.txt`,triples);
xdmp.setResponseContentType("text/json");
{message:`Graph database saved to /backup/latest.ttl.txt`}
}
catch(e){
    e
}