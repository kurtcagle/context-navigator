'use strict';
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");

let context = xdmp.getRequestField("context","")
let typeClass = xdmp.getRequestField("class","")
let depth = xdmp.getRequestField("depth","1")
let count = xdmp.getRequestField("count","20")
let page = xdmp.getRequestField("page","1")
let q = xdmp.getRequestField("q","");
let qTerms = q.split(/\s+/);
let host = xdmp.getRequestHeader("Host")
let query = `${ns.sparql()}
construct {
  ${context!=""?`report:_ report:hasSubject ${context}.`:`report:_ report:hasSubject ?s.`}
  ?s ?p ?o.
  ?o ?op ?oo.
  ?oo ?oop ?ooo.
  ?ooo ?ooop ?oooo.
  ?oooo ?oooop ?ooooo.
}
where {
  ${context!=''?`bind(${context} as ?s)`:`bind(${typeClass} as ?class).
  ?s a ?class.`}
#  ?s a ?class.
  ?s ?p ?o.
  optional {
     ?o ?op ?oo.
     optional {
       ?oo ?oop ?ooo.
        optional {
         ?ooo ?ooop ?oooo.
       }
    }
  }
  ?s term:prefLabel ?label.
  ${q != ''?`
     ${qTerms.map((qTerm)=>`filter(regex(?label,"${qTerm}","i"))`).join(' ')}
  `:''}  
} order by ?label`

query
  
let triples = sem.sparql(query);
let json = ns.jsonCondense(triples)
let g = json.graph;
g
  

let subjects = g.hasOwnProperty('report:_')?g['report:_']['report:hasSubject'].filter((obj,index)=>(index>=parseInt(count)*(parseInt(page)-1)) && (index<parseInt(count)*(parseInt(page)))).map((obj)=>obj.value):[]
let treewalk = (g,subject,stackLevel=0,stackMax=4)=>{
  let entry = {};
  entry.subject=subject.split(':_')[1];
  entry.curie = subject;
  entry.label = g[subject]['term:prefLabel'][0].value;
  Object.keys(g[subject]).filter((predicate)=>predicate!='term:prefLabel').forEach((predicate)=>{
    let objArray = []
    
    g[subject][predicate].forEach((obj)=>{
       if (obj.type==='uri'){
         if (g.hasOwnProperty(obj.value) && stackLevel<parseInt(depth)){
            objArray.push(treewalk(g,obj.value,stackLevel+1))
           }
       }
      else {
        if (obj.value != ""){
            objArray.push(obj.value)
        }
      }
    })
    entry[predicate.split(':')[1]]=objArray.length>1?objArray:objArray[0];
    entry.hasDataURL = `http://${host}/lib/graphql.sjs?context=${subject}&depth=${depth}`;
    entry.hasLinksURL = `http://${host}/lib/graphql.sjs?class=${subject}&depth=1&count=${count}`;
    //entry[predicate]=g[subject][predicate];
  })
  return entry
}
let content = subjects.map((subject)=>treewalk(g,subject))
content

/* 
 
 xdmp.addResponseHeader("Content-Type", "application/json");
xdmp.addResponseHeader("Content-Encoding","gzip")
xdmp.gzip(content) */