declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
let context = xdmp.getRequestField('context','class:_Country');
let classContext;
let scope = (context.startsWith('class:'))?'class':'instance';
if (scope === 'instance'){
    let classQuery = `${ns.sparql()}
    select ?class where {
        ${context} a ?class
    }`;
    let rows = Array.from(sem.sparql(classQuery));
    classContext = ns.curie(rows[0].class)
}
else if (scope === "class"){
    classContext = context;
}
let buffer = [];
let query = `${ns.sparql()}
select ?script ?weight where {
    ?widget a class:_Widget.
    ?widget widget:hasContext "${classContext}"^^xsd:curie.
    ?widget widget:hasScript ?script.
    ?widget widget:hasWidgetWeight ?weight.
    ?widget widget:hasWidgetScope ?Scope.
    filter(str(?Scope) = str('${scope}'))
    } order by asc(?weight)`;
let rows = Array.from(sem.sparql(query))
rows = ns.cure(rows);
rows.forEach((row)=>{
   let script = row.script
   let results = xdmp.eval(script,{context:context,classContext:classContext,scope:scope});
   if (results != ""){buffer.push(results)}; 
});
let output = buffer.join('\r')
  xdmp.setResponseContentType("application/json");
if (buffer.length>0){
    let obj = {context:context,count:buffer.length,output:buffer};
    obj
}
else {
    let obj = {context:context,count:0,output:[""]}
    obj
    }

