declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var classType = xdmp.getRequestField("type","");
let query = `${ns.sparql()}
select distinct ?predicate ?label ?range ?datatype ?cardinality ?nodeKind where {
    ?classType rdfs:subClassOf*|class:isSubClassOf* ?type.
    ?predicate property:hasDomain|rdfs:domain ?type.
    optional {
    ?predicate term:prefLabel|rdfs:label ?label.
    }
    optional {
        ?predicate property:hasRange|rdfs:range ?range.
    }
    optional {
        ?predicate property:hasDatatype ?datatype.
    }
    optional {
        ?predicate property:hasCardinality ?cardinality.
    }
    optional {
        ?predicate property:hasNodeKind ?nodeKind.
    }
} order by ?label`
let results = ns.cure(Array.from(sem.sparql(query,{classType:ns.ciri(classType)})));
data = {query:query,count:results.length,results:results}
data
