declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var context = xdmp.getRequestField("context","");
let uid = xdmp.getRequestField("uid",'');
let address = xdmp.getRequestClientAddress();
let obj = {address:address,context:context,timestamp:(new Date()).toISOString(),id:sem.uuidString(),user:uid};
let path = `/tracking/${obj.id}.json`;
xdmp.documentInsert(path,obj);

let constraintsJSON = xdmp.getRequestBody("json");
let constraints = (constraintsJSON != '')&&(constraintsJSON != null)?JSON.parse(constraintsJSON):[];
var cachePath = `/cache/${context.replace(/:/,"/")}.json`;
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
    }
    bind(coalesce(?o1,if(?targetType,iri(concat(?namespace,"_")),strdt("",?datatype))) as ?o)
    }}
    ?s term:prefLabel ?sLabel.
    optional {
        ?o ?op ?oo
        }
    optional {
        ?p term:prefLabel ?pLabel.
        }
    } order by ?pLabel ?sLabel`;
var outboundTriples = sem.sparql(sparqlOut,{context:ns.ciri(context)})
// old sparqlIn
var sparqlIn = `${ns.sparql()}
construct {
    report:_ report:hasContext ?s.
    report:_ report:hasLink ?link.
    report:_ report:hasPredicateNode ?node.
    ?node report:hasPredicate ?linkP.
    ?node report:hasPredicateLabel ?pLabel.
    ?node report:hasPredicateDomain ?pDomain.
    ?node report:hasPredicateDomainLabel ?pDomainLabel.
    ?node report:hasPredicateDomainPluralLabel ?typePluralLabel.
    ?node report:hasPredicateRange ?pRange.
    ?node report:hasPredicateRangeLabel ?pRangeLabel.
##    ?link ?pLink ?oLink.
    ?link ?linkP ?s.
    ?link a ?linkType.
    ?linkType term:prefLabel ?typeLabel.
    ?linkType class:hasPlural ?typePluralLabel.
    ?linkP rdfs:domain ?pDomain.
    ?pDomain term:prefLabel ?pDomainLabel.
    ?linkP rdfs:range ?pRange.
    ?pRange term:prefLabel ?pRangeLabel.
    ?linkP property:hasDatatype ?pDatatype.
    ?pDatatype term:prefLabel ?pDatatypeLabel.
    ?link term:prefLabel ?linkLabel.
    ?link color:hasColorHexValue ?colorValue.
    ?link term:hasType ?resourceType.
#    ?link a ?resourceType.
    ?linkP term:prefLabel ?pLabel.
    ?link term:hasPrimaryImageURL ?imageURL.
    ?link term:hasDescription ?description.
    ?link term:hasSearchable ?optionStr.
    ?link term:hasLastModifiedDate ?lastModifiedDate.
    ?link term:hasCreatedDate ?createdDate.
     ?link term:hasPublicationStatus ?publicationStatus.
    } where {
    bind(${context} as ?s)
#    {
    {
#        filter(!sameTerm(?s,class:_Class))  
        ?link ?linkP ?s.
        ?link a ?linkType.
    }
#    UNION {
#        ?s a class:_Class.
#        ?sType rdfs:subClassOf*|class:isSubClassOf* ?s. 
#        ?link a ?sType. 
#        bind(rdf:type as ?linkP)
#        bind(?sType as ?linkType)
#    }}
#    bind(iri(concat(str(report:),'_',struuid(),md5(str(?linkP)))) as ?node)
     bind(iri(concat(str(report:),'_',md5(str(?linkP)))) as ?node)
     ?link term:prefLabel ?linkLabel.
    ${constraints.map((constraint)=>`?link ${constraint.predicate} ${constraint.value}.`).join("\n")}
    optional {
        ?linkP term:prefLabel ?pLabel1.
        }
    optional {
        ?linkP rdfs:label ?pLabel2.
        }
    bind(coalesce(?pLabel1,?pLabel2,str(?linkP)) as ?pLabel)        
    optional {
        ?link term:hasDescription ?description.
        }
    optional {
        ?linkP rdfs:domain ?pDomain1.
        }
    optional {
        ?linkP property:hasDomain ?pDomain2.
    }
    bind(coalesce(?pDomain1,?pDomain2,class:_Term) as ?pDomain)
    ?pDomain term:prefLabel ?pDomainLabel.
    optional {
        ?linkP rdfs:range ?pRange1.
        }
    optional {
        ?linkP property:hasRange ?pRange2.
    }
    bind(coalesce(?pRange1,?pRange2,class:_Term) as ?pRange)
    ?pRange term:prefLabel ?pRangeLabel.
    optional {
        ?linkP property:hasDatatype ?pDatatype.
        ?pDatatype term:prefLabel ?pDatatypeLabel.

    }
    optional {
        ?linkType term:prefLabel ?typeLabel.
        }
    optional {
        ?link term:hasPrimaryImageURL ?imageURL.
    }   
    optional {
        ?link color:hasColorHexValue ?colorValue.
    }   
    optional {
        ?link term:hasSearchable ?optionStr.
    }    
    optional {
        ?linkType class:hasPlural ?typePluralLabel.

    }
    optional {
        ?link term:hasLastModifiedDate ?lastModifiedDate.
        }
    optional {
        ?link term:hasCreatedDate ?createdDate.
        }
    optional {
        ?link term:hasPublicationStatus ?publicationStatus.
        }
    }`;

/*  let inboundTriples = Array.from(sem.sparql(sparqlIn));
    let triples = Array.from(outboundTriples).concat(Array.from(inboundTriples);  
 */
var triples = Array.from(outboundTriples);
var json = ns.jsonCondense(triples);

  let lquery = `${ns.sparql()}

select distinct (?property as ?curie) ?label ?domain ?domainLabel ?range ?rangeLabel ?domainPlural ?dropLabel where {
bind(${context} as ?range)
?link ?property ${context}.
?link a ?linkType.
#?linkType term:prefLabel ?linkLabel.
optional {
    ?linkType class:hasPluralName ?linkPlural
}
?property term:prefLabel ?label.
#?property rdfs:range|property:hasRange ?range.
?property rdfs:domain ?domain.
?domain term:prefLabel ?domainLabel.
?range term:prefLabel ?rangeLabel.
optional {
    ?domain class:hasPluralName ?domainPlural.
    }
bind (if(sameTerm($property,rdf:type),?linkPlural,if(sameTerm(?property,rdfs:domain),concat(?rangeLabel,' Properties'),concat(?domainLabel,' ',lcase(?label)))) as ?dropLabel)    
} order by strLen(?dropLabel)
`;
let linkPredicates = ns.cure(Array.from(sem.sparql(lquery)));


let classType = json.graph[context]['rdf:type'][0].value;
let pquery = `${ns.sparql()}
select distinct (?property as ?curie) ?label ?range ?rangeLabel ?datatype ?datatypeLabel ?cardinality ?nodeKind ?domain ?domainLabel ?order ?fullLabel ?description where {
    ${classType} rdfs:subClassOf*|class:isSubClassOf* ?domain.
    ?property property:hasDomain|rdfs:domain ?domain.
    optional {
    ?property property:hasRange|rdfs:range ?range.
     ?range term:prefLabel ?rangeLabel.
    }
    optional {
     ?property property:hasDatatype ?datatype.
     ?datatype term:prefLabel ?datatypeLabel.
    }
    ?domain term:prefLabel ?domainLabel.
    ?property term:prefLabel ?label.
    optional {
    ${classType} class:hasPluralName ?linkPlural.
    }
    optional {
        ?property property:hasCardinality ?cardinality.
    }
    optional {
        ?property property:hasNodeKind ?nodeKind.
    }
    optional {
        ?property property:hasOrder ?order.
    }
    optional {
        ?property term:hasDescription ?description
    }
bind (concat(?domainLabel,' ',?label) as ?fullLabel)    
} order by desc(?order) ?fullLabel`

let predicates = ns.cure(Array.from(sem.sparql(pquery)));


json.uid = uid;
json.predicates = predicates;
// delete json["@context"];
json.linkPredicates = linkPredicates;
let path = `http://thecaglereport.com:8020/lib/getWidgets.sjs?context=${context}`
let http = xdmp.httpGet(path);
let content = Array.from(http)[1];
json.content = JSON.parse(content);
xdmp.documentInsert(cachePath,json);
xdmp.addResponseHeader("Content-Type", "application/json");
xdmp.addResponseHeader("Content-Encoding","gzip")
xdmp.gzip(json)
//ns.convertToTurtle(triples)
}