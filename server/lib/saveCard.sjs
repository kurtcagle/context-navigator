'use strict';
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
//xdmp.addResponseHeader("Access-Control-Allow-Origin", "http://localhost:9000/");
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
//let cardJSON = xdmp.getRequestField("json").replace('%%%','#');
let card = JSON.parse(xdmp.getRequestBody("json"));
//let card = JSON.parse(cardJSON);
//ns.write("/files/analysis.json",doc)
let lastModifiedDate = `${(new Date()).toISOString()}`;
let update = `${ns.sparql()}
delete {
${card.context}
    term:prefLabel ?oldLabel;
    term:hasDescription ?oldDescription;
    term:hasPrimaryImageURL ?oldImage;
    term:hasLastModifiedDate ?oldDate;
    .
}
insert {
${card.context}
    term:prefLabel """${card.title}""";
    term:hasDescription  """${card.body}""";
    term:hasPrimaryImageURL "${card.image}";
    term:hasLastModifiedDate "${lastModifiedDate}"^^xsd:dateTime;
}
where {
${card.context} term:prefLabel ?oldLabel.
    optional {
${card.context} term:hasPrimaryImageURL ?oldImage.
    }
    optional {
${card.context} term:hasDescription ?oldDescription.
    }
    optional {
${card.context} term:hasLastModifiedDate ?oldDate.     
    }
}`;
sem.sparqlUpdate(update)
//update