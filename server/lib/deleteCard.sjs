declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
var sparql = `${ns.sparql()}
delete {
    ?context ?cp ?o.
    ?s ?p ?context.
    }
where {
    ?context ?cp ?o.
    optional {
        ?s ?p ?context.
        }
    }`
let message = sem.sparqlUpdate(sparql,{context:ns.ciri(context)})||`${context} successfully deleted.`;
{message:message}
