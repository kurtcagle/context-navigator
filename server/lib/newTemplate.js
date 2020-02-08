'use strict';
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
let semClass = xdmp.getRequestField("context","class:_Article")
let query=`${ns.sparql()}
select ?property ?domain ?range ?nodeKind ?order ?datatype ?cardinality ?defaultValue ?terms where {
  ${semClass} rdfs:subClassOf* ?domain.
  ?property rdfs:domain ?domain.
  filter(!sameTerm(?domain,class:_Term))
  optional {
      ?property rdfs:range ?range.
  }
  ?property property:hasCardinality ?cardinality.
  ?property property:hasNodeKind ?nodeKind.
  optional {
       ?property property:hasDatatype ?datatype.
  }
  optional {
      ?property property:hasOrder ?order1.
  }
  bind(coalesce(?order1,-1) as ?order)
  optional {
       ?property property:hasDefaultValue ?defaultValue.  
   }
}`
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
rows