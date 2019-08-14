let NS = require("/lib/ns.js");
let ns = new NS();

let makeArray = (arr)=>Array.isArray(arr)?arr:arr != null?[...[arr]]:[];

class Pipeline {
  constructor(){
    this.rules = [];
    this.triples = [];
    this.batchId = ns.ciri(`complianceTest:_${sem.uuidString()}`);
    this.curieExclusionSet = new Set(["jurisdictions","constraints"])
  }
  addRule(rule){
    let isCurieRegex = /^[A-z0-9_\-]+\:[A-z0-9_\-]+$/
    Object.keys(rule).forEach((key)=>{
      let terms = makeArray(rule[key]);
      let newTerms = terms.map((term)=>!this.curieExclusionSet.has(key)&&term.match(isCurieRegex)?ns.ciri(term):term);
      rule[key]=newTerms;
    })
    rule.batchId = this.batchId;
    this.rules.push(rule)
  }
  execute(){
     this.rules.forEach((rule)=>{
     let query = `${ns.sparql()}
${fn.doc(rule.sparql)}`;
     query = eval("(rule)=>`"+query+"`");
     rule.query = query(rule);
     let outputTriples = sem.sparql(query(rule),rule);
     this.triples.push(outputTriples);
  })
  return this.triples   
  }
}

module.exports=Pipeline;