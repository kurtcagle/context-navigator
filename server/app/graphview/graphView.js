Object.prototype.propVal = function(predicate){
    return this[predicate][0].value;
}
Object.prototype.propKind = function(predicate){
    return this[predicate][0].nodeKind;
}

Object.prototype.propDatatype = function(predicate){
    return this[predicate][0].dataType;
}


class GraphVis {
    constructor(){
        this.params = this.getQueryParams();
        this.vis = vis;
        this.g = [];
        this.graphIDs = new Set();
        this.nodes = new vis.DataSet([]);
        this.nodeIDs = new Set([]);
        this.edges = new vis.DataSet([]);
        this.edgeIDs = new Set([]);
        this.pageSize = 50;
        this.ignoredPredicates = new Set(['term:isMemberOf']);
        this.options = {  
              "nodes": {
                  "shape":"image",
                  "brokenImage":"http://www.daviddarling.info/images/sphere.jpg",                  
                  "widthConstraint":{"maximum":320}
              },/*
              "physics": {
                "barnesHut": {
                  "springLength": 250
                },
                "minVelocity": 0.75
              },*/ 
              "physics": {
                "forceAtlas2Based": {
                  "springLength": 250
                },
                "minVelocity": 0.75,
                "solver": "forceAtlas2Based",
                "timestep": 0.8
             } ,
             "layout":{
                "randomSeed":2,
                "improvedLayout":true
                }
          };

        this.keys = [];
        this.container = document.querySelector('.graphDisplay');
        this.counter = 0;
        this.network = new this.vis.Network(this.container, {nodes:this.nodes,edges:this.edges}, this.options); 
        this.context = this.params.context;
//        window.parent.gvis = this;
        setTimeout(()=>this.fetchData(this.params.context),50);
    }

    fetchData(context,q=''){
        window.parent.gvis = this;
        this.container.classList.add("wait");
        window.fetch(`/lib/server.sjs?context=${context}`)
        .then((blob)=> blob.json())
        .then((json)=>{
//            console.log(json);
            Object.keys(json.graph).forEach((key)=>{
                if ((!this.graphIDs.has(key)) && (key != 'report:_')){
                    this.g[key]=json.graph[key];
                    this.graphIDs.add(key);
                }
            })
            this.context = context;
            this.report = json.graph['report:_'];
//            console.log(this.report);
            this.links = this.report.hasOwnProperty('report:hasLink')?this.report['report:hasLink'].map((item)=>item.value):[];
            this.links.push(this.context);
//            console.log(this.links);
            window.fetch(`/lib/links.sjs?context=${context}&predicate=null&pageSize=${this.pageSize}&q=${q}`)
                .then((blob)=>blob.json())
                .then((json)=>{
                    this.inlinks = json.data;
                    console.log(this.inlinks);
                    this.generateNetwork(context);
                    this.container.classList.remove("wait");
                    //window.parent.gvis = this;
                })
                .catch((e)=>console.log(e))
            })
        .catch((e)=>console.log(e));
    }

    generateNetwork(context){
        this.links.forEach((key)=>{
//            console.log(key);
            var label = (this.g[key])?this.g[key]['term:prefLabel'][0].value:key;
            var subjectType = (this.g[key])?this.g[key]['term:isMemberOf']?this.g[key]['term:isMemberOf'][0].value:this.g[key]['rdf:type']?this.g[key]['rdf:type'][0].value:'':'';
//            console.log(subjectType);
            let image = this.g[key].hasOwnProperty('term:hasPrimaryImageURL')?this.g[key]['term:hasPrimaryImageURL'][0].value:"";
            var subjectNode = {id: key, label:`<<${subjectType.replace('class:_','')}>>\n${label}`,group:subjectType,image:image};
            if (key === context){
                subjectNode.shape = 'circularImage';
                subjectNode.size = 40;
                subjectNode.shadow = true;
            }
            subjectNode.label = label;
            if (!this.nodeIDs.has(key)){
                this.nodes.add(subjectNode)
                this.nodeIDs.add(subjectNode.id)
                }
//            console.log(this.nodes);
            var predicates = Object.keys(this.g[key]).filter((predicate)=>!this.ignoredPredicates.has(predicate));
//            console.log(predicates);
            predicates.forEach((predicate)=>{
                var objects = this.g[key][predicate];
                objects.forEach((object)=>{
                    if (object.type === "uri"){
//                        console.log(this.g[object.value]);
                        var label =(this.g[object.value])?this.g[object.value]['term:prefLabel']?this.g[object.value]['term:prefLabel'][0].value:object.value:object.value;
//                        console.log(label);
//                        var objectType = (this.g[object.value])?this.g[object.value]['rdf:type'][0].value:'';
                        var objectType = (this.g[object.value])?this.g[object.value]['rdf:type']?this.g[object.value]['rdf:type'][0].value:'':'';
//                        console.log(objectType);
                        let image = (this.g[object.value])!=null?this.g[object.value].hasOwnProperty('term:hasPrimaryImageURL')?this.g[object.value]['term:hasPrimaryImageURL'][0].value:"":"";
                        var objectNode = {id: object.value, label:`<<${objectType.replace('class:_','')}>>\n${label}`,group:objectType,image:image};
                        objectNode.label = label;
                        if (!this.nodeIDs.has(objectNode.id)){
                            this.nodes.add(objectNode)
                            this.nodeIDs.add(objectNode.id)
                            }
                        var edgeID = `${key}-${objectNode.id}-predicate`;
//                        console.log(predicate);
                        var edge = {from:key,to:objectNode.id,label:this.g[predicate]['term:prefLabel'][0].value,arrows:'to',id:edgeID}
//                        console.log(edge);
                        if (!this.edgeIDs.has(edgeID)){
                            this.edges.add(edge);
                            this.edgeIDs.add(edgeID)
                            }
                        }
                    else {
/*                          this.counter = this.counter + 1;
                        var id = `_${this.counter}`
                        var datatype = object.datatype;
                        var label = `${object.value}`;
//                        console.log(label);
                        var objectNode = {id: id, label:label,shape:'box',color:{background:'white'}};
                        this.nodes.add(objectNode);
                        var edgeID = `${key}-${objectNode.id}-predicate`;
                        var edge = {from:key,to:objectNode.id,label:predicate,arrows:'',id:edgeID}
//                        console.log(edge);
                        if (!this.edgeIDs.has(edgeID)){
                            this.edges.add(edge);
                            this.edgeIDs.add(edgeID)
                            } */
                    }
                   
                    });
                })
            })
          console.log(this.inlinks);
          this.inlinks.forEach((link)=>{
              let nodeID = link.link;
              let node = {id: nodeID, label:link.linkLabel,group:link.type,image:link.image};
              let edgeID = `${nodeID}-${context}-${link.predicate}`;
              let edge= {from:nodeID,to:context,label:link.predicateLabel,arrows:'to',id:edgeID};
              if (!this.edgeIDs.has(edgeID)){
                    this.edges.add(edge);
                    this.edgeIDs.add(edgeID);
                    }
              if (!this.nodeIDs.has(nodeID)){
                    this.nodes.add(node);
                    this.nodeIDs.add(nodeID);
                    }
            })
          
          var data = {
            nodes: this.nodes,
            edges: this.edges
          };
          var graphVis = this;
    this.network.on("click", function (params) {
        console.log(params);
        var newContext = this.getNodeAt(params.pointer.DOM);
//        console.log(newContext);
//        gvis.data = {};
        gvis.context = newContext;
        //gvis.loadSelectedContext();
        gvis.fetchData(newContext);
        //location.href=`?context=${newContext}&mode=card`;
    });            

    this.network.on("doubleClick", function (params) {
//        console.log(params);
        var newContext = this.getNodeAt(params.pointer.DOM);
        gvis.context = newContext;
        window.parent.app.fetchContext(gvis.context,'card');
        
    });            


    }
    

/*      generateNetwork(context){
          var nodes = new this.vis.DataSet([
            {id: 1, label: 'Node 1'},
            {id: 2, label: 'Node 2'},
            {id: 3, label: 'Node 3'},
            {id: 4, label: 'Node 4'},
            {id: 5, label: 'Node 5'}
          ]);
        
          // create an array with edges
          var edges = new this.vis.DataSet([
            {from: 1, to: 3},
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5},
            {from: 3, to: 3}
          ]);
        
          // create a network
          var container = document.querySelector('.graphDisplay');
          var data = {
            nodes: nodes,
            edges: edges
          };
          var options = {};
          var network = new this.vis.Network(container, data, options);    
    } */


  	getQueryParams(){
  		var url = window.document.location.href;
  		var queryStr = url.split("?")[1];
  		var params = {};
  		if (queryStr != null){
  			var paramStrs = queryStr.split("&");
  			paramStrs.forEach((paramStr)=>{
  				var paramTerms = paramStr.split("=");
  				var paramName = paramTerms[0];
  				var paramValue = paramTerms.slice(1).join("=");
  				params[paramName] = paramValue;
  			})
  	    return params;
  		}
  	}
  	loadSelectedContext(context,q){
/*    	    if (this.context){
  	    window.parent.location.href=`/?context=${this.context}&mode=graph`;  	        
  	    }*/
  	  this.nodes = new vis.DataSet([]);
        this.nodeIDs = new Set([]);
        this.edges = new vis.DataSet([]);
        this.edgeIDs = new Set([]);
        this.network.setData({nodes:this.nodes,edges:this.edges});
        this.fetchData(this.context,q);

  	}
  	message(expr){console.log(expr)};
}

var gvis = new GraphVis();

