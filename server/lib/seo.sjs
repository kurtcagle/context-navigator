// Start SEO
'use strict';
//declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
function strip(html){
    return html.replace(/<.*?>/g,'').replace(/\"/g,'&#34;').replace(/\'/g,"&#39;")
}
let context = xdmp.getRequestField("context","publisher:_CognitiveWorld")
let isIndex = xdmp.getRequestField("isIndex","false")
let query = `${ns.sparql()}
construct {
    ?s ?p ?o.
    ?o ?op ?oo.
    ?oo ?oop ?ooo.
} where {
    bind (${context} as ?s)
    ?s ?p ?o.
    optional {
    ?o ?op ?oo.
    }
    optional {
    ?oo ?oop ?ooo.
}
}
`;
let triples = Array.from(sem.sparql(query))
let results = ns.jsonCondense(triples);
let graph = results.graph;
let cg = graph[context];
let contextType = cg['rdf:type'][0].value;
let customTemplate = graph[contextType].hasOwnProperty('class:hasSEOTemplate')?graph[contextType]['class:hasSEOTemplate'][0].value:null;
let schemaType = graph[contextType].hasOwnProperty('class:hasSchemaOrgAnalog')?graph[contextType]['class:hasSchemaOrgAnalog'][0].value:contextType.split(':_')[1];
let template = customTemplate?Array.from(xdmp.eval(customTemplate))[0]:Array.from(xdmp.invoke('/lib/seoTemplate.sjs'))[0] 
let seo = `${template(graph,context,cg,schemaType)}`;
// End SEO
let seoData = {seo:seo,context:context,cg:JSON.stringify(cg,null,4)};
seoData