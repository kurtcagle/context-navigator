'use strict';
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
let t = JSON.parse(xdmp.getRequestBody("json"));
let update = `${ns.sparql()}
delete {
    ${t.subject} ${t.predicate} ?o.
    ${t.subject} term:hasLastModifiedDate ?oldDate.
    }
insert {
    ${t.subject} ${t.predicate} ${t.datatype!=null?`"""${t.object}"""^^${t.datatype}`:t.object}.
    ${t.subject} term:hasLastModifiedDate ?newDate.
    }
where  {
    optional {${t.subject} ${t.predicate} ?o }
    optional {${t.subject} term:hasLastModifiedDate ?oldDate}
    bind (now() as ?newDate)
    }`
sem.sparqlUpdate(update);
let resp = {test:update}
resp