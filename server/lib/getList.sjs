declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
let context = xdmp.getRequestField("context");
let body = xdmp.getRequestBody();
let constraintsBody = JSON.parse(body);
let constraints = constraintsBody!=null?constraintsBody.constraints:[];
let predicate = xdmp.getRequestField("predicate",'rdf:type');

let query = `${ns.sparql()}
select ?curie ?label ?description ?prefix where {
    ${context} class:isSubClassOf* ?class.
    ?curie ${predicate} ?class.
    ${constraints.map((constraint)=>`?curie ${constraint.predicate}  ${constraint.object}.`).join(`\n`)}
    ?curie term:prefLabel ?label.
    optional {
        ?curie term:hasOrder ?order
    }
    optional {
        ?curie term:hasDescription ?description.
    }
    optional {
        ?curie class:hasPrefix ?prefix.
    }
} order by ?order ?label`
let results = Array.from(sem.sparql(query))
/*  results.forEach((listItem)=>{
    if (listItem.prefix === null){
        
    }
}*/
ns.cure(results)

