'use strict';
var sem = require("/MarkLogic/semantics.xqy");
let NS = require("/lib/ns.js");
let ns = new NS();
let rdfsStore = sem.rulesetStore("rdfs.rules",sem.store() )
let qs = {
    context:xdmp.getRequestField('context',''),
    target:xdmp.getRequestField('target','?foo'),
    property:xdmp.getRequestField('property','a'),
    order:xdmp.getRequestField('order','labelLength'),
    size:xdmp.getRequestField('size','20'),
    offset:xdmp.getRequestField('offset','0'),
    infer:xdmp.getRequestField('infer','no'),
    q:xdmp.getRequestField('q',''),
    };
let orderExpr = {
    "labelLength":'?minLength'
}[qs.order];
let query = `${ns.sparql()}
construct {
?s ?p ?o.
?p term:prefLabel ?pLabel.
?o term:prefLabel ?oLabel.
report:_  report:hasSubject ?s.
report:_  report:hasSize "${qs.size}"^^xsd:integer.
report:_  report:hasOffset "${qs.offset}"^^xsd:integer.
report:_  report:hasCount ?count.
report:_  report:hasTotalPages ?totalPages.
report:_  report:hasCurrentPage ?currentPage.
report:_  report:hasQueryString "${qs.q}"^^xsd:string.
} where {
${qs.context!=''?`
bind(${qs.context} as ?s1)
bind(1 as ?count1)
`:`{{
select distinct ?s1 where {
{{
select ?s1 where {
?s1 ${qs.property} ${qs.target}.
?s1 ?p1 ?o1.
?s1 term:prefLabel ?label1.
optional {
?s1 term:hasCode ?sCode1.
}
#bind(if(strlen(?label1)>strlen(?sCode1),strlen(?sCode1),strlen(?label1)) as ?minLength)
${qs.q != ''?`filter(regex(?label1,'${qs.q}','i') || regex(?sCode1,'${qs.q}','i'))`:''}
} order by asc(?label1)}}
?s1 term:prefLabel ?label2
} limit ${qs.size} offset ${qs.offset}}}
{{select (count(?s2) as ?count1) where {
?s2 ${qs.property} ${qs.target}.
?s2 term:prefLabel ?label2.
optional {
?s2 term:hasCode ?sCode2.
}
${qs.q != ''?`filter(regex(?label2,'${qs.q}','i') || regex(?sCode2,'${qs.q}','i'))`:''}
}}}`}
bind(coalesce(?count1,0) as ?count)
bind(1 + xsd:integer((?count - 1)/${qs.size}) as ?totalPages)
bind(1 + xsd:integer((${qs.offset})/${qs.size}) as ?currentPage)
?s ?p ?o.
?s term:prefLabel ?sLabel.
optional {
?p term:prefLabel ?pLabel.
}
optional {
?o term:prefLabel ?oLabel.
}
filter (?s1 = ?s)
}  order by asc(?sLabel) `; 
query
let triples = sem.sparql(query,null,null,qs.infer==='yes'?rdfsStore:null);
//ns.convertToTurtle(triples)
let json = sem.rdfSerialize(triples,"rdfjson");
let results = ns.condenseJSON(json);
let report = typeof results.graph['report:_']!='undefined'?results.graph['report:_']:{}
let summary = {
            'report:hasQueryString':qs.q,
            'report:hasCount':report['report:hasCount']||0,
            'report:hasSize':qs.size,
            'report:hasOffset':qs.offset,
            'report:hasCurrentPage':report['report:hasCurrentPage']||1,
            'report:hasTotalPages':report['report:hasTotalPages']||1,
            }
results.summary = summary;
results