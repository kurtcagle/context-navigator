declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
var predicate = xdmp.getRequestField("predicate","null");
predicate = (predicate != "")?predicate:"null";
//if (predicate === "null"){predicate="rdf:type"};
var transitive = xdmp.getRequestField("transitive","");
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
let body = `
    ${predicate != 'null'?`bind(${predicate} as ?predicate)`:''}
    ${predicate != 'null'?`?link ${predicate}${transitive === 'plus'?"+":transitive === 'star'?'*':''} ${context}.`:`?link ?predicate ${context}.`}
    ?link term:prefLabel ?linkLabel1 .
    ?link a ?class.
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
        ?link term:hasSummary ?summary.
    }
    optional {
#        ?link term:hasOrder ?ordinal1.
        ?class term:hasPreferredSortProperty ?sortProperty.
        ?link ?sortProperty ?ordinal1.
    }
    optional {
        ?link term:hasPublicationStatus ?publicationStatus.
    }
    optional {
        ?predicate term:prefLabel ?predicateLabel.
    }
    
    optional {
        optional {
            ?class term:hasPrimaryImageURL ?typeImage.
        }
    }

    bind(coalesce(?ordinal1,0) as ?ordinal)
    ${qList.map((term)=>`filter(regex(?linkLabel,'${term}','i'))`).join('\n')}
`
var sparql = `${ns.sparql()}
prefix fn: <http://www.w3.org/2005/xpath-functions#>
select distinct ?link (?class as ?linkType) ?linkLabel ?predicate ?predicateLabel ?image ?typeImage ?lastModifiedDate ?createdDate ?description ?ordinal ?publicationStatus ?summary where  {
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
let results = {context:context,count:count,timestamp:(new Date()).toISOString(),page:page,pageSize:pageSize,numPages:numPages,data:links};
let templateQuery = `${ns.sparql()}
select ?script where {
    ?linksTemplate a class:_LinksTemplate.
    ?linksTemplate linksTemplate:hasTemplateProperty ${predicate}.
    ?linksTemplate linksTemplate:hasTemplateScript ?script.
    }`
   let scripts = predicate != 'null'?Array.from(sem.sparql(templateQuery)):[];
if (scripts.length > 0){
    let script = scripts[0].script;
    results.content = xdmp.eval(script,{context:context,predicate:predicate})||"";
    results.scriptCount = 1;
} else {
//    results.script = null;
    results.content = {content:""};
    results.scriptCount = 0;
}
results.sparql = sparql;
//results.script = templateQuery;

xdmp.addResponseHeader("Content-Type","application/json");
xdmp.addResponseHeader("Content-Encoding","gzip")
xdmp.gzip(results)