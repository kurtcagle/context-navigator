'use strict';
declareUpdate();
var NS = require("/lib/ns.js");
var ns = new NS();
//xdmp.addResponseHeader("Access-Control-Allow-Origin", "http://localhost:9000/");
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
/*  let update = xdmp.getRequestField("update").replace(/%%%/g,'#');
sem.sparqlUpdate(update);
update */
let body = xdmp.getRequestBody("json");
let activeCard = JSON.parse(body)
let createdDate = `${(new Date()).toISOString()}`;
let deleteCardUpdate = `${ns.sparql()}
delete {
    ${activeCard.curie} ?p ?o.
}
where {
    ${activeCard.curie} ?p ?o.
}`
sem.sparqlUpdate(deleteCardUpdate);
let updateCard = `${ns.sparql()}
insert data {
${activeCard.curie}
      a ${activeCard.type};
      term:prefLabel """${activeCard.title}"""^^xsd:string;
      term:hasDescription """${activeCard.body}"""^^xsd:htmlLiteral;
      term:hasPrimaryImageURL "${activeCard.image}"^^xsd:imageURL;
      term:hasExternalURL "${activeCard.externalURL}"^^xsd:anyURI;
      term:hasCreatedDate "${createdDate}"^^xsd:dateTime;
      term:hasLastModifiedDate "${createdDate}"^^xsd:dateTime;
      term:hasPublicationStatus publicationStatus:_Draft;
      rdfs:subClassOf class:Term;
      ${(activeCard.type === 'class:_Property')?`
        rdfs:domain ${activeCard.domain};
        property:hasDomain  ${activeCard.domain};
        property:hasNodeKind ${activeCard.nodeKind};
        property:hasCardinality ${activeCard.cardinality};
        ${(activeCard.nodeKind === "nodeKind:_Literal")?
          `property:hasDatatype ${activeCard.datatype};`:
          `rdfs:range ${activeCard.range};
           property:hasRange ${activeCard.range};`
          }
        `:''}
       .
}`;
sem.sparqlUpdate(updateCard);
/*  let propertiesUpdate = `${ns.sparql()}
with graph:_data
insert {
    ?s ?p ?o
    }
where {
     bind (${activeCard.curie} as ?s)
    ?p rdfs:domain ${activeCard.type}.
    {{
      ?p rdfs:range ?range.
      ?range class:hasNamespace ?namespace.
      bind(iri(concat(?namespace,'_')) as ?o)
    } UNION {
      ?p property:hasDatatype ?datatype.
      bind(strdt('',?datatype) as ?o)
    }}
}`;*/
//sem.sparqlUpdate(propertiesUpdate);
