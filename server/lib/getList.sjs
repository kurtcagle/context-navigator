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
let graph = xdmp.getRequestField("graph","")||"";
let q = xdmp.getRequestField("q","");
let pagesize = parseInt(xdmp.getRequestField("pagesize","1000")||"1000")
let query = `${ns.sparql()}
select ?curie ?label ?typeLabel ?description ?prefix ?graph where {
    ${context} class:isSubClassOf* ?class.
    ?curie ${predicate} ?class.
    optional {
        ${(context === 'class:_Class')?`?curie class:hasGraph ?graph.`:''}
    }
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
    optional {
        ?curie rdfs:domain ?domain.
        ?domain term:prefLabel ?typeLabel.        
    }
    filter(regex(?label,"${q}","i"))
} order by ?order ?typeLabel ?label limit ${pagesize}`
let results = Array.from(sem.sparql(query))
/*  results.forEach((listItem)=>{
    if (listItem.prefix === null){
        
    }
}*/
q
ns.cure(results)