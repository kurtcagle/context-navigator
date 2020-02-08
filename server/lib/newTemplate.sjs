'use strict';
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
let semClass = xdmp.getRequestField("context","class:_Article")
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
xdmp.addResponseHeader("Content-Type", "application/json");
let query=`${ns.sparql()}
select ?property ?label ?domain ?domainLabel ?range ?nodeKind ?order ?datatype ?cardinality ?defaultValue ?terms ?description where {
  ${semClass} rdfs:subClassOf* ?domain.
  ?property term:prefLabel ?label.
  filter(!sameTerm(?property,rdf:type))
  ?property rdfs:domain ?domain.
  ?domain term:prefLabel ?domainLabel.
#  filter(!sameTerm(?domain,class:_Term))
  optional {
      ?property rdfs:range ?range.
  }
  ?property property:hasCardinality ?cardinality.
  ?property property:hasNodeKind ?nodeKind.
  optional {
       ?property property:hasDatatype ?datatype.
  }
  optional {
      ?property property:hasOrder ?order.
  }
#  bind(coalesce(xsd:integer(?order1),-1) as ?order)
  optional {
       ?property property:hasDefaultValue ?defaultValue.  
   }
  optional {
      ?property term:hasDescription ?description.
  }
} order by desc(?order) ?label`
let rows = ns.cure(sem.sparql(query));

rows.filter((row)=>row.nodeKind === 'nodeKind:_IRI').forEach((row)=>{
  let subquery = `${ns.sparql()} select ?curie ?label where {
      ?curie a ${row.range}.
      ?curie term:prefLabel ?label
} order by ?label`
  let entities = ns.cure(sem.sparql(subquery));
  row.entities = entities;
})
//let rows = sem.sparql(query)
let newTemplate = {templateData:rows,context:semClass};
newTemplate