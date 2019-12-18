// Start SEO
'use strict';
//declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
let context = xdmp.getRequestField("context","publisher:_CognitiveWorld")
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
let seo = `<script type="application/ld+json">
${template(graph,context,cg,schemaType)}
</script> 
<meta property="og:title" content="${cg['term:prefLabel'][0].value}" />
<meta property="og:url" content="/?context=${context}" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${cg['term:hasPrimaryImageURL'][0].value}"/>
`;
// End SEO

`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Navigator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${seo}
    <!--<script src="//cdn.jsdelivr.net/npm/pouchdb@7.1.1/dist/pouchdb.min.js"></script>-->
	<script>
	  var db = null;//new PouchDB('my_database');
	</script>
  </head>

  <body aurelia-app="main">
    <script src="scripts/vendor-bundle.js" data-main="aurelia-bootstrapper"></script>
  </body>

</html>`
