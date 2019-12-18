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
        return sem.iri(`${this.prefixMap[qnames[0]]}${qnames[1]}`);
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
        let localPrefixMap = {};
        let inverseMap = this.inverseMap();
        turtle.split(/\n/).forEach((line)=>{
            var result = line.match(/\@prefix (\w+):\s*<(.+?)>\s*\./);
            if (result != null){
              localPrefixMap[result[1]] = {namespace:result[2],altPrefix:Object.keys(this.prefixMap).find((key)=>this.prefixMap[key]===result[2])}
            }
        });
        Object.keys(localPrefixMap).forEach((key)=>turtle = turtle.replace(eval(`/${key}\:/gim`),`${localPrefixMap[key].altPrefix}:`))
        turtle = turtle.replace(/(@prefix .*?\>\s*?\.\n)/gim,'');
          Object.keys(this.prefixMap).forEach((prefix)=>{
           var nakedURL = new RegExp(`<${this.prefixMap[prefix]}>`,"g");
           turtle = turtle.replace(nakedURL,`${prefix}:`);
        });
        turtle = `${this.turtle()}\n${turtle}`;
        // Convert inline URIs with their corresponding curies
        var re = /<(.+?\/|#)([A-Za-z0-9_\-]+?)>/gi;
        turtle = turtle.replace(re,($1,$2,$3)=>`${inverseMap[$2]}:${$3}`);
        return turtle
      }
      
  // converts triples into properly prefixed turtle format by invoking rewrite() on triple serialization to MarkLogic turtle.       
 convertToTurtle(triples){
     let turtle = sem.rdfSerialize(triples,"turtle");
     return turtle // this.rewrite(turtle);
 }
      
  // Creates a condensed JSON structure where full namespaces are replaced by prefixes, using the MarkLogic rdfjson format. VERY useful.       
  jsonCondense(triples){
      let source = sem.rdfSerialize(triples,"rdfjson");
      var target = {"@context":this.prefixMap,graph:{}};
      Object.keys(source).forEach((subjectURI)=>{
          var subjectCurie = this.curie(subjectURI)?this.curie(subjectURI).replace(/\:$/,''):subjectURI;
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

// This reads in a turtle file and extracts the prefix namespace mappings and adds them to the exist ns.json file.
addPrefixesFromTurtle(turtle){
    let localPrefixMap = {};
    turtle.split("\r\n").forEach((line)=>{
        let result = line.match(/\@prefix (\w+):\s*<(.+?)>\s*\./);
        if (result != null){
            localPrefixMap[result[1]] = result[2];
            this.prefixMap[result[1]] = result[2];
        }
     });
     xdmp.documentInsert('/ns/ns.json',this.prefixMap);     
     return localPrefixMap
}

// If no formatter is specified in ns.convertResultsToTable, this function gets invoked (doing a basic cure() function)
// any formatter passed should follow the same structure. 
defaultFormatter(ns,json,row,index,varName){
//    return JSON.stringify(row);
    return row[varName].type==="uri"?ns.curie(row[varName].value):row[varName].value
}

// This converts a SPARQL-JSON results file into an HTML table, using the passed formatter. 
convertResultsToTable(results,formatter=this.defaultFormatter){
  let json = JSON.parse(sem.queryResultsSerialize(results,"json"));  
  let table = `<table>
  ${json.caption!=null?`<caption>${json.caption}</caption>`:''}
  <thead><tr>${json.head.vars.map((varName)=>`<th>${varName}</th>`).join('\n')}</tr></thead>
<tbody>
  ${json.results.bindings.map((row,index)=>`<tr>${json.head.vars.map((varName)=>`
  <td>${formatter(this,json,row,index,varName)}</td>`).join("\n")}</tr>`).join("\n")}
</tbody></table>`;
    return table
}

// This function takes a parameterized SPARQL endpoint and uses it to retrieve triples and insert them into the given graph.
// If no graph is specified, a UUID-based graph URI is generated. The function returns the graph URI. 
loadGraph(endPoint,options={},format="turtle",graphURI=this.ciri(`graph:_${sem.uuidString()}`)){
    let results = xdmp.httpGet(endPoint,options);
    if (Array.from(results)[0].code === 200){
       let doc = Array.from(results)[1];
//       doc = this.addPrefixesFromTurtle(fn.string(doc));
       let triples = sem.rdfParse(doc,format);
       sem.graphDelete(graphURI);
       sem.graphInsert(graphURI,triples);
       return graphURI
       }
    else {
        return results
        }
    }

// This function takes the result of a SPARQL SELECT query as JSON and maps URIs to CURIES within the output. 

cure(rows){
    let targetRows = [];
    Array.from(rows).forEach((row)=>{
        let obj = {};
        Object.keys(row).forEach((key,index)=>{
            let value = row[key];
            value = (this.isIRI(value)?this.curie(value):value)||value;
            obj[key]=value;
        })
        targetRows.push(obj);
    })
    return targetRows;
    }
    
write(filePath,data){
    xdmp.documentInsert(filePath,data);
    }
    
writeToTtlFile(filepath,triples){
    try {
    let turtle = sem.rdfSerialize(triples,"turtle");
    const nb = new NodeBuilder();
    nb.addText(turtle);
    xdmp.documentInsert(filepath,nb.toNode());
    return {message:`Turtle file has been successfully created at '${filepath}' .`}
    }
    catch(e){
        return {message:"Error Occurred",error:e}
    }
    }
}
module.exports=NS;