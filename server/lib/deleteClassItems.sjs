declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
var removeClass = xdmp.getRequestField("removeClass","false") === "true";
var updateQuery = `${ns.sparql()}
delete {
    ?s ?p ?o.
    ?ss ?sp ?s.
    ${removeClass?`
    ?p ?pp ?po.
    ?p ?rp ?ro.
    ?link ?p ?linko.
    ${context} ?cp ?co.
    `:''}
    }
where {
    optional {
    ?s a ${context}.
    ?s ?p ?o.
    }
    optional {
    ?ss ?sp ?s.
    }
    ${removeClass?`
    optional {
    ?p rdfs:domain|property:hasDomain ${context}.
    ?p ?pp ?po.
    }
    optional {
    ?p rdfs:range|property:hasRange ${context}.
    ?p ?rp ?ro.
    ?link ?p ?linko
    }
    optional {
    ${context} ?cp ?co.
    }`:''}
}`;
sem.sparqlUpdate(updateQuery);
