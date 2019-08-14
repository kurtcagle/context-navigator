let sem = require("/MarkLogic/semantics.xqy");

class Query {
    constructor(ns,options=[]){
        this.ns = ns;
        this.options = options;
    }
    // Use the "Class" parameter to get the current and inherited properties of the class.
    getInheritedProperties(params={},options=this.options){
        let sparql = `${this.ns.sparql()}
            select distinct ?class ?property ?propertyLabel ?range ?kind from graph:_data where {
               ?Class rdfs:subClassOf* ?class.
               ?property rdfs:domain ?class.
               ?property rdfs:range ?range.
               ?property property:hasKind ?kind.
               ?property term:prefLabel ?propertyLabel.
                } order by ?class ?property`
        return sem.sparql(sparql,params,options)
        }
    getOutboundTriples(params={},options=this.options){
        let sparql = `${this.ns.sparql()}
            construct 
            {?s ?p ?o. 
             ?o term:prefLabel ?oPrefLabel.
             ?o rdf:type ?oType.
             ?p term:prefLabel ?propertyLabel.
             ?oType term:prefLabel ?oTypeLabel.
             report:_ report:hasContext ?s.
            }
            where {
              bind(?context as ?s)
              ?s ?p ?o. 
         optional {
             ?p term:prefLabel ?propertyLabel.
            }
            ?p property:hasNodeKind ?nodeKind.
            optional {
            filter(sameTerm(?nodeKind,nodeKind:_iri)) 
             ?o term:prefLabel ?oPrefLabel.
             ?o rdf:type ?oType.
             ?oType term:prefLabel ?oTypeLabel.
             }
             
            
            }`;
    return sem.sparql(sparql,params,options);
    }    
}
module.exports = Query;