'use strict';
declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
//?Class ?Property ?classDescription ?propertyDescription
let graph = xdmp.getRequestField("graph","")||"";
let query = `${ns.sparql()}
  select distinct ?class (?class1 as ?inheritsFrom) ?isRoot ?property ?classDescription ?propertyDescription 
  ?classLabel ?namespace ?prefix ?analog ?plural ?propertyLabel ?rangeClass ?rangeLabel ?datatype ?cardinality ?cardinalityLabel
  where {
  {{?class a class:_Class}
  UNION
  {?class a owl:Class}}
  ${graph != ''?`?class class:hasGraph ?graph.`:''}
  ?class term:prefLabel ?classLabel.
  optional {
     ?class term:hasDescription ?classDescription.

  }
  optional {
      ?class class:hasAnalog ?analog.
  }
  optional {
  ?class class:hasPluralName ?plural.
  }
  optional {
  ?class class:hasPrefix ?prefix.
  }
  optional {
  ?class class:hasNamespace ?namespace.
  }
  {{
  ?class class:isSubClassOf*|rdfs:subClassOf* ?class1.
 ?property property:hasDomain ?class1.
  optional {
      ?property property:hasRange|rdfs:range ?rangeClass.
      ?rangeClass term:prefLabel ?rangeLabel
  }
  optional {
      ?property property:hasDatatype ?datatype
  }
  optional {
      ?property property:hasCardinality ?cardinality.
      ?cardinality term:prefLabel ?cardinalityLabel
  }
#  ?property1 property:isSubPropertyOf* ?property.
  optional {
  ?property term:prefLabel ?propertyLabel.
  ?property term:hasDescription ?propertyDescription.
  }
  } UNION {
     ?class class:isSubClassOf* ?class1.
      filter (not exists { ?property property:hasDomain ?class.})
  }}
#  bind(!sameTerm(?class,?class1) as ?isSameTerm)
} order by ?class ?isSameTerm ?class1 ?property`;
let curedResults = ns.cure(sem.sparql(query));
let condensed = {};
curedResults.forEach((row)=>{
  if (!condensed.hasOwnProperty(row.class)){condensed[row.class]={}}
  condensed[row.class].label = row.classLabel
  condensed[row.class].description = row.classDescription;
  condensed[row.class].analog = row.analog;
  condensed[row.class].namespace = row.namespace;
  condensed[row.class].prefix = row.prefix;
  condensed[row.class].plural = row.plural;
  if (!(condensed[row.class].hasOwnProperty('inheritsFrom'))){condensed[row.class].inheritsFrom=new Set()}
  if (row.inheritsFrom != row.class){condensed[row.class].inheritsFrom.add(row.inheritsFrom)}
  if (!Array.isArray(condensed[row.class].properties)){condensed[row.class].properties=[]}
  let property = {
    label:row.propertyLabel,
    href:row.property,
    description:row.propertyDescription,
    range:row.rangeClass,
    rangeLabel:row.rangeLabel,
    datatype:row.datatype,
    cardinality:{label:row.cardinalityLabel,href:row.cardinality}
    };
  if (row.inheritsFrom === row.class){condensed[row.class].properties.push(property)}
})
Object.keys(condensed).forEach((key)=>condensed[key].inheritsFrom = Array.from(condensed[key].inheritsFrom))
let output = Object.keys(condensed).map((classURI)=>`
<li>
  <h3 class="classLabel"><a name="${classURI}">${condensed[classURI].label}</a></h3>
  <div class="description">${condensed[classURI].description}</div>
  <div class="classURI"><b>Curie: </b><a name="${classURI}">${classURI}</a></div>
  <div class="classURI"><b>URL: </b>${ns.ciri(classURI)}</div>
  ${condensed[classURI].namespace != ''?`<div class="Namespace"><b>Namespace: </b>${ns.ciri(condensed[classURI].namespace)}</div>`:''}
  ${condensed[classURI].prefix != ''?`<div class="Prefix"><b>Prefix: </b>${condensed[classURI].prefix}</div>`:''}
  ${condensed[classURI].analog != ''?`<div class="Analog"><b>Analog: </b>${condensed[classURI].analog}</div>`:''}
  ${condensed[classURI].plural != ''?`<div class="Plural"><b>Plural: </b>${condensed[classURI].plural}</div>`:''}
  ${condensed[classURI].inheritsFrom.length>0?`<div><b>InheritsFrom</b></div>`:''}
  ${(Array.isArray(condensed[classURI].inheritsFrom) && classURI != 'class:_Class' && classURI != 'class:_Term')?
  `<ul>${
    condensed[classURI].inheritsFrom.map((targetClass)=>
//    condensed[targetClass] != null?`<li><a href="#${targetClass}">${condensed[targetClass].label}</a></li>`:'').join('\n');
    `<li><a href="#${targetClass}">${condensed[targetClass].label}</a></li>`).join('\n')
    }
  </ul>`:''}
  ${JSON.stringify(condensed[classURI].properties[0].label)!='"null"'?`
  ${condensed[classURI].hasOwnProperty('properties')?`<div><b>Properties</b></div>`:''}
  <ul>${
    condensed[classURI].properties.map((property)=>`<li><div class="label property">${property.label}</div>
    <div><span class="label">Curie: </span> ${property.href}</div>
    ${property.range!=''?`<div><span class="label">Range: </span><a href="#${property.range}">${property.rangeLabel}</a></div>`:''}
    ${property.datatype!=''?`<div><span class="label">Datatype: </span>${property.datatype}</div>`:''}
    <div><span class="label">Cardinality: </span>${property.cardinality.label}</div>
    <div class="description">${property.description}</div>
    </li>`).join('\n')
  }</ul>`:''}
  <div><a href="#toc">Back</a></div>
</li>`).join('\n');
xdmp.setResponseContentType("text/html");
`<html>
<style type="text/css">
body {font-family:Arial;font-size:11pt;}
h3 {color:blue}
.description {
    font-style:italic;
    margin-bottom:5pt;
    }
.label {font-weight:bold;}
.property {
    font-style:italic;
    border-bottom:solid 1px black;
    margin:3pt;}
a {text-decoration:none;color:blue;cursor:pointer}
</style>
<body>
<h2><a name="toc">Dupont Knowledge Graph Model</a></h2>
${Object.keys(condensed).map((key)=>`<div class="tocEntry"><a href="#${key}">${condensed[key].label}</a></div>`).join('\n')}

<ul>${output}</body></html>`
