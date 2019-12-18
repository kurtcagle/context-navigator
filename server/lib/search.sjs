declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
var q = xdmp.getRequestField("q","");
let qTerms = q.trim() != ''?q.split(/\s+/).map((qTerm)=>qTerm.toLowerCase()):[];
var cachePath = `/cache/${context.replace(/:/,"/")}.json`;
var cache = xdmp.getRequestField("cache","cached");
//if (cache === "cached"){}
let query = `${ns.sparql()}
select distinct ?s ?prefLabel ?sTypeLabel ?imageURL where {
    {{
    ?s term:prefLabel|term:hasSymbol|term:hasCode ?prefLabel.
    bind(lcase(?prefLabel) as ?search)
    bind(1 as ?baseRank1)
    filter(${qTerms.map((qTerm)=>`regex(?search,"${qTerm}",'i')`).join(' && ')})
    } 
    UNION 
    {
    ?s term:prefLabel ?prefLabel.
    bind(lcase(?prefLabel) as ?search)
    bind(0.8 as ?baseRank2)
    filter(${qTerms.map((qTerm)=>`contains(?search,"${qTerm}")`).join(' && ')})
    }
    UNION
    {
    ?s term:prefLabel ?prefLabel.
    ?s term:hasSearchable ?searchable.
    bind(lcase(?searchable) as ?search)
    bind(0.6 as ?baseRank3)
    filter(${qTerms.map((qTerm)=>`contains(?search,"${qTerm}")`).join(' && ')})
    }
    UNION
    {
    ?s term:prefLabel ?prefLabel.
    ?s term:hasDescription ?descr.
    bind(lcase(?descr) as ?search)
    bind(0.5 as ?baseRank4)
    filter(${qTerms.map((qTerm)=>`contains(?search,"${qTerm}")`).join(' && ')})
    }
    }
    bind(strlen(?search) as ?searchLength)
    ?s a ?sType.
    ?sType term:prefLabel ?sTypeLabel.
    optional {
        ?s term:hasPrimaryImageURL ?imageURL.
    }
    ${context != ''?`{{?s ?p ${context}.} UNION {${context} ?p ?s}}`:''}
    bind(coalesce(?baseRank1,?baseRank2,?baseRank3,?baseRank4,0) as ?rank)
} order by desc(?rank) ?searchLength limit 50
`
let results = ns.cure(Array.from(sem.sparql(query)));
data = {terms:qTerms,query:query,count:results.length,results:results};
// xdmp.documentInsert(cachePath,data);
data
