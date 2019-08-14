declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
let query = `${ns.sparql()}
construct {
    ?s a ?typeAnalog.
    ?s ?analog ?oLabel.
    ?s ?analog ?o.
    ?o a ?otypeAnalog.
    ?o ?oAnalog ?ooLabel.
    ?o ?oAnalog ?oo.
    }
where {
    bind(${context} as ?s)
    ?s ?p ?o.
    ?s a ?type.
    optional {
    ?type class:hasAnalog ?typeAnalog.
    }
    ?p property:hasAnalog ?analog.
    optional {
        ?o term:prefLabel ?oLabel1.
        }
     bind(if(?oLabel1,?oLabel1,?o) as ?oLabel)
     optional {
    ?o ?pp ?oo.
    ?o a ?otype.
    optional {
    ?otype class:hasAnalog ?otypeAnalog.
    }
    ?pp property:hasAnalog ?oAnalog.
    optional {
        ?oo term:prefLabel ?ooLabel1.
        }
     bind(if(?ooLabel1,?oLabel1,?oo) as ?ooLabel)
     }
}
`;
let triples = sem.sparql(query)
// ns.convertToTurtle(triples)
//var triples = Array.from(triples)
var json = ns.jsonCondense(triples);
var json2 = {};
json2['@context'] = Object.create(json['@context']);
json2['graph'] = {};
Object.keys(json['graph']).forEach((subject)=>{
    json2['graph'][subject]={};
    Object.keys(json['graph'][subject]).forEach((predicate)=>{
        json2['graph'][subject][predicate] = json['graph'][subject][predicate].length >1?json['graph'][subject][predicate].map((obj)=>obj.value):json['graph'][subject][predicate][0].value;
        })
    })
json2
