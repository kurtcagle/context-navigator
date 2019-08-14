module.exports = class Graph {
	constructor(graph={'@context':{},graph:{}}){
		this.loadLocal(graph);
		this.defaultLabelPredicate = "term:prefLabel";
		this.hiddenProperties = new Set(["term:prefLabel","rdf:type","term:hasDescription","term:hasPrimaryImageURL"]);

	}
	load(path,callback=()=>{}){
		fetch(path,{headers:{"Cache-Control":"no-cache"}}).then((result)=>result.json())
			.then((json)=>{
				this.g = json.graph;
				this.namespaces = json["@context"];
				console.log(this.g);
				callback(this.g);
			})
	}
	loadLocal(json){
		this.g = json.graph;
		this.namespaces = json["@context"];
	}
	subjects(){
    	return (this.g["report:_"]["report:hasSubject"]).map((subject)=>subject.value);
    }
    value(subject,predicate){
    	return this.has(subject,predicate)?this.g[subject][predicate][0].value:'';
    }
    label(subject,labelPredicate=this.defaultLabelPredicate){
    	return this.g[subject][labelPredicate][0].value
    }
    has(subject,predicate){
      return this.g.hasOwnProperty(subject) && this.g[subject].hasOwnProperty(predicate)
    }
    objectLabel(subject,predicate,labelPredicate=this.defaultLabelPredicate){
    	return this.g[this.g[subject][predicate][0].value][labelPredicate][0].value
    }
    values(subject,predicate){
    	return this.g[subject][predicate].map((item)=>item.value)
    }
    objectCount(subject,predicate){
    	return this.g[subject].hasOwnProperty(predicate)?this.g[subject][predicate].length:0;
    }
    setNodeSelection(subject,state){
    	this.g[subject]["term:isSelected"] = state;
    }
    getNodeSelection(subject){
    	return this.g[subject]["term:isSelected"]||false;
		//return false
    }
    has(subject,predicate){
    	return this.g[subject].hasOwnProperty(predicate);
    }
    properties(subject){
    	return Object.keys(this.g[subject]).filter((property)=>!this.hiddenProperties.has(property))
    }
    links(context){
    	let links = new Map();
    	try {
    	Object.keys(this.g).forEach((subject)=>Object.keys(this.g[subject])
    		.forEach((predicate)=>this.g[subject][predicate]
    		.forEach((obj)=>{
    			if ((obj.value === context) && (obj.type === "uri") && (subject != "report:_")){
    				if (!links.has(predicate)){
    					links.set(predicate,[])
    				}
    				links.get(predicate).push(subject);
    			}
    		})));
    	}
    	catch(e){}
    	return Array.from(links);
    }
  sortByOrder(_keys,reverse=false){
    let keys = _keys.map((key)=>key);
    if (keys.length>0){
      if (this.has(keys[0],'term:hasOrder')){
          keys.sort((key1,key2)=>this.value(key1,'term:hasOrder')>this.value(key2,'term:hasOrder')?1:this.value(key1,'term:hasOrder')<this.value(key2,'term:hasOrder')?-1:0);
          if (reverse){keys.reverse()}
          return keys
      }
    }}
  sortByAlpha(_keys,reverse=false){
    let keys = _keys.map((key)=>key);
    if (keys.length>0){
      if (this.has(keys[0],'term:prefLabel')){
          keys.sort((key1,key2)=>this.value(key1,'term:prefLabel')>this.value(key2,'term:prefLabel')?1:this.value(key1,'term:prefLabel')<this.value(key2,'term:prefLabel')?-1:0);
          if (reverse){keys.reverse()}
          return keys
      }
    }
   else return _keys
  }
  op2s(object,predicate='rdf:type'){
      let subjects = new Set();
      Object.keys(this.g).forEach((subject)=>{
        //subjects.add(`${subject} ${predicate} ${object}`);
        if (this.g[subject].hasOwnProperty(predicate)){
           this.g[subject][predicate].forEach((obj)=>{
           if (obj.value === object) {subjects.add(subject);}
           })
           }
       })
       return Array.from(subjects); 
  }
}