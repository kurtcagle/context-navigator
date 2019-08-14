declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
var predicate = xdmp.getRequestField("predicate","rdf:type");
var q = fn.normalizeSpace(xdmp.getRequestField("q",""));
var qList = q.split(/\s/)||[];

var sort = xdmp.getRequestField("sort","sortMode:_ModifiedDateDesc");
var pageSize = parseInt(xdmp.getRequestField("pageSize","20"));
var page = parseInt(xdmp.getRequestField("page","1"));
var constraints = xdmp.getRequestField("constraints","");
let constraintTerms = constraints != ""?constraints.split(";"):[];
let constraintsArr =constraintTerms != null?constraintTerms.map((term)=>term.split('|')):[];
var format = xdmp.getRequestField("format","json");
var sortModes = [
      {label:"Created Date Descending",value:"sortMode:_CreatedDateDesc",filter:"desc(?createdDate)"},
      {label:"Modified Date Descending",value:"sortMode:_ModifiedDateDesc",filter:"desc(?lastModifiedDate)"},
      {label:"Created Date Ascending",value:"sortMode:_CreatedDateAsc",filter:"asc(?createdDate)"},
      {label:"Modified Date Ascending",value:"sortMode:_ModifiedDateAsc",filter:"desc(?lastModifiedDate)"},
      {label:"Alphanumeric Ascending",value:"sortMode:_AlphaAsc",filter:'asc(?linkLabel)'},
      {label:"Alphanumeric Descending",value:"sortMode:_AlphaDesc",filter:'desc(?linkLabel)'},
      {label:"Internal Order Ascending",value:"sortMode:_OrdinalAsc",filter:'asc(?ordinal)'},
      {label:"Internal Order Descending",value:"sortMode:_OrdinalDesc",filter:'desc(?linkLabel)'}
      ];
let sortModeItem = sortModes.find((sortMode)=>sortMode.value===sort)
let sortMode = (sortModeItem != null)?sortModeItem.filter:'desc(?lastModifiedDate)';
let pageOffset = (page - 1) * pageSize;
let body = `{
    ${predicate != ''?`bind(${predicate} as ?predicate)`:''}
    ?link ?predicate ${context}.
    ?link term:prefLabel ?linkLabel1 .
    bind(fn:normalize-space(?linkLabel1) as ?linkLabel)
    ${constraintsArr.map((constraint)=>`?link ${constraint[0]} ${constraint[1]}.`).join('\n')}
    optional {
        ?link term:hasLastModifiedDate ?lastModifiedDate.
    }
    optional {
        ?link term:hasCreatedDate ?createdDate.
    }
    optional {
        ?link term:hasPrimaryImageURL ?image.
    }
    optional {
        ?link term:hasDescription ?description.
    }
    optional {
        ?link term:hasOrder ?ordinal1.
    }
    optional {
        ?link term:hasPublicationStatus ?publicationStatus.
    }
    bind(coalesce(?ordinal1,0) as ?ordinal)
    ${qList.map((term)=>`filter(regex(?linkLabel,'${term}','i'))`).join('\n')} 
}`
var sparql = `${ns.sparql()}
prefix fn: <http://www.w3.org/2005/xpath-functions#>
select distinct ?link ?linkLabel ?predicate ?image ?lastModifiedDate ?createdDate ?description ?ordinal ?publicationStatus where  {
${body}
} order by ${sortMode} limit ${pageSize} offset ${pageOffset}`
let nodes = sem.sparql(sparql);
let ctSparql = `${ns.sparql()}
prefix fn: <http://www.w3.org/2005/xpath-functions#>
select (count(?link) as ?count) where  {
${body}
}`;
let ctResult = sem.sparql(ctSparql);
let count = Array.from(ctResult)[0].count;
let links = Array.from(ns.cure(nodes));
let numPages = Math.ceil((count - 1) / pageSize);
let results = {count:count,timestamp:(new Date()).toISOString(),page:page,pageSize:pageSize,numPages:numPages,data:links};
results



/*  var cachePath = `/cache/${context.replace(/:/,"/")}.json`;
var cache = xdmp.getRequestField("cache","cached");
cache = "refresh";
if (fn.docAvailable(cachePath) && cache === "cached"){
    var doc = fn.doc(cachePath);
    doc
}
else {
var sparqlOut = `${ns.sparql()}
construct {
    report:_ report:hasContext ?s.
    
    ?s ?p ?o.
    ?o ?op ?oo.
    ?p term:prefLabel ?pLabel.
    ?p property:hasCardinality ?cardinality.
    } where {
    bind(${context} as ?s)
    ?s a ?type.
    {{?s ?p ?o} UNION {
    ?p rdfs:domain ?type.
    optional {?s ?p ?o1}
    optional {
        ?p rdfs:range ?targetType.
        ?targetType class:hasNamespace ?namespace.
    }
    optional {
        ?p property:hasDatatype ?datatype.
    }
    optional {
        ?p property:hasCardinality ?cardinality.
    }targetType,iri(concat(?namespace,"_")),strdt("",?datatype))) as ?o)
    }}
    bind(coalesce(?o1,if(?
    ?s term:prefLabel ?sLabel.
    optional {
        ?o ?op ?oo
        }
    optional {
        ?p term:prefLabel ?pLabel.
        }
    } order by ?pLabel ?sLabel`;
var outboundTriples = sem.sparql(sparqlOut,{context:ns.ciri(context)})
var sparqlIn = `${ns.sparql()}

var inboundTriples = sem.sparql(sparqlIn,{context:ns.ciri(context)})
var triples = Array.from(outboundTriples).concat(Array.from(inboundTriples))
var json = ns.jsonCondense(triples);
xdmp.documentInsert(cachePath,json);
json
//ns.convertToTurtle(triples)
}
*/