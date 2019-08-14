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
let g = updateObj.graph;
let context = updateObj.subject;
let curie = updateObj.curie;
let buffer = [];
Object.keys(g[context]).forEach((predicate)=>{
g[context][predicate].forEach((object)=>{
if (object.type==='uri'){
  buffer.push(`${curie} ${predicate} ${object.value}.`)
}
else {
  if (predicate != 'term:hasLastModifiedDate'){
    buffer.push(`${curie} ${predicate} """${object.value}"""^^${object.datatype||'xsd:string'}.`)
    }
  }
})
})
let triples = buffer.join('\n');
let lastModifiedDate = `${(new Date()).toISOString()}`;

let prolog = ns.sparql();
let output = `${prolog}
    delete {
        ${curie} ?p ?o.        
        }
    insert {
     ${
        triples
        }
     ${curie} term:hasLastModifiedDate "${lastModifiedDate}"^^xsd:dateTime.   
    }
    where {
        optional {
        ${curie} ?p ?o.
        }
    }`;
sem.sparqlUpdate(output)
output