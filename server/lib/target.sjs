//target.sjs
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();

let context = xdmp.getRequestField("context");
let format = xdmp.getRequestField("format");
let formatObj = {
    "html":"text/html",
    "ttl":"text/turtle",
    "txt":"text/plain",
    "json":"application/json"
}
let mime = formatObj[format];
let method = xdmp.getRequestMethod()
xdmp.addResponseHeader("Content-Type", mime);
let sparql = `${ns.sparql()}
construct {
report:_ report:hasSubject ${context}.
report:_ a report:Class.
?s ?p ?o.
?o term:prefLabel ?oLabel.
?p term:prefLabel ?pLabel.
${context} term:inGraph ?graph
}
where {
graph graph:_data
 {
    bind(${context} as ?s)
    ?s ?p ?o.
    optional {
        ?o term:prefLabel ?oLabel.
    }  
    optional {
        ?p term:prefLabel ?pLabel.
    }
    }
   
}`
let triples = sem.sparql(sparql);
if (format === "ttl"){
ns.convertToTurtle(triples)
}
else if (format === "ttl"){
ns.convertToTurtle(triples)
}
else if (format === "json"){
ns.jsonCondense(triples);
}
else if (format === "html"){
var Graph = require("/lib/graph.js");
var g = new Graph();
g.loadLocal(ns.jsonCondense(triples));
let output = `<html>
<body>
<div class="card">
    ${g.has(context,"vehicle:hasDealer")?`<div class="dealer"><a href="/meta/${g.value(context,"vehicle:hasDealer")}.html">${g.label(g.value(context,"vehicle:hasDealer"))}</a></div>`:''}
    <img src="${g.value(context,"term:hasPrimaryImageURL")}"></img>
    <h1>${g.label(context)}</h1>
    <div>${g.value(context,"term:hasDescription")}</div>
    <div>${g.value(context,"term:hasComments")}</div>
</div>
</body>
<html>`
output
}