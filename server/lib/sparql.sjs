declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns.js");
var ns = new NS();
var prefixMap = ns.readNamespaces();

function invokeSparql(){
    var rawQuery = xdmp.getRequestBody("text")||xdmp.getRequestField("script",'');
    var query = `${ns.sparql()}
    ${rawQuery}`;
    var op = xdmp.getRequestField("op","query")
    var format = xdmp.getRequestField("format","turtle")
    var context = xdmp.getRequestField("context","");
    var curies = context.split(",")
    var pivot = xdmp.getRequestField("pivot","rdf:type");
    var formatSet = new Set(["n3","nquad","ntriple","rdfxml","rdfjson","trig","triplexml"]);
    if (op === "describe"){
//        xdmp.log(`Calling describe:\n ${query}`);
          var triples = sem.sparql(query);
//          return sem.rdfSerialize(triples,format);
          if (format === "turtle"){
            return ns.rewrite(sem.rdfSerialize(triples,"turtle"))
          }
          if (format === "trig"){
            return ns.rewrite(sem.rdfSerialize(triples,"trig"))
          }
          if (format === "curiejson"){
            var json = sem.rdfSerialize(triples,"rdfjson")
            var newJson = {};
            Object.keys(json).forEach((subjKey)=>{
                var subjCurie =''+subjKey;  // (''+subjKey).match('http://marklogic.com/semantics/blank/')?(''+subjKey).replace('http://marklogic.com/semantics/blank/','_:'):ns.curie(subjKey);
                //subjCurie = subjCurie.startsWith('_:')?subjCurie:ns.curie(subjCurie);
                newJson[subjCurie]={}
                Object.keys(json[subjCurie]).forEach((predKey)=>{
                    var predCurie = ns.curie(predKey);
                    var objArr = json[subjKey][predKey];
                    newJson[subjCurie][predCurie]=[];
                    objArr.forEach((obj)=>{
                        var newObj = {};
                        if (obj.type === "uri"){
                            newObj.type = "uri";
                            newObj.value = ns.curie(obj.value) 
                        }
                        else if (obj.type === "bnode"){
//                            newObj.type = "bnode";
//                            newObj.value = `${obj.value}`.replace("http://marklogic.com/semantics/blank/","_:") 
                             newObj = obj;
                        }
                        else {
                            newObj.type = "literal";
                            newObj.datatype = ns.curie(obj.datatype);
                            newObj.value = obj.value 
                        }
                        newJson[subjCurie][predCurie].push(newObj);
                    })
                })
            })

            var dataObj = {timestamp:(new Date()).toISOString(),format:"curiejson",context:curies,pivot:pivot,op:op,data:newJson,namespaces:ns.prefixMap};    
            return dataObj;

          }
          if (format === "json"){
            var json = sem.rdfSerialize(triples,"rdfjson")
            var dataObj = {timestamp:(new Date()).toISOString(),format:"json",context:curies,pivot:pivot,op:op,data:json}    
            return dataObj;

          }
          if (formatSet.has(format)){
            return sem.rdfSerialize(triples,format)          
          }
        }
    if (op === "query"){
        xdmp.log(`Calling query:\n ${query}`); 

        var maps = sem.sparql(query);
        var newMaps = [];
        Array.from(maps).forEach((map)=>{
            var obj = new Object();
            Object.keys(map).forEach((key)=>obj[key]=ns.isIRI(map[key])?ns.curie(map[key]):map[key])
            newMaps.push(obj);
            });
        switch(format){
            case "json":return Array.from(newMaps);break;
            case "html":{
                var buf = [];
                Array.from(newMaps).forEach((map,index)=>{
                if (index === 0){
                    buf.push(`<tr>${Object.keys(map).map((prop)=>`<th>${prop}</th>`).join('\n')}</tr>`);
                }
                buf.push(`<tr>${Object.keys(map).map((prop)=>`<td>${ns.isIRI(map[prop])?ns.curie(map[prop]):map[prop]}</td>`).join('\n')}</tr>`);
                
                });
                xdmp.setResponseContentType("text/html");
                return `<table>${buf.join('\n')}</table>`;
                break;
                }
//            case "query":return sem.rdfSerialize(sparql,"turtle");break;
            }
        }
    if (op === "update") {
        xdmp.log(`Updating with query:\n ${query}`);
        sem.sparqlUpdate(query);
        "OK"
    }
}
invokeSparql()
