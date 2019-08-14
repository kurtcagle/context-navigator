declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
let path = xdmp.getRequestField("path");
let doc = fn.doc(path);
let triples = sem.rdfParse(doc,"turtle");
//let graph = sem.iri("http://dupont.com/ns/graph/_data");
let graph = sem.defaultGraphIri();
sem.graphInsert(graph,triples);
`${Array.from(triples).length} triples loaded.`