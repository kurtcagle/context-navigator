declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var p = xdmp.getRequestField("predicate","");
var q = xdmp.getRequestField("q","");
let qTerms = q.trim() != ''?q.split(/\s+/).map((qTerm)=>qTerm.toLowerCase()):[];
var cachePath = `/cache/${p.replace(/:/,"/")}.json`;
var cache = xdmp.getRequestField("cache","cached");
let query = `${ns.sparql()}
select distinct ?context ?value ?type ?typeLabel from graph:_data where {
#select distinct * from graph:_data where {
  ?s ?p ?context.
  ?p term:hasRange|rdfs:range ?type.
  optional {
  ?context term:prefLabel ?value1.
  }
  bind(coalesce(?value1,replace(?context,"^.*[\/|\:]_?(.*)$","$1")) as ?value)
  optional {
    ?type term:prefLabel ?typeLabel1.
  }
  bind(coalesce(?typeLabel1,replace(?type,"^.*[\/|\:]_?(.*)$","$1")) as ?typeLabel)
} order by ?value`
let results = ns.cure(Array.from(sem.sparql(query,{p:ns.ciri(p)})));
data = {query:query,count:results.length,results:results}
