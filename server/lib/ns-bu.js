var sem = require("/MarkLogic/semantics.xqy");

class NS {
    // the NS constructor creates or retrieves the prefixMap, populates the /ns/ns.json stored map
    constructor(namespaces){
        this.prefixMap = null;
        if (namespaces != null){
            
            this.prefixMap=namespaces
        }
        else {
            if (!fn.docAvailable('/ns/ns.json')){
                this.prefixMap = {};
                xdmp.documentInsert('/ns/ns.json',this.prefixMap);
            }
            else {
              this.prefixMap = JSON.parse(fn.doc('/ns/ns.json'))
            }
        }
        this.version = "1.0"
    }
    // addPrefix will add a prefix to the prefix map in /ns/ns.json
    addPrefix(prefix,namespace){
       this.prefixMap[prefix] = namespace;
       xdmp.documentInsert('/ns/ns.json',this.prefixMap);
    }
    // removePrefix removes a given prefix and its associated namespace from /ns/ns.json
    removePrefix(prefix){
       if (this.prefixMap.hasOwnProperty(prefix)){
           delete this.prefixMap[prefix];
           xdmp.documentInsert('/ns/ns.json',this.prefixMap);
           }
    }
    // converts a curie into a fully qualified IRI
    ciri(curie){
        var qnames = curie.split(/:/);
        return `${this.prefixMap[qnames[0]]}${qnames[1]}`;
    }
    // converts a fully qualified IRI into a curie
    curie(iri){
        var iri = fn.string(iri);
        if (iri.startsWith("http://marklogic.com/semantics/blank/")){
          return iri.replace("http://marklogic.com/semantics/blank/","_:");
        }
        else {
        var curieTerm = null
        var separator = iri.match("#")?"#":"/";
        var tokens = iri.split(separator);
        var term = tokens[tokens.length - 1];
        tokens.pop();
        var namespace = (separator==="#")?(tokens.join("/"))+"#":(tokens.join("/"))+"/";
        console.log(separator==="#",namespace,term);
        var resultArr = Object.keys(this.prefixMap).filter((prefix)=>this.prefixMap[prefix] === namespace);
        
        if (resultArr.length == 1){curieTerm = `${resultArr[0]}:${term}`};
        if (curieTerm != null){
            var curieTokens = curieTerm.split(/:/)
            curieTerm = (curieTokens.length>2)?`${curieTokens[0]}:${curieTokens[1]}`:curieTerm;
            return curieTerm;
        }
        else {return null}
      }
    }
    // helper function for curie(), do not use directly 
    isIRI(iriCandidate){
      return (''+iriCandidate).match(/:\/\//);
    }
    // generates a set of turtle prefix declarations from the underlying prefix map 
    turtle(){
        return Object.keys(this.prefixMap).map((prefix)=>`@prefix ${prefix}: <${this.prefixMap[prefix]}>.`).join("\n")+("\n");
    }
    // generates a set of sparql prefix declarations from the underlying prefix map 
    sparql(){
        return Object.keys(this.prefixMap).map((prefix)=>`prefix ${prefix}: <${this.prefixMap[prefix]}>`).join("\n")+("\n");
    }
    // flips the prefix around so that the namespace is the key and the prefix is the value.  
    inverseMap(){
        let inverseMap = {};
        Object.keys(this.prefixMap).forEach((prefix)=>{
            if (prefix != ''){inverseMap[this.prefixMap[prefix]] = prefix};
             })
        return inverseMap;
    }
    // Generates various output variations on the prefix map.   
    prolog(mode="turtle"){
        switch(mode){}
        if (mode === "turtle"){
            return this.turtle(this.prefixMap)
            }
        if (mode === "sparql"){
            return this.sparql(this.prefixMap)
            }
        if (mode === "json"){
            return JSON.stringify(this.prefixMap)
            }    
        if (mode === "js"){
            return JSON.assign({},this.prefixMap);
            }    
        }
// rewrites the MarkLogic turtle output (which creates anonymous prefixes) so that the designated prefixes in the prefix map are preserved.       
  rewrite(turtle){
        var localPrefixMap = {};
        turtle.split(/\n/).forEach((line)=>{
            var result = line.match(/\@prefix (\w+):\s*<(.+?)>\s*\./);
            if (result != null){
              localPrefixMap[result[1]] = {namespace:result[2],altPrefix:Object.keys(this.prefixMap).find((key)=>this.prefixMap[key]===result[2])}
            }
        });
        Object.keys(localPrefixMap).forEach((key)=>turtle = turtle.replace(eval(`/${key}\:/g`),`${localPrefixMap[key].altPrefix}:`))
        //return turtle;
        return turtle
      }
      
  // converts triples into properly prefixed turtle format by invoking rewrite() on triple serialization to MarkLogic turtle.       
 convertToTurtle(triples){
     let turtle = sem.rdfSerialize(triples,"turtle");
     return this.rewrite(turtle);
 }
      
  // Creates a condensed JSON structure where full namespaces are replaced by prefixes, using the MarkLogic rdfjson format. VERY useful.       
  jsonCondense(triples){
      let source = sem.rdfSerialize(triples,"rdfjson");
      var target = {"@context":this.prefixMap,graph:{}};
      Object.keys(source).forEach((subjectURI)=>{
          var subjectCurie = this.curie(subjectURI).replace(/\:$/,'');
          target.graph[subjectCurie] = {};
          Object.keys(source[subjectURI]).forEach((predicateURI)=>{
              var predicateCurie = this.curie(predicateURI);
              target.graph[subjectCurie][predicateCurie]=[];
              var newObj = {}
              source[subjectURI][predicateURI].forEach((obj)=>{
                  if (obj.type === "uri"){
                    newObj = {value:this.curie(obj.value),type:obj.type}
                    }
                  else if (obj.type === "blank"){
                      newObj = Object.assign(obj,{})
                  }  
                  else {
                      newObj = {value:obj.value,type:obj.type,datatype:this.curie(obj.datatype)}
                      
                  }
                  target.graph[subjectCurie][predicateCurie].push(newObj);
              })
          })
      })
      return target; 
  }

  // MarkLogic ordinarily throws an error when trying to convert triples into RDFXML if they use "naked" URIs (e.g., vehicle: as a class designator)
  // This adds a Class designator as the local name for such objects. Note that any RDFXML thus saved MUST use convertFromRDFXML() below
  // to strip the Class designators off before parsing to triples. 
convertToRDFXML(triples){
    let inverseMap = this.inverseMap();
    let newTriples = Array.from(triples).map((triple)=>{
         let subject = sem.tripleSubject(triple);
         subject = inverseMap.hasOwnProperty(subject)?sem.iri(`${subject}Class`):subject;
         let predicate = sem.triplePredicate(triple);
         let object = sem.tripleObject(triple);
         object = !(sem.isLiteral(object)||sem.isBlank(object))?inverseMap.hasOwnProperty(object)?sem.iri(`${object}Class`):object:object;
         return sem.triple(subject,predicate,object);         
    });
    return sem.rdfSerialize(newTriples,"rdfxml")
}

// Converts rdf-xml that has been serialized with convertToRDFXML back to "naked" namespace class designation.
convertFromRDFXML(rdfxml){
    let triples = sem.rdfParse(rdfxml,"rdfxml");
    let inverseMap = this.inverseMap();
    let newTriples = Array.from(triples).map((triple)=>{
         let subject = sem.tripleSubject(triple);
         subject = (String(subject)).match(/\/Class$/)?sem.iri(String(subject).replace(/\/Class$/,"/")):subject;
         let predicate = sem.triplePredicate(triple);
         let object = sem.tripleObject(triple);
         object = !(sem.isLiteral(object)||sem.isBlank(object))?(String(object)).match(/\/Class$/)?sem.iri(String(object).replace(/\/Class$/,"/")):object:object;
         return sem.triple(subject,predicate,object);
    });
    return this.dedup(newTriples);
}

// Removes duplicate triples from a triple array. Useful when ingesting generated triples.  
dedup(triples){
    return sem.sparql('construct {?s ?p ?o} where {?s ?p ?o}',{},[],sem.inMemoryStore(triples));
}

addPrefixesFromTurtle(turtle,warn=false){
    let localPrefixMap = {};
    turtle.split("\n").forEach((line)=>{
        let result = line.match(/\@prefix (\w+):\s*<(.+?)>\s*\./);
        if (result != null){
            localPrefixMap[result[1]] = result[2];
            this.prefixMap[result[1]] = result[2];
        }
     });
     xdmp.documentInsert('/ns/ns.json',this.prefixMap);     
     return localPrefixMap
}

/* updateNSMapFromTurtle(turtle){
      var prefixMap = {};
      turtle.split("\n").forEach((line)=>{
          var result = line.match(/\@prefix (\w+):\s*<(.+?)>\s*\./);
          if (result != null){
            prefixMap[result[1]] = result[2];
          }
      });
    this.ns = prefixMap;
    return prefixMap;
    } */
}
module.exports=NS;