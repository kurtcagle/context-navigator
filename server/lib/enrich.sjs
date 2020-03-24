'use strict';
declareUpdate();
var NS = require("/lib/ns.js");
var ns = new NS();
var sem = require("/MarkLogic/semantics.xqy");

//xdmp.addResponseHeader("Access-Control-Allow-Origin", "http://localhost:9000/");
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
let json = xdmp.getRequestBody("json");
let updateObj = JSON.parse(json);
let context=updateObj.context;
let descr = updateObj.description;
let uid = updateObj.uid;
let lastModifiedDate = `${(new Date()).toISOString()}`;
if (descr === null){
    let descrQuery = `${ns.sparql()}
    select ?description where
    {
    ${context} term:hasDescription ?description.
    }
    `
    descr = ''+Array.from(sem.sparql(descrQuery))[0].description;
    }
//descr = "This is an article about artificial intelligence and <span>blockchain</span>."
//  {${searchClasses.map((searchClass)=>`{?topic a ${searchClass}.}`).join(' UNION ')}}

 
let topicQuery = `${ns.sparql()}
select (?topic as ?curie) ?label ?type ?typeLabel ?predicate where {
  bind(${context} as ?s)
  ?s a ?sType.
  ?sType rdfs:subClassOf* ?scType.
  ?sType class:isClassifiedBy ?type.
  ?type term:prefLabel ?typeLabel.
  ?topic a ?type.
  ?topic term:prefLabel ?prefLabel.
  optional {
      ?topic term:hasAlternateLabel ?altLabel.
  }
  bind(coalesce(?altLabel,?prefLabel) as ?label)
  filter(regex(?descr,?label,'i'))
  bind(strlen(?label) as ?labelLength)
#  optional {
      ?predicate rdfs:domain ?scType.
      ?predicate rdfs:range ?type.
#  }

} order by desc(?labelLength) asc(?label)`;
let rows = Array.from(sem.sparql(topicQuery,{descr:descr}))
let topics = ns.cure(rows)
let tagArray = {}
let index =0;
descr = descr.replace(/<span class="semlink" [^>]*?>(.*?)<\/span>/gi,"$1");
//descr = descr.replace(/(<[^>]*?>)/gi,(match)=>{tagArray[`##${index}\ `]=match;let tagKey =`##${index}\ `;index+=1;return tagKey})
topics.forEach((topic)=>{
     let regex = new RegExp("(>[^<]*?)("+topic.label+")([^>]*?<)","ig")
     descr = descr.replace(regex,`$1<span class="semlink" resource="${topic.curie}" resourceType="${topic.type}" onclick="window.app.fetchContext('${topic.curie}')">$2</span>$3`)  
})
//Object.keys(tagArray).forEach((key)=>{let regex= eval(`/(${key})/gi`);descr = descr.replace(regex,tagArray[key])})
let results = {description:descr,subject:context,topics:topics};
results 

/*   
//  
let deleteQuery = `${ns.sparql()}
    delete {
        ?s term:hasDescription ?oldDescr.
        ?s ?oldClassifierProperty ?oldTopic.
        }
    where {
        bind(${context} as ?s)
        ?s term:hasDescription ?oldDescr.
        bind(datatype(?oldDescr) as ?descrType)
        ?s a ?sType.
        ?sType class:isClassifiedBy ?topicClass.
        ?oldTopic a ?topicClass.
        ?oldClassifierProperty rdfs:domain ?sType.
        ?oldClassifierProperty rdfs:range ?topicClass.
#        optional {
#        ?s ?oldClassifierProperty ?oldTopic.
#        }
    }`
//xdmp.addResponseHeader("Content-Type", "application/json");
// let triples = Array.from(sem.sparql(updateQuery));
//triples    
try {sem.sparqlUpdate(deleteQuery);{message:"Topics Deleted"}} catch(e){e}
let insertQuery = `${ns.sparql()}
    insert data {
        ${context} term:hasDescription """${descr}"""^^xsd:html.
        ${context} term:hasLastModifiedDate "${lastModifiedDate}"^^xsd:dateTime.
        ${context} term:hasLastModifiedBy ${uid}.
        ${topics.map((topic)=>`${context} ${topic.predicate} ${topic.curie}.`).join('\n')}
    }`    
try {sem.sparqlUpdate(insertQuery);{message:"Topics Updated"}} catch(e){e}
*/

