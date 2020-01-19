import { Router } from 'aurelia-router';
import {AureliaCookie} from 'aurelia-cookie';

export class App {
  constructor() {
    //this.userRole = new Set([]);
    window.app = this;
    this.params = this.getQueryParams()||{};
    this.oldConfiguration = "";
    this.theme = "blue";
    this.topBannerMessage = `<img src="http://cognitiveworlds.com/lib/getImage.sjs?path=/images/image/_TheCagleReportBanner.jpeg" class="topBannerImage"/>`;
    this.defaultPage = "publisher:_CognitiveWorld";
    this.defaultIcon = "/lib/getImage.sjs?path=/images/image/_DefaultImage.jpeg";
    this.missingImage = "/lib/getImage.sjs?path=/images/image/_DefaultImage.jpeg";
    this.defaultLabel = "GraCIE";
    this.footer = `<div class="copyright">Copyright 2019 Semantical LLC.</div>`;
    this.widgets = {output:['Loading ...']};
    this.activeCSS = "";
    this.context = this.params.context||this.defaultPage;
    this.showProperties = true;
    this.linksContent = "Placeholder";
    this.preferredPredicate = "rdf:type";
    this.qRefine = this.params.qr||"";
    this.cache = this.params.cache||"cached";
    this.q  = this.params.q||"";
    this.qGraph = "";
    this.activeGraph = "";
    this.backupGraph = null;
    this.searchData = {};
    this.history = [];
    this.mode=this.params.mode||"card";
    this.showAdvancedListOptions = true;
    this.showMenu = false;
    //this.sortMode = "createdDateDesc";
    this.sortMode = "sortMode:_ModifiedDateDesc";
    this.sortModeStates = [
      {label:"Created Date Descending",value:"sortMode:_CreatedDateDesc"},
      {label:"Modified Date Descending",value:"sortMode:_ModifiedDateDesc"},
      {label:"Created Date Ascending",value:"sortMode:_CreatedDateAsc"},
      {label:"Modified Date Ascending",value:"sortMode:_ModifiedDateAsc"},
      {label:"Alphanumeric Ascending",value:"sortMode:_AlphaAsc"},
      {label:"Alphanumeric Descending",value:"sortMode:_AlphaDesc"},
      {label:"Internal Order Ascending",value:"sortMode:_OrdinalAsc"},
      {label:"Internal Order Descending",value:"sortMode:_OrdinalDesc"}
];
    this.namespace = '';
    this.activeLinkPredicate = null;
    this.visibleLinks = [];
    let cookieLogin = JSON.parse(AureliaCookie.get("login"));
    console.log(cookieLogin);
    this.loginData = cookieLogin?cookieLogin:{username:"",password:"",permissions:[],status:false,action:"login"};
    this.userRole = new Set(this.loginData.permissions);
    this.page = 1;
    this.pageSize = 20;
    this.itemCount = 0;
    this.totalPages = 1;
    this.wait = false;
    this.templates = {};
    this.server = (""+document.location.href).match(/\:\/\/localhost/)?"http://3.84.16.9:8020":"";
    this.client = (document.location.href).match(/\:\/\/localhost/)?"":"";
    this.cardEdit = false;
    this.editMode = "view";
    this.tempGraph = null;
    this.blocks = [];
    this.loadBlocks();
    this.typedMessage = '';
    this.insertTermObj = {label:"",value:"",temp:"",asImage:false,image:""};
    this.complianceItem={country:"", industry:"",strain:"",enzyme:"",product:"",complianceTest:"",
      noItemsMessage:`<div><p>No Compliance Tests Exist for this combination.</p><p>While this cannot guarantee that there are no compliance requirements,
      it does mean that Dupont has not yet developed a compliance test for this contingency, so you should check with regulatory compliance guidelines.</p></div>`};
    this.instanceList = {};
    this.instanceList['class:_Class']={};
    this.instanceList['class:_Class']['rdf:type']=[];
    this.constraints = [];
    this.activeConstraint = {predicate:'',object:''}
    this.availableProperties = [];
    this.pageIndex =0;
    this.activeProperty = {};
    this.currentPath = "";
    this.selectedProperty = null;
    this.activePropertyValues = [];
    this.activePredicates = [];
    this.availableTemplates = [];
    var hash = window.location.hash.substr(1);
    this.hash = this.mode||hash||"card";
    console.log(this.hash)
    // refs
    this.newModal;
    this.duplicateModal;
    this.addPropertyModal;
    this.addConstraintModal;
    this.editImageModal;
    this.insertTermModal;
    this.loginModal 
    this.userValidated = false;
    this.editImage = {
      src:"",
      width:"500px",
      height:"300px",
      alt:"",
      title:"",
      align:"float:left"
    }
/*    this.globalActions=[
      {label:"Select an action",id:"selectAction",action:()=>console.log("Select an action")},
      {label:"Go To Classes",id:"createNewClass",action:()=>this.fetchContext("class:_Class","card")},
      {label:"Go To Properties",id:"createNewProperties",action:()=>this.fetchContext("class:_Property","card")}
    ];*/
    this.classAction="classAction:_View";
    this.activeClass="";
    this.defaultCard = {title:"New Card",body:"This is a new card.",image:"",curie:"foo:bar",prefix:"",ns:"",datatype:"",nodeKind:"",
domain:"",range:"",cardinality:"",sourceCurie:"",externalURL:"",template:"",activePredicate:"",target:"",filename:"",username:"",password:"",graph:"",predicateEntries:[]};
    this.defaultNamespace = "http://semantical.llc/ns/";
    this.activeCard = Object.assign(this.defaultCard,{});
    this.linkPropertyList = {};
    this.activeLinksData = {count:0,data:[],page:1,pageSize:20,numPages:1};
    this.displayFullBody = false;
//    this.server = "";
//    this.client = this.server
    setTimeout(()=>{
        this.refreshApp();
//        console.log("db",db);
//        this.updateInstanceList('class:_Country');
//        this.updateInstanceList('class:_Industry');
//        this.updateInstanceList('class:_Strain');
//        this.updateInstanceList('class:_ComplianceTest');
      },50);    
  }

  refreshApp(){
    this.updateClassNamespace();
    this.updateConfiguration();
    this.updateInstanceList('class:_Graph');
    this.updateInstanceList('class:_Class');
//    this.updateInstanceList('class:_Property');
    this.updateInstanceList('class:_Cardinality');
    this.updateInstanceList('class:_XSD');
    this.loadMenu('menuItem:_MainMenu','.mainMenu');
  }

  showTypedMessage() {
    alert(this.typedMessage);    
  }

  activateClass(activeClass,classAction){
    console.log(activeClass,classAction);
    switch(classAction){
      case "classAction:_View":this.fetchContext(activeClass);break;
      case "classAction:_New":this.newCard(activeClass);break;
    }
  }

  selectGraph(graph=this.activeGraph){
    this.activeGraph = graph;
    this.updateInstanceList('class:_Class');
  }

  invokeAction(){
    this.globalActions.find((action)=>(action.id === this.selectedClass)).action();
  }


  fetchContext(context,hash="card",dataOptions = {qRefine:'',noPush:false,}){
    if (this.cardEdit){
      alert("You are currently in edit mode. You must save or revert changes first.");
      return}
    var body = this.constraints;
  	var options = {method: 'POST',
               body: JSON.stringify(body,null,4),
               mode: 'cors',
               cache: 'default'};
    this.wait = true;
    //this.cache = cacheState;
  	window.fetch(`${this.server}/lib/server.sjs?context=${context}&cache=${this.cache}&uid=${this.loginData.uid}`,options)
  	.then((blob)=>blob.json())
  	.then((json)=>{

        this.selectedClass = "";
  			this.contextData = json;
  			this.ns = json["@context"];
        this.widgets = json.content;
  			this.g = json["graph"];
  			this.report = this.g["report:_"]
  			if (!options.noPush){this.history.push(this.context);}
  			this.context = this.report['report:hasContext'][0].value;
        window.history.pushState({context:context}, this.g[context]['term:prefLabel'][0].value,`/?context=${context}`);
/*        if (this.g[this.context]['rdf:type'][0].value != 'class:_Class'){
          if (this.g[this.context].hasOwnProperty('rdfs:subClassOf')){
            delete this.g[this.context]['rdfs:subClassOf'];
          }
        }*/
  			this.namespace = this.ciri(context);
//  			this.predicates = this.report['report:hasPredicate']?this.report['report:hasPredicate'].map((predicate)=>predicate.value):[];
        this.predicates = json.predicates;
        this.linkPredicates = json.linkPredicates;
/*        if (this.report.hasOwnProperty('report:hasPredicateNode')){
          let nodes = this.report['report:hasPredicateNode'].map((node)=>node.value);
          nodes.forEach((node)=>{
            //console.log(this.g[node]);
            let predicate = {
                curie:this.g[node]['report:hasPredicate'][0].value,
                label:this.g[node]['report:hasPredicateLabel'][0].value,
                domain:this.g[node].hasOwnProperty('report:hasPredicateDomain')?this.g[node]['report:hasPredicateDomain'][0].value:"class:_Term",
                domainLabel:this.g[node].hasOwnProperty('report:hasPredicateDomainLabel')?this.g[node]['report:hasPredicateDomainLabel'][0].value:"Term",
                domainPlural:this.g[node].hasOwnProperty('report:hasPredicateDomainPluralLabel')?this.g[node]['report:hasPredicateDomainPluralLabel'][0].value:"Terms",
                range:this.g[node].hasOwnProperty('report:hasPredicateRange')?this.g[node]['report:hasPredicateRange'][0].value:"class:_Term",
                rangeLabel:this.g[node].hasOwnProperty('report:hasPredicateRangeLabel')?this.g[node]['report:hasPredicateRangeLabel'][0].value:"Term",
              }
              this.predicates.push(predicate);
          })
        } */
  			this.links = this.report['report:hasLink']?this.report['report:hasLink'].filter((link)=>link.value != null).map((link)=>link.value):[];
        this.page = 1;
        this.preferredPredicate = this.g[context].hasOwnProperty('term:hasPreferredProperty')?this.g[context]['term:hasPreferredProperty'][0].value:null;
  			this.sort();
  			//this.activeLinkPredicate = predicate;
        //this.activateTab(this.predicates.map((predicate)=>predicate.curie)[tabIndex],true,true);
        console.log(tabIndex);
        console.log(this.predicates);
        this.activePredicates = this.linkPredicates; //this.filterListPredicates(this.predicates)||[];
        let tabIndex = this.activePredicates.map((predicate)=>predicate.curie).includes('rdf:type')?this.activePredicates.map((predicate)=>predicate.curie).indexOf('rdf:type'):0;
        console.log("Active Predicates:",this.activePredicates);
        let predicate = this.preferredPredicate?this.preferredPredicate:this.activePredicates.length>0?this.activePredicates[tabIndex].curie:'rdf:type';
        //this.activeLinkPredicate = predicate;
        setTimeout(()=>{
          //this.activateTab(predicate,true,options);
          this.activateTab();
    			this.qRefine = dataOptions.qRefine||"";
    			this.q = "";
          this.reversed = false;
          this.wait = false;
          this.mode = hash;
          //this.getWidgets();
          this.refreshBlocks();
          this.validateUserContext();
        },500)
  			//console.log(this.activeLinkPredicate);
        //console.log("************ Predicates");
        //console.log(this.predicates)
  			//console.log(json)
  		})
  	.catch((err)=>{
      console.log("Error");
      if (!this.g.hasOwnProperty('report:_')){
        this.fetchContext('page:_404_TermNotFound','card');
      }
      else {
        console.log(err);
        this.wait = false;
      }})
    
  }

  filterListPredicates(predicates){
    let termList = ['rdfs:domain','rdfs:range']; //'property:hasDomain','property:hasRange','term:hasPublishingStatus',
    return predicates != null?predicates.filter((predicate)=>!(termList.includes(predicate.curie))):[];
  }

  fetchSearch(){
  if (this.cardEdit){
      alert("You are currently in edit mode. You must save or revert changes first.");
      return}

  	if (this.q != ""){
  	var options = {method: 'GET',
               mode: 'cors',
               cache: 'default'};
  	window.fetch(`${this.server}/lib/search.sjs?q=${this.q}`,options)
  	.then((blob)=>blob.json())
  	.then((json)=>{
        this.mode = 'search';
        this.searchData = json;

  			//console.log("startSearch");
/*  			this.contextData = json;
  			this.ns = json["@context"];
  			this.g = json["graph"];
  			this.report = this.g["report:_"];
  			this.history.push(this.context);
  			this.context = this.report['report:hasContext'][0].value;

  			this.namespace = this.ciri(this.context);
  			this.predicates = this.report['report:hasPredicate']?this.report['report:hasPredicate'].map((predicate)=>predicate.value):[];
  			this.links = this.report['report:hasLink']?this.report['report:hasLink'].map((link)=>link.value):[];
  			this.sort();
  			this.activateTab(this.predicates[0]);
  			this.qRefine = "";
  			//console.log(this.activeLinkPredicate);
  			//console.log(json)
  			//console.log("endSearch");
        */
  		})
  	.catch((err)=>console.log(err))
  	}
  }

inputSearch(){
    if (this.q != ""){
    var options = {method: 'GET',
               mode: 'cors',
               cache: 'default'};
    window.fetch(`${this.server}/lib/search.sjs?q=${this.q}`,options)
    .then((blob)=>blob.json())
    .then((json)=>{
        this.searchData = json;
        console.log(this.searchData)
      })
    .catch((err)=>console.log(err))
    }
  }


  keys(obj,excludes=[]){
  	console.log("***** Keys");
  	let excludeSet = new Set(excludes);
  	let keysObj = [];
  	for(var key in obj){
  		//console.log(obj);
  		//console.log(key);
  		if (!excludeSet.has(key)){keysObj.push(key)}
  		}
  	//console.log(keysObj);	
  	return keysObj.sort();
  }
  ciri(expr){
  	let [prefix,local] = expr.split(":");
  	//console.log(prefix,local);
  	//console.log(this.contextData['@context'])
  	return `${this.contextData['@context'][prefix]}${local}`;
  }
  activateTab(predicate,resetPage=true,noPush=false,options={}){
  	//console.log(`Entering activeTab with predicate = ${predicate}`);
    //this.activeLinkPredicate = null;
    if (options.predicate != null){predicate = options.predicate}
  	this.activeLinkPredicate = predicate?predicate:this.activePredicates.length>0?this.activePredicates[0].curie:"";
    this.activeLinkPredicate = this.activeLinkPredicate != ''?this.activeLinkPredicate:(this.g[this.context]['rdf:type'][0].value === 'class:_Class')?"rdf:type":"";
    //console.log("activeLinkpredicate = ",this.activeLinkPredicate);
    let sortMode = this.g[this.context].hasOwnProperty('class:isClassWithPreferredSortMode')?this.g[this.context]['class:isClassWithPreferredSortMode'][0].value:this.sortMode;
    //console.log(sortMode);
    this.sortMode = sortMode;
    let path = `${this.server}/lib/links.sjs?context=${this.context}&predicate=${this.activeLinkPredicate}&q=${this.qRefine}&page=${this.page}`;
    path += `&pageSize=${this.pageSize}&sort=${this.sortMode||options.sortMode}`;
    if (this.constraints.length>0){
      let constraintString = this.constraints.map((constraint)=>`${constraint.predicate}|${constraint.value}`).join(';');
      path += `&constraints=${constraintString}`;
    }
    this.currentPath = path;
    window.fetch(path)
    .then((response)=>response.json())
    .then((json)=>{
      //console.log(json);
      this.activeLinksData = json;
      this.linksContent = json.content.content||"";
      //console.log(this.linksContent);
      this.page = json.page;
      if (resetPage){
      this.page = 1;
      }
      this.totalPages = json.numPages;
    })

  	}
    prevRefPage(){
      if (this.page > this.totalPages){
        this.page = this.totalPages;
      }
      else {
        this.page = this.page>1?this.page - 1:1;
        }
      this.activateTab(this.activeLinkPredicate,false);
    }
    nextRefPage(){
      if (this.page > this.totalPages){
          this.page = this.totalPages}
      else {
        this.page = this.page<this.totalPages?this.page + 1:this.totalPages;
      }
      this.activateTab(this.activeLinkPredicate,false);
    }
    setPage(page){
      this.page = page;
      this.activateTab(this.activeLinkPredicate,false);      
    }
  	sort(){
      this.activateTab(this.activeLinkPredicate,false);
      return null;
      console.log(this.sortMode);
      let sortValue;
  		//console.log("Links");
  		//console.log(this.links);
  		this.links.forEach((link)=>{
  			//console.log(this.g[link]);
  			this.g[link].link = link;
  		});
  		var linkNodes = this.links.map((link)=>{
  			//console.log("Link");
  			//console.log(link);
  			return this.g[link]
  		});
  		//console.log(this.links);
  		//console.log("entering sort");
  		if (linkNodes.length>1){
        if (this.sortMode === "sortMode:_AlphaAsc"){
            sortValue = (a) => {
              let item = a["term:prefLabel"][0].value.trim();
              return item;
            }
            linkNodes.sort((a,b)=>sortValue(a) <= sortValue(b)?-1:1)
        }
        if (this.sortMode === "sortMode:_AlphaDesc"){
            sortValue = (a) => {
              let item = a["term:prefLabel"][0].value.trim();
              return item;
            }
            linkNodes.sort((a,b)=>sortValue(a) <= sortValue(b)?1:-1)
        }
        if (this.sortMode === "sortMode:_CreatedDateDesc"){
            sortValue = (a)=> a.hasOwnProperty('term:hasCreatedDate')?`${a["term:hasCreatedDate"][0].value}`:"";
            linkNodes.sort((a,b)=> sortValue(a) <= sortValue(b)?1:-1)
        }
        if (this.sortMode === "sortMode:_CreatedDateAsc"){
            sortValue = (a)=> a.hasOwnProperty('term:hasCreatedDate')?`${a["term:hasCreatedDate"][0].value}`:"";
            linkNodes.sort((a,b)=> sortValue(a) <= sortValue(b)?-1:1)
        }
        if (this.sortMode === "sortMode:_ModifiedDateAsc"){
            sortValue = (a)=> a.hasOwnProperty('term:hasLastModifiedDate')?`${a["term:hasLastModifiedDate"][0].value}`:"";
            linkNodes.sort((a,b)=> sortValue(a) <= sortValue(b)?-1:1)

        }
        if (this.sortMode === "sortMode:_OrdinalAsc"){
            sortValue = (a)=> a.hasOwnProperty('term:hasOrder')?parseInt(a["term:hasOrder"][0].value):0;
            linkNodes.sort((a,b)=> sortValue(a) <= sortValue(b)?-1:1)

        }
        if (this.sortMode === "sortMode:_OrdinalDesc"){
            sortValue = (a)=> a.hasOwnProperty('term:hasOrder')?parseInt(a["term:hasOrder"][0].value):0;
            linkNodes.sort((a,b)=> sortValue(a) <= sortValue(b)?1:-1)

        }
	  	}
	  	//console.log("Link Nodes");
  		//console.log(linkNodes);
  		this.links=linkNodes.map((node)=>node.link);
      this.activateTab(this.activeLinkPredicate);
  	}



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

  	displayLiteral(item){
      if (!item){return ""}
      let datatype = item.datatype||"xsd:string";
      switch(datatype){
        case 'xsd:currency_usd':{return `${parseFloat(item.value).toLocaleString(["en-us"],{style:"currency",currency:"USD"})} USD`};
        case 'xsd:currency_eur':{return `${parseFloat(item.value).toLocaleString(["en-us"],{style:"currency",currency:"EUR"})}`};
        case 'xsd:integer':{return parseInt(item.value).toLocaleString(["en-us"],{style:"decimal",maximumFractionDigits:0})};
        case 'xsd:float':{return parseFloat(item.value).toLocaleString(["en-us"],{style:"decimal",maximumFractionDigits:4})};
        case 'unit:_MilesPerGallon':{return `${parseInt(item.value)} mpg`};
        case 'unit:_Mile':{return `${parseInt(item.value).toLocaleString(["en-us"],{style:"decimal",maximumFractionDigits:1})} miles`};
//        case "xsd:dateTime":{return `${(new Date(item.value)).toLocaleString(["en-us"],{ timeZone: 'UTC' } )}`};
//        case "xsd:date":{return `${(new Date(item.value)).toLocaleString(["en-us"],{ timeZone: 'UTC' } )}`};
          case "xsd:dateTime":{return item.value};
          case "xsd:date":{return item.value};
        case "termType:_Image":return `<a href="${item.value}" target="_blank"><img src="${item.value}" class="imageThumbnail"/></a>`;
        case "xsd:textLiteral":return `<pre>${item.value}</pre>`;
        case "xsd:imageURL":return `<div class="internalImageContainer"><a href="${item.value}" target="_blank"><img src="${item.value}" class="link internalImage"/></a></div>`;
        case "xsd:fileURL":return `<div class="internalFileContainer"><a href="${item.value}" target="_blank">${item.value}</a></div>`;
        case "xsd:hexColor":return `<div class="colorSwatchContainer">
          <div class="colorSwatch" style="background-color:${item.value}">&nbsp;</div>
          <div class="colorValue">${item.value}</div>
          </div>`;
        case "xsd:curie":return `<span class="curie">${item.value}</span>`;
        case "xsd:anyURI":return `<a href="${item.value}" target="_blank" class="link">${item.value.replace(/(http.+?\/\/)(.+?\/).*/,'$1$2...')}</a>`;
        case "xsd:anyURL":return `<a href="https://${item.value}" target="_blank" class="link">${item.value.replace(/(http.+?\/\/)(.+?\/).*/,'$1$2...')}</a>`;
        case "identifier:_Email":return `<a href="mailto:${item.value}" target="_blank" class="emailLink"><span>${item.value}</span></a>`
        case "xsd:hours":{
          let lines = item.value.split('|');
          let entries = lines.map((line)=>{
            if (line != ''){
              let [day,time] = line.replace(/(.+?)\:(.+?)/,"$1#$2").split("#");
              day = day.trim();
              time = time.trim();
              return `<div class="item"><div class="label">${day}</div><div class="value">${time}</div></div>`
            }
            else {return ''}
          })
          return `<div class="hours">${entries.join('')}</div>`
        };
  		  default: {return `${item.value}`};
      }

  	}
  	launchService(){
  		window.open(`${this.server}/lib/server.sjs?context=${this.context}`,'')
  	}
    launchSeo(){
      window.open(`${this.server}/lib/seo.sjs?context=${this.context}`,'')
    }
  	pinPage(refresh=true,mode="card"){
      //console.log(this.context);
  		window.location.href = `${this.client}/?context=${this.context}${refresh?`&cache=refresh&mode=${this.mode}`:''}`;
  	}

  	launchPage(context=this.context,mode=this.mode){
  		window.open(`${this.client}/?context=${context}&cache=refresh&mode=${mode}`)
  	}

    launchURL(url){
      window.open(url);
    }


  	goBack(){
      window.history.back();
  	}

    goForward(){
      window.history.back();
    }    
  	wrapArray(arr){
  		let wrappedArray = Array.isArray(arr)?arr:(arr!=null)?[arr]:[];
      if (wrappedArray.length > 0){
        if (wrappedArray[0].type === 'uri'){
          wrappedArray.sort((a,b)=>a.value > b.value?1:a.value < b.value?-1:0)
//          wrappedArray.sort((a,b)=>this.g[a.value]['term:prefLabel'][0].value > this.g[b.value]['term:prefLabel'][0].value?1:this.g[a.value]['term:prefLabel'][0].value < this.g[b.value]['term:prefLabel'][0].value?-1:0)
        }}
      return wrappedArray;
  	}

    tokenize(str,tokenCase = "title"){
      var tokens = str.split(/\s+/);
      let expr = tokens.map((token)=>`${token.substr(0,1).toUpperCase()}${token.substr(1)}`).join('');
      expr = expr.replace(/[^A-z0-9_\-]/gi,'');
      if (tokenCase === "camel"){
        return `${expr.substr(0,1).toLowerCase()}${expr.substr(1)}`;
        }
      else {
        return expr;        
      }
    }

    reverse(){
      this.reversed = ! this.reversed;
      this.page = 1;
      this.activateTab(this.activeLinkPredicate);
    }

    jumpTo(selectedClass){
        this.qRefine = "";
        this.constraints = [];        
        this.fetchContext(selectedClass,'card')
    }

    setMode(mode){
      if (this.cardEdit){
         alert("You must save or revert changes before changing mode.")
      }
      else {
        this.mode=mode;
        this.hash=this.mode;
        this.refreshBlocks();
        switch(mode){
          case "ingestion":this.loadIngestData();break;
          case "list":{
            this.qRefine = "";
            this.constraints = [];
            if (this.predicates.map((predicate)=>predicate.curie).includes('rdf:type')){
              console.log(this.predicates);
              this.activateTab()
            }
            break;
          }
          case "widgets":{
            break;
          }
          default:break
        }
      }
    }
    getWidgets(){
      this.widgets = "<p><b>Loading widgets ...</b></p>"
      let path = `/lib/getWidgets.sjs?context=${this.context}`;
      window.fetch(path)
      .then((response)=>response.json())
      .then((json)=>{
            this.widgets=json;
        })
      .catch((e)=>console.log(e))

    }

    loadIngestData(){
 //     console.log("Ingest data loaded.")
        fetch(`${this.server}/files/analysis.json`)
        .then((blob)=>blob.json())
        .then((json)=>{
          this.templates = json;

        })
    }
    editCard(editMode="edit"){
      this.mode="card";
       if (editMode === "edit"){
         this.activeCard.title = this.g[this.context]['term:prefLabel'][0].value
       }
       else {
         this.activeCard.title = this.g[this.context]['term:prefLabel'][0].value + " Copy";
         this.activeCard.sourceCurie = this.context;
       }
       this.activeCard.body = this.g[this.context]['term:hasDescription']!=null?this.g[this.context]['term:hasDescription'][0].value:"";
       console.log(this.g[this.context].hasOwnProperty('term:hasPrimaryImageURL'));
       this.activeCard.image = this.g[this.context]['term:hasPrimaryImageURL']!=null?this.g[this.context]['term:hasPrimaryImageURL'][0].value:"";
       this.activeCard.context = this.context;
       this.activeCard.curie = this.context;
       console.log(this.g[this.context]['term:hasExternalURL']);
       this.activeCard.externalURL = this.g[this.context]['term:hasExternalURL']!=null?this.g[this.context]['term:hasExternalURL'][0].value:'';
       this.cardEdit = true;
       this.editMode = editMode;
    }
    saveCard(){
//       this.g[this.context]['term:prefLabel'][0].value = this.activeCard.title;
//       this.g[this.context]['term:hasDescription']=[{datatype:"termType:_HTML",value:this.activeCard.body,type:"literal"}];
//       this.g[this.context]['term:hasPrimaryImageURL'] = [{datatype:"termType:_Image",value:this.activeCard.image,type:"literal"}];
       //this.activeCard.curie = this.context;
       this.activeCard.context = this.activeCard.curie;
       let internalTerms = this.extractInternalTerms(this.activeCard.body);
       let path = `${this.server}/lib/saveCard.sjs`;  
       console.log(path);
/*       let options = {
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(this.activeCard),
        method:"post"};*/
//        path += `?json=${JSON.stringify(this.activeCard).replace(/\#/g,"%%%")}`;
        console.log(this.activeCard);
        window.fetch(path,{body:JSON.stringify(this.activeCard),method:"POST"})
       .then((response)=>response.text())
       .then((text)=>{
//          this.pinPage(true,"card");
          this.cache = "refresh";
          this.fetchContext(this.activeCard.curie,"card")
//            console.log(text);
        })
       .catch((e)=>console.log(e));
       this.cardEdit = false;
    }
    filterBody(content,filters=['box']){
      let input = content||"";
      if (input === ""){return ""}
      //console.log(`content = ${input}`);
      filters.forEach((filter)=>{
      switch(filter){
        case "box": input = this.boxFilter(input);return input;break;
        case "lists": input = this.listsFilter(input);return input;break;
        default: input;
      }
    })
    return input
  }
  extractInternalTerms(body){
    let parser = new DOMParser();
    let parsedHtml = parser.parseFromString(body, 'text/html');
    let termCuries = Array.from(parsedHtml.querySelectorAll("a")).filter((node)=>node.getAttribute('property')==='term:hasInternalTerm').map((node)=>node.getAttribute('resource'));
    return termCuries
  }
  
  boxFilter(input){
    input = input.replace(/\[(.*?)\|(.*?)\]/g,`<a href="?context=$1">$2</a>`);
    input = input.replace(/\*/g,`<li>`); // Replaces *s with list items. Doesn't handle inline * case well
    return input;
  }
  iso2Date(isoDate){
    let date = new Date(isoDate);
    return date.toLocaleDateString("en-us",{ year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  deleteItem(index,arr){
    arr.splice(index,1)
  }
  editCardProperties(){
    console.log(this.g[this.context]);
    this.cardEdit=true;
    this.activeCard.title = this.g[this.context]['term:prefLabel'][0].value;
    this.activeCard.body = this.g[this.context]['term:hasDescription'][0].value;

    this.activeCard.image = this.g[this.context]['term:hasPrimaryImageURL'][0].value;
    this.activeCard.externalURL = this.g[this.context]['term:hasExternalURL'][0].value;
    this.activeCard.context = this.context;
    this.activeCard.curie = this.context;
    Object.keys(this.g[this.context]).forEach((predicate)=>{
      if (!Array.isArray(this.g[this.context][predicate])){this.g[this.context][predicate]=[]};
      this.g[this.context][predicate].forEach((object)=>{
        if (object.type === "uri"){
          console.log(object.value,this.g.hasOwnProperty(object.value));
          if (this.g.hasOwnProperty(object.value)){
            if (this.g[object.value]!=null){
              object.label = this.g[object.value]['term:prefLabel'][0].value;
              object.defaultValue = object.value;
              object.defaultLabel = object.label;
            }
          }
        }
      })
    })
  }
  saveCardProperties(){
    this.cardEdit = false;
    let context = this.context;
    let curie = this.activeCard.curie;
       this.g[this.context]['term:prefLabel'][0].value = this.activeCard.title!= ''?this.activeCard.title:`${this.tokenize((new Date()).toISOString())}`;
       this.g[this.context]['term:hasDescription']=[{datatype:"xsd:html",value:this.activeCard.body,type:"literal"}];
       this.g[this.context]['term:hasPrimaryImageURL'] = [{datatype:"xsd:imageURL",value:this.activeCard.image,type:"literal"}];
/*       if (this.activeCard.sourceCurie != ''){
         this.g[this.context]['term:hasSourceTerm'] = [{value:this.activeCard.sourceCurie,type:"uri"}];
       }*/
       this.g[this.context]['term:hasExternalURL']= [{datatype:"xsd:anyURI",value:this.activeCard.externalURL,type:"literal"}];
    let internalTerms = this.extractInternalTerms(this.activeCard.body);  
    let termObjs=internalTerms.map((term)=>{return {value:term,type:"uri"}}); 
    console.log(termObjs);
    this.g[this.context]['term:hasCrossReference']=termObjs
    let buffer = [];
    let update = Array.from(Object.keys(this.g[context])).forEach((predicate)=>{
      Array.from(this.g[context][predicate]).forEach((object)=>{
        if (object.type==='uri'){
          buffer.push(`${curie} ${predicate} ${object.value}.`)
        }
        else {
          buffer.push(`${curie} ${predicate} """${object.value}"""^^${object.datatype||'xsd:string'}.`)
        }
      })
    })
    let triples = buffer.join('\n');
    let prolog = Object.keys(this.ns).map((prefix)=>`prefix ${prefix}: <${this.ns[prefix]}>`).join('\n');
    let output = `${prolog}
delete {${context} ?p ?o}
insert {
  ${triples}
}
where {
  ${context} ?p ?o
}`;
  let newRecord = {"@context":this.namespace,"graph":this.g,subject:context,curie:curie};
  let path = `${this.server}/lib/updateProperties.sjs`;
  window.fetch(path,{method:"POST",body:JSON.stringify(newRecord,null,4)})
       .then((response)=>response.text())
       .then((text)=>{
          //this.pageIndex = this.pageIndex+1;
          //location.href=`/?context=${context}&index=${this.pageIndex}#properties`;
//          this.pinPage(true,"properties");
//          this.cache="refresh";
          this.fetchContext(curie,this.mode||"card");
          //console.log(text);
        })
       .catch((e)=>console.log(e));
  }

  saveDuplicateCardProperties(){
    this.cardEdit = false;
    let context = this.activeCard.curie;
    let curie = this.activeCard.curie;
       this.g[this.context]['term:prefLabel'][0].value = this.activeCard.title!= ''?this.activeCard.title:`${this.tokenize((new Date()).toISOString())}`;
       this.g[this.context]['term:hasDescription']=[{datatype:"xsd:html",value:this.activeCard.body,type:"literal"}];
       this.g[this.context]['term:hasPrimaryImageURL'] = [{datatype:"xsd:imageURL",value:this.activeCard.image,type:"literal"}];
       this.g[this.context]['term:hasExternalURL']= [{datatype:"xsd:anyURI",value:this.activeCard.externalURL,type:"literal"}];
    let internalTerms = this.extractInternalTerms(this.activeCard.body);  
    let termObjs=internalTerms.map((term)=>{return {value:term,type:"uri"}}); 
    console.log(termObjs);
    this.g[this.context]['term:hasCrossReference']=termObjs
    let buffer = [];
    let update = Array.from(Object.keys(this.g[this.context])).forEach((predicate)=>{
      let objects = Array.from(this.g[this.context][predicate]).filter((objects)=>objects!= null);
      Array.from(this.g[this.context][predicate]).forEach((object)=>{
        if (object.type==='uri'){
          buffer.push(`${curie} ${predicate} ${object.value}.`)
        }
        else {
          buffer.push(`${curie} ${predicate} """${object.value}"""^^${object.datatype||'xsd:string'}.`)
        }
      })
    })
    let triples = buffer.join('\n');
    let prolog = Object.keys(this.ns).map((prefix)=>`prefix ${prefix}: <${this.ns[prefix]}>`).join('\n');
    let output = `${prolog}
delete {${context} ?p ?o}
insert {
  ${triples}
}
where {
  optional {
  ${context} ?p ?o
  }
}`;
console.log(output);
  let newRecord = {"@context":this.namespace,"graph":this.g,subject:context,curie:curie,query:output};
  let path = `${this.server}/lib/duplicate.sjs`;
  window.fetch(path,{method:"POST",body:JSON.stringify(newRecord,null,4)})
       .then((response)=>response.text())
       .then((text)=>{
          //this.pageIndex = this.pageIndex+1;
          //location.href=`/?context=${context}&index=${this.pageIndex}#properties`;
//          this.pinPage(true,"properties");
//          this.cache="refresh";
//          this.fetchContext(curie,this.mode||"card");
          //console.log(text);
        })
       .catch((e)=>console.log(e));
  }


  revertCard(){
      this.pinPage(true,"card");
      console.log("revertCard() called");
  }

  getLinkOptions(property){
    if (this.linkPropertyList.hasOwnProperty(property)){
        return this.linkPropertyList[property].values||[];
      }
    else {
        return []
    }
  }
  updateLinkEntry(item,property){
    if (this.linkPropertyList.hasOwnProperty(property)){
      let link = this.linkPropertyList[property].values.find((link)=>link.value === item.label);
      if (link){
        item.value = link.context;
      }
      else {
        let action = confirm("Do you wish this to be a new Entry?");
        if (action){
          item.value = item.value.replace(/^(\w+):(\w+)/,`$1:_${this.tokenize(item.label)}`);
          let prolog = Object.keys(this.ns).map((prefix)=>`prefix ${prefix}: <${this.ns[prefix]}>`).join('\n');
          let update = `${prolog}
  insert data {
    ${item.value}
        a ${this.linkPropertyList[property].type};
        term:prefLabel "${item.label}"^^xsd:string;
        .
  }`;
        console.log(update);
        console.log("ToDo: Complete the update of the new entry.")
        let path = `${this.server}/lib/updateProperties.sjs?update=${encodeURI(update.replace(/(#)/g,"%%%"))}`;
        window.fetch(path)
             .then((response)=>response.text())
             .then((text)=>{
                this.pinPage(true);
                console.log(text);
              })
             .catch((e)=>console.log(e));
        }
        else {
          this.revertItem(item);
        }
      }
    }
  }
  revertItem(item){
    item.value = item.defaultValue;
    item.label = item.defaultLabel;
  }

  login(){
    this.loginData.action="login";
    this.loginModal.open();
  }

  logout(){
    this.loginData.password = "";
    this.loginData.status = false;
    this.loginData.action = "logout";
    this.loginData.data = {};
    let path = `${this.server}/lib/access.sjs`;
    let params = {method:"POST",body:JSON.stringify(this.loginData)};
    //console.log(params);
    window.fetch(path,params)
      .then((response)=>response.json())
      .then((json)=>{
        console.log(json);
          this.loginData  = json;
          this.userRole = new Set(this.loginData.permissions);
          AureliaCookie.delete("login");
          this.cache = "cached";
          this.fetchContext(this.context);
          this.validateUserContext();          
      })
      .catch((e)=>console.log(e));
  }


  processLogin(){
    let path = `${this.server}/lib/access.sjs`;
    let params = {method:"POST",body:JSON.stringify(this.loginData)};
    //console.log(params);
    window.fetch(path,params)
      .then((response)=>response.json())
      .then((json)=>{
        console.log(json);
          this.loginData  = json;
          this.userRole = new Set(this.loginData.permissions);
          if (!this.loginData.status){alert("Log-in failed.")}
          else {
            AureliaCookie.set("login",JSON.stringify(this.loginData),{expiry:60,path:'',domain:'',secure:false})
          }
      })
      .catch((e)=>console.log(e));
  }


  newCard(ctx,asProperty=false,preferredProperty='',target=''){
    let context = ctx||this.context;
    this.context = context;
    this.activeCard = Object.assign(this.defaultCard,{});
    this.activeCard.type = context;
    this.activeCard.title = "";
    this.activeCard.body = "";
    this.activeCard.externalURL = "";
    this.activeCard.template = "";
//    this.activeCard.domain = context;
    this.activeCard.image = this.g.hasOwnProperty(context)?Array.isArray(this.g[context]['term:hasPrimaryImageURL'])?this.g[context]['term:hasPrimaryImageURL'][0].value:"":"";
    this.activeCard.image = this.activeCardImage||"";
    this.activeCard.activePredicate = preferredProperty;
    this.activeCard.target = target;

    if (context === 'class:_Class'){
      this.activeCard.prefix = '';
      this.activeCard.namespace = '';
      this.activeCard.plural = '';
    }
    if (context === 'class:_Property'){
      this.activeCard.nodeKind = '';
      this.activeCard.range = '';
      this.activeCard.datatype = '';
      this.activeCard.cardinality = '';
    }
    else if (asProperty === true){
      this.context = "class:_Property";
      this.activeCard.domain = context;
      this.activeCard.type = "class:_Property";
      this.activeCard.nodeKind = 'nodeKind:_IRI';
      this.activeCard.range = '';
      this.activeCard.datatype = '';
      this.activeCard.cardinality = 'cardinality:_ZeroOrMore';
 
    }
/*    let path = `${this.server}/lib/links.sjs?context=class:_Template&constraints=template:hasTarget|${context}`
    window.fetch(path)
      .then((response)=>response.json())
      .then((json)=>{
        this.availableTemplates = json.data;
      })
      .catch((e)=>console.log(e));
    */
    this.availableTemplates = [];
    /* This gets additional properties appropriate to the class */
    let path = `${this.server}/lib/newTemplate.sjs?context=${this.context}`
    window.fetch(path)
      .then((response)=>response.json())
      .then((json)=>{
        this.templateProperties = json.templateData;
        console.log(this.templateProperties);
        this.generateEntityId(this.context);
        this.newModal.open();
      })
      .catch((e)=>console.log(e));
  }

  duplicateCard(){
    this.revertCard = Object.assign(this.activeCard,{});
    this.activeCard = {
      title:`${this.g[this.context]['term:prefLabel'][0].value} Copy`,
      body:this.g[this.context].hasOwnProperty('term:hasDescription')?this.g[this.context]['term:hasDescription'][0].value:' ',
      image:this.g[this.context].hasOwnProperty('term:hasPrimaryImageURL')&&Array.isArray(this.g[this.context]['term:hasPrimaryImageURL'])?this.g[this.context]['term:hasPrimaryImageURL'][0].value:' ',
      curie:`${this.context}_Copy`,
      sourceCurie:this.context,
      externalURL:this.g[this.context].hasOwnProperty('term:hasExternalURL')?this.g[this.context]['term:hasExternalURL'][0].value:' ',
    };
    this.duplicateModal.open();
  }

  deleteCard(context = this.context,landing ){
      landing = (context === this.context)?this.g[context]['rdf:type'][0].value:landing;
//    let cardType = this.g[context]['rdf:type'][0].value;
//    let typeLabel = this.g[cardType]['term:prefLabel'][0].value;
     if (confirm(`Are you sure you wish to delete this item?`)){
          //console.log(`Delete card ${cardType}`);
          let path = `${this.server}/lib/deleteCard.sjs?context=${context}`;
          window.fetch(path)
            .then((response)=>response.text())
            .then((text)=>{
              console.log(text);
              //location.href =  `${this.client}?context=${cardType}&mode=list&cache=replace`;
              this.refreshApp();
              this.fetchContext(landing,"card")
            })
            .catch((err)=>console.log(err));
     }  
  }
  
  processNewCard(){
    console.log("processing card");
    if (this.activeCard.title === ""){
        let dt = new Date();
        this.activeCard.title = `${dt}`;
        this.activeCard.curie += this.tokenize(dt.toISOString());
      }

    let prolog = Object.keys(this.ns).map((prefix)=>`prefix ${prefix}: <${this.ns[prefix]}>`).join('\n');
        console.log("ToDo: Complete the update of the new entry.");

        if (this.activeCard.prefix != ''){
           this.ns[this.activeCard.prefix] = this.activeCard.namespace;
           let path = `${this.server}/lib/updateNamespaces.sjs?prefix=${this.activeCard.prefix}&namespace=${this.activeCard.namespace}&action=add`;
           window.fetch(path)
             .then((response)=>response.text())
             .then((text)=>{
                console.log(text);
              })
             .catch((e)=>console.log(e));
          }
        this.activeCard.predicateEntries = [];  
        this.templateProperties.filter((predicate)=>predicate.value).forEach((predicate)=>this.activeCard.predicateEntries.push(Object.assign(predicate,{})));
        console.log("Predicate Entries",this.activeCard.predicateEntries);
        let path = `${this.server}/lib/newCard.sjs`;
        window.fetch(path,{method:"POST",body:JSON.stringify(this.activeCard,null,4)})
             .then((response)=>response.text())
             .then((text)=>{
                console.log(this.activeCard);
                //location.href =  `${this.client}?context=${this.activeCard.curie}&cache=refresh&mode=card`;
                this.refreshApp();
                this.fetchContext(this.activeCard.curie,'card');
                //console.log(text);
              })
             .catch((e)=>console.log(e));
  }

  processDuplicateCard(){
    console.log("processing duplicate card");
    let ignorePredicates = new Set(['term:prefLabel','term:hasDescription','term:hasPrimaryImageURL','rdf:type']);
    let prolog = Object.keys(this.ns).map((prefix)=>`prefix ${prefix}: <${this.ns[prefix]}>`).join('\n');
    console.log(this.context,this.g[this.context]);
    let triples = [];
    var triple;
    Object.keys(this.g[this.context]).forEach((predicate)=>{
        if (!ignorePredicates.has(predicate)){
        this.g[this.context][predicate].forEach((object)=>{
          if (object.type === 'literal'){
            triple = `${this.activeCard.curie} ${predicate} ${object.value}.`;
          }
          else {
            triple = `${this.activeCard.curie} ${predicate} """${object.value}"""^^${object.datatype||'xsd:string'}.`;            
          }
          triples.push(triple);
        })
        }})
    let update = `${prolog}
  insert data {
    ${this.activeCard.curie}
        a ${this.g[this.context]['rdf:type'][0].value};
        term:prefLabel """${this.activeCard.title}"""^^xsd:string;
        term:hasDescription """${this.activeCard.body}"""^^termType:_HTML;
        term:hasPrimaryImageURL "${this.activeCard.image}"^^termType:_Image;
        term:isDerivedFrom ${this.activeCard.sourceCurie};
        term:hasExternalURL  "${this.activeCard.externalURL}"^^xsd:anyURI;
        .
    ${triples.join('\n')}
}`;
        console.log(update);
        let path = `${this.server}/lib/updateProperties.sjs?update=${encodeURI(update.replace(/(#)/g,"%%%"))}`;
        window.fetch(path)
             .then((response)=>response.text())
             .then((text)=>{
//                location.href =  `${this.client}?context=${this.activeCard.curie}&cache=refresh`
                console.log(text);
              })
             .catch((e)=>console.log(e));
  }


  generateEntityId(context){
    console.log(`Generate Entity Id - ${context}`)
    if  (context.startsWith('class:')){
      let  prefix = this.tokenize(context.replace(/.*\:_(.+?)$/,"$1"),"camel");
      if (context === 'class:_Class'){
        let cleanTitle = this.summaryFilter(this.activeCard.title,128)
        var id = this.tokenize(cleanTitle);
        this.activeCard.curie =  `class:_${id}`;
        var prefix = this.tokenize(cleanTitle,"camel");
        this.activeCard.prefix = prefix;
        this.activeCard.namespace = `${this.defaultNamespace}${prefix}/`;
        this.activeCard.plural = `${this.activeCard.title}s`;
      }
      else if (context === 'class:_Property'){
        let cleanTitle = this.summaryFilter(this.activeCard.title,128)
        var id = this.tokenize(cleanTitle,"camel");
        var domain = this.tokenize(this.activeCard.domain.replace(/.+?\:_/,''),'camel');

        var prefix = domain;
        this.activeCard.curie =  `${prefix}:${id}`;
        
      }      
      else {
      let cleanTitle = this.activeCard.title;
      let className = this.context.replace(/.*?\:_(.+?)$/,"$1");
      let prefix = `${className.substr(0,1).toLowerCase()}${className.substr(1)}`;
      console.log(this.activeCard);
      var id = this.tokenize(cleanTitle);
      if (id === ""){id = this.tokenize((new Date()).toISOString())}
      this.activeCard.curie = `${prefix}:_${id}`;
      this.activeCard.title = cleanTitle;
      }
    }
    else {
      let cleanTitle = this.activeCard.title;
      let  prefix = this.context.replace(/(.*)\:_.+?$/,"$1");
      console.log(this.activeCard);
      var id = this.tokenize(cleanTitle);
      if (id === ""){id = this.tokenize((new Date()).toISOString())}
      this.activeCard.curie = `${prefix}:_${id}`;
      this.activeCard.title = cleanTitle;
    }
  }


  getTerms(property){
    //console.log(property);
    let path = `${this.server}/lib/terms.sjs?predicate=${property}`;
    window.fetch(path)
       .then((response)=>response.json())
       .then((json)=>{
//          console.log(json.results);
          this.linkPropertyList = {};
          this.linkPropertyList[property] = json.results;
          //console.log(this.linkPropertyList[property]);
       });
    return [];
  }
  updateLink(context,property,item,event){
    console.log("*** updateLink");
    //console.log(item.value,event.srcElement.value);
    let value = event.srcElement.value;
    console.log(value);
    if (value === "delete"){
//       delete this.g[context][property].find((tempItem)=>tempItem.value === item.value);
//       delete this.linkPropertyList[property].find((tempItem)=>event.srcElement.value === tempItem.context);
//       delete event.srcElement;
         item.deleted=true;
      console.log("deletes called");
    }
    else {
        let label = this.linkPropertyList[property].find((tempItem)=>event.srcElement.value === tempItem.context).value;
        console.log(label);
        let foundItem = this.g[context][property].find((tempItem)=>tempItem.value === item.value);
        foundItem.value = value;
        foundItem.label = label;
        console.log(foundItem);
        }
    //item.value = event.srcElement.value;
//    item.label = event.srcElement.label;

  }
  updateClassNamespace(){
        this.activeCard.namespace = `${this.defaultNamespace}${this.activeCard.prefix}/`;

  }
  updateInstanceList(classContext,predicate='rdf:type'){
    let path = `${this.server}/lib/getList.sjs?context=${classContext}&predicate=${predicate}`;
    path += classContext === 'class:_Class'?`&graph=${this.activeGraph}`:''
    window.fetch(path)
       .then((response)=>response.json())
       .then((json)=>{
          //console.log(classContext);
          //console.log(json);
          //if (!this.instanceList.hasOwnProperty(classContext)){this.instanceList[classContext]={};}
          this.instanceList[classContext]={};
          this.instanceList[classContext][predicate]=json;
       });    
  }
filterComplianceTest(){
    let classContext = 'class:_ComplianceTest';
    let predicate = 'rdf:type';
    let path = `${this.server}/lib/getList.sjs?context=${classContext}&predicate=${predicate}`
    let constraintObj = {constraints:[]};
    if (this.complianceItem.country != ""){
      constraintObj.constraints.push({predicate:'complianceTest:hasCountry',object:this.complianceItem.country});
    }
    if (this.complianceItem.industry != ""){
      constraintObj.constraints.push({predicate:'complianceTest:hasIndustry',object:this.complianceItem.industry});
    }
    console.log("Entering Filter Compliance List");
    console.log(constraintObj);
    window.fetch(path,{method:"POST",body:JSON.stringify(constraintObj,null,4)})
       .then((response)=>response.json())
       .then((json)=>{
          //console.log(json);
          //if (!this.instanceList.hasOwnProperty(classContext)){this.instanceList[classContext]={};}
          this.instanceList[classContext]={};
          this.instanceList[classContext][predicate]=json;
       });    
  }

  getDescription(context,object,predicate){
      if (context === null || object === null || predicate === null){return ""}
      let item = this.instanceList[object][predicate].find((item)=>item.curie === context);
      if (item != null){return item.description}
        else {return ""}
      }


  getInstanceList(classContext,predicate='rdf:type'){
     if (this.instanceList.hasOwnProperty(classContext) && this.instanceList[classContext].hasOwnProperty(predicate)){
      return this.instanceList
     }
     else {
      return []
     }
  }

  summaryFilter(content,len=500){
    content = content?content:"";
    content = content.replace(/<.+?>/g,' ').replace(/\s+/g,' ');
    content = content.substr(0,len);
    return `${content}`;
  }

  addProperty(property){
    //alert("Placeholder for add property.")
    let contextType = this.g[this.context]['rdf:type'][0].value;
    let path = `${this.server}/lib/properties.sjs?type=${contextType}&cache=refresh`;
    console.log(path);
    fetch(path)
    .then((response)=>response.json())
    .then((json)=>{
      this.availableProperties = json.results;
      console.log(this.availableProperties);
      this.selectedProperty=property;
      if (property != null){this.setPropertyListValue(property)};  
      this.addPropertyModal.open();
    })
    .catch((e)=>console.log(e))
  }
  activePropertySelected(event){
      let predicate = event.target.value;
      this.setPropertyListValue(predicate);
  }
  setPropertyListValue(predicate){
    console.log(predicate);  
    this.activeProperty = this.availableProperties.find((property)=>property.predicate === predicate);
    console.log(this.activeProperty)
    if (this.activeProperty.nodeKind === 'nodeKind:_IRI'){
    let path = `${this.server}/lib/getList.sjs?context=${this.activeProperty.range}&cache=refresh`;
    fetch(path)
    .then((response)=>response.json())
    .then((json)=>{
      this.activePropertyValues=json;

    })
    .catch((e)=>console.log(e))

     }

  }

  activeClassSelected(event){
    console.log(event);
  }

  processAddProperty(){
    console.log('*',this.activeProperty);
    let set = new Set([]);
    if (this.activeProperty.nodeKind==='nodeKind:_IRI'){
      if (!this.g[this.context].hasOwnProperty(this.activeProperty.predicate)){
        this.g[this.context][this.activeProperty.predicate] = [];
        }
      if ((new Set(['cardinality:_ZeroOrMore','cardinality:_OneOrMore']).has(this.activeProperty.cardinality))){
        if (!set.has(this.activeProperty.value)){
          this.g[this.context][this.activeProperty.predicate].push({'type':'uri',value:this.activeProperty.value});
          set.add(this.activeProperty.value);
          }
        }
      else {
          this.g[this.context][this.activeProperty.predicate] = [{'type':'uri',value:this.activeProperty.value}];        
      }
      this.saveCardProperties();
      }
    if (this.activeProperty.nodeKind==='nodeKind:_Literal'){
      if (!this.g[this.context].hasOwnProperty(this.activeProperty.predicate)){
        this.g[this.context][this.activeProperty.predicate] = [];
        }
      this.g[this.context][this.activeProperty.predicate].push({'type':'literal',value:this.activeProperty.value,datatype:this.activeProperty.datatype});
      this.saveCardProperties();
      }
  }
  addExistingPropertyValue(property){
    let newObject = Object.assign({},this.g[this.context][property][0]);
    newObject.value = "";
    newObject.label = "";
    this.g[this.context][property].push(newObject);

  }

  newConstraint(){
    //alert("Placeholder for add property.")
    let path = `${this.server}/lib/properties.sjs?type=${this.context}&cache=refresh`;
    console.log(path);
    fetch(path)
    .then((response)=>response.json())
    .then((json)=>{
      this.availableProperties = json.results;
      this.activeConstraint.predicate = "";
      this.activeConstraint.object = "";
      this.addConstraintModal.open();
    })
    .catch((e)=>console.log(e))
    }

  processAddConstraint(){
    console.log(this.activeProperty);
    let constraint = Object.assign({},this.activeProperty);
    if (constraint.nodeKind === "nodeKind:_IRI"){
      let propertyValue = this.activePropertyValues.find((activePropertyValue)=>activePropertyValue.curie === constraint.value).label;
      constraint.objectLabel = propertyValue;
    }
    this.constraints.push(constraint);
    console.log(this.constraints);
    this.fetchContext(this.context,"card");      
  }
  removeConstraint(index){
    this.constraints.splice(index,1);
    console.log(this.constraints);
    this.cache="refresh";
    this.fetchContext(this.context,"card");
  }

  clearConstraints(){
    this.constraints = [];
    this.fetchContext(this.context,"card");
  }
  formatDoc(action,params={},gui=false){
    let editor = document.querySelector('.bodyEditor');
    document.execCommand(action,gui,params); editor.focus();
  }
  createHyperlink(){
    var sLnk=prompt('Write the URL here','http://');
    if(sLnk&&sLnk!=''&&sLnk!='http://'){
       let editor = document.querySelector('.bodyEditor');
       let selection = window.getSelection();
       let text = selection.toString();
       let link = `<a href="${sLnk}" target="_blank">${text}</a>`;
       //this.formatDoc('insertHTML',link)}
       document.execCommand('insertHTML',false,link); 
       editor.focus();
     }
  }
  setForeColor(evt){
    console.log(evt);
    this.formatDoc('foreColor',evt.srcElement.value);
  }
  setBackColor(evt){
    console.log(evt);
    this.formatDoc('backColor',evt.srcElement.value);
  }

  setHeading(evt){
    this.formatDoc('formatBlock',evt.srcElement.value);
    evt.srcElement.value="";
  }
  imageEdit(){
//    this.editImageModal.open();
      let selection = document.getSelection();
      let imageNode = selection.anchorNode.querySelector?selection.anchorNode.querySelector("IMG"):null;
      if (imageNode){
        this.editImage = {
          src:imageNode.getAttribute('src'),
          width:imageNode.getAttribute('width'),
          height:imageNode.getAttribute('height'),
          alt:imageNode.getAttribute('alt')||"",
          title:imageNode.getAttribute('title')||"",
          align:imageNode.getAttribute('alignment')||""
        }
      }
      document.execCommand("insertHTML",false,"%^%");
      //this.editImageModal = document.querySelector('.editImageModal');
      console.log("Enter imageEdit");
      this.editImageModal.open();
      console.log("Leave imageEdit");
//      let url = prompt("Image URL");
//      this.processEditImage(url);
  }



  processEditImage(){
    console.log("Entering processEditImage");
    //this.editImageModal.close();
    let img = `<img src="${this.editImage.src}" class="bodyEditorImage ${this.editImage.align}" alignment="${this.editImage.align}"
    alt="${this.editImage.alt}" title="${this.editImage.title}" width="${this.editImage.width}" height="${this.editImage.height}"/>`;
    console.log(img);
    let editor = document.querySelector('.bodyEditor');
    editor.focus();
    //document.execCommand("insertHTML",false,img);
    let html = editor.innerHTML;
    editor.innerHTML = html.replace("%^%",img)

    //editor.focus();
    console.log("Leaving processEditImage");
  }
  cancelEditImage(){
    this.editImageModal.cancel();
    let editor = document.querySelector('.bodyEditor');
    //document.execCommand("insertHTML",false,img);
    let html = editor.innerHTML;
    editor.innerHTML = html.replace("%^%","")

  }

 insertTermDlg(){
    this.insertTermObj = {label:"",value:"",temp:"",asImage:false,image:""};
    let editor = document.querySelector('.bodyEditor');
    let selection = window.getSelection();
    this.q = selection.toString();
    this.insertTermObj.temp = selection.toString();
    this.insertTermObj.label = selection.toString();
    this.formatDoc('insertHTML',"%^%");
    this.inputSearch()
    this.insertTermModal.open()
 }

 insertTerm(){
  console.log("Entering insertTerm()");
  this.q = "";
  let label = this.insertTermObj.temp;
  console.log(this.insertTermObj.asImage);
  let link = (this.insertTermObj.asImage==="image")?`
     <div class="insertedImageContainer">
        <div onclick="window.app.fetchContext('${this.insertTermObj.value}','card')"  class="link"  resource="${this.insertTermObj.value}" property="term:hasInternalTerm">
          <img src="${this.insertTermObj.image}" class="insertedImage"/>
          <div class="imageCaption">${this.insertTermObj.temp}</div>
        </div>
      </div>`:`<span onclick="window.app.fetchContext('${this.insertTermObj.value}','card')" class="link" resource="${this.insertTermObj.value}" 
      property="term:hasInternalTerm">${label}</span>`;
  let editor = document.querySelector('.bodyEditor');
  let html = editor.innerHTML;
  editor.innerHTML = html.replace("%^%",link)
  editor.focus();
 }

 cancelInsertTerm(){
  this.q = "";
  let link = this.insertTermObj.temp;
  let editor = document.querySelector('.bodyEditor');
  let html = editor.innerHTML;
  editor.innerHTML = html.replace("%^%",link)
  //this.insertTermModal.cancel()
  editor.focus();  
 }
 updateInsertTerm(){
  let searchItem = this.searchData.results.find((searchItem)=>searchItem.s === this.insertTermObj.value);
  this.insertTermObj.temp = searchItem.prefLabel;  
 }

  updateInsertImage(){
  let searchItem = this.searchData.results.find((searchItem)=>searchItem.s === this.insertTermObj.value);
  this.insertTermObj.image = searchItem.imageURL;
 }

 insertCodeBlock(){
     let editor = document.querySelector('.bodyEditor');
     editor.focus();
     document.execCommand('insertHTML',false,'<pre class="codeBlock">// Insert Code Here</pre>');
 }

 insertVideo(){
    let videoURL = window.prompt("Enter video URL");
//    videoEmbed = videoEmbed.replace(/width=".*?"/,`width="640"`).replace(/height=".*?"/,`height="480"`);
     let videoEmbed = this.generateVideoLink(videoURL);
     let editor = document.querySelector('.bodyEditor');
     editor.focus();

     document.execCommand('insertHTML',false,videoEmbed);
 }



  hasContent(context,property){
    //console.log(context,property);
    return (property === 'link')?true:!this.g[context][property][0].value.match(/\:_$/)
  }
  deleteClassItems(clearClass=false){
    let message = clearClass?`Warning! This will delete the class "${this.g[this.context]['term:prefLabel'][0].value}", all properties for that class and all items in the class. It can not be undone. Are you sure you want to continue?`:`Warning! This will remove all items from this class (but keep class and properties). It cannot be undone. Are you sure you want to continue?`;
    if (confirm(message)){
      console.log("Delete class items");
      let path = `${this.server}/lib/deleteClassItems.sjs?context=${this.context}&removeClass=${clearClass?'true':'false'}`;
      window.fetch(path)
      .then((response)=>response.text())
      .then((text)=>{
          this.cache = "refresh";
          this.fetchContext("class:_Class",'card')
          })
      .catch((e)=>console.log(e))
    }
  }
  log(content){
    console.log(content);
    return content
  }

  setImage(event){
//    console.log(event);
    //console.log(event.target.value)
    let file = event.srcElement.files[0];
    let reader = new FileReader();
    let target = this.activeCard;
    let me = this;
    reader.addEventListener("load", function () {
      target.image = reader.result;
      target.filename = file.name;
          me.createImageFile();
  }, false);
    reader.readAsDataURL(file);
    //this.activeCard.image = window.URL.createObjectURL(file);
  }

  createImageFile(id=this.activeCard.curie){
    let url = this.activeCard.image;
    let name = this.activeCard.filename;
    if (url.startsWith('data:image')){
       let type=url.replace(/^data:image\/(\w+)\;.*/,'$1');
       let data = url.split(';base64,')[1];
       let options = {"method":"POST",body:JSON.stringify({imageData:data,imageType:type,id:id,filename:name},null,4)}
       let target = this.activeCard;
       window.fetch(`${this.server}/lib/uploadImage.sjs`,options)
       .then((resp)=>resp.json())
       .then((json)=>{
          let path = `${this.server}/lib/getImage.sjs?path=${json.filepath}`;
          target.image = path;
        })
       .catch((e)=>console.log(e))
    }
  }

  setFile(event){
//    console.log(event);
    //console.log(event.target.value)
    let file = event.srcElement.files[0];
    let reader = new FileReader();
    let target = this.activeCard;
    let me = this;
    reader.addEventListener("load", function () {
      target.externalURL = reader.result;
      target.filename = file.name;
      if (target.title != ''){}
      target.title = target.filename.split('.')[0]
      console.log(target.filename);
      me.createFile();
  }, false);
    reader.readAsDataURL(file);
    //this.activeCard.image = window.URL.createObjectURL(file);
  }

  createFile(id=this.activeCard.curie){
    let url = this.activeCard.externalURL;
    let name = this.activeCard.filename;
    if (url.startsWith('data:')){
       let type=url.replace(/^data:(.+?)\;.*/,'$1');
       let data = url.split(';base64,')[1];
       let options = {"method":"POST",body:JSON.stringify({fileData:data,fileType:type,id:id,filename:name},null,4)}
       let target = this.activeCard;
       window.fetch(`${this.server}/lib/uploadFile.sjs`,options)
       .then((resp)=>resp.json())
       .then((json)=>{
          let path = `${this.server}/lib/getFile.sjs?path=${json.filepath}`;
          target.externalURL = path;
        })
       .catch((e)=>console.log(e))
    }
  }


  loadBlocks(){
/*    this.blocks=[
{
      type:"sp",
      predicate:'document:hasAuthor',
      selector:'byline',
      html:``,
      container:'leftPane',
      header:`<h2>Author(s)</h2>`,
      footer:``,
      mode:["card","list"],
      css:`.authorEntry {padding-bottom:10pt;}
      .authorImage {
        width:90%;
        height:auto;
        margin-right:10px;
        margin-bottom:10px;}
      .jobTitle {font-size:10pt;font-style:italic;}
      `,
      template:(context,graph) =>`<div onclick="window.app.fetchContext('${context}')" class="authorEntry">
        <img src="${graph[context]['term:hasPrimaryImageURL'][0].value}" class="authorImage"/>
        <div class="link">${graph[context]['term:prefLabel'][0].value}</div>
        <div class="jobTitle">${graph[context]['author:hasTitle'][0].value}</div>
        </div>`
    },
{
      type:"sp",
      predicate:'document:hasAuthor',
      selector:'aboutAuthor',
      html:``,
      container:"centerPaneAddons",
      header:``,
      footer:``,
      mode:["card"],
      css:`.aboutAuthor_1 {
        padding-bottom:10pt;
        display:flex;
        flex-direction:row;
        padding-top:20px;
      }
      .authorImage2 {
        width:90%;
        height:auto;
        border:inset 10px lightGray;
        border-radius:20px;

      }
      .imageContainer2 {
        display:block;
        width:30%;
        padding:15px;
      }
      .authorDescription {font-size:10pt;font-style:italic;display:block;width:70%}
      `,
      template:(context,graph) =>`<div onclick="window.app.fetchContext('${context}','card')" class="aboutAuthor_1">
        <div class="imageContainer2"><img src="${graph[context]['term:hasPrimaryImageURL'][0].value}" class="authorImage2"/></div>
        <div class="authorDescription">
        ${graph[context]['term:hasDescription'][0].value}</div>
        </div>`
    },
    {
      type:"self",
      predicate:"document:hasTopic",
      selector:'topics',
      separator:', ',
      html:``,
      container:'leftPane',
      header:`<h2>Topic(s)</h2>`,
      footer:``,
      mode:["card","list"],
      css:``,
      template:(context,graph,index,count) =>`<span onclick="window.app.fetchContext('${context}')" class="topic link">${graph[context]['term:prefLabel'][0].value}</span>`
    } ,
    {
      type:"self",
      predicate:"page:hasPreviousPage",
      selector:'previousPage',
      separator:'',
      html:``,
      container:'leftPane',
      header:``,
      footer:``,
      mode:["card","list"],
      css:``,
      template:(context,graph,index,count) =>`<span onclick="window.app.fetchContext('${context}')" class="link">${graph[context]['term:prefLabel'][0].value}</span>`
    },
    {
      type:"self",
      predicate:"term:hasCrossReference",
      selector:'crossRef',
      separator:'',
      html:``,
      container:'leftPane',
      header:`<h2>Related Topics</h2><ul>`,
      footer:`</ul>`,
      mode:["card","list"],
      css:``,
      template:(context,graph,index,count) =>`<li><span onclick="window.app.fetchContext('${context}')" class="topic link">${graph[context]['term:prefLabel'][0].value}</span></li>`
    },
    {
      type:"self",
      predicate:"article:hasOriginalURL",
      selector:'originalLink',
      separator:', ',
      html:``,
      container:'leftPane',
      header:`<h2>Link(s) to Original</h2>`,
      footer:``,
      mode:["card","list"],
      css:``,
      template:(context,graph,index,count) =>`<div><a class="topic link" target="_blank">${window.app.displayLiteral({value:context,datatype:'xsd:anyURI'})}</a></div>`
    }

    ] */
    this.blocks = [];

  }
refreshBlocks(){
    this.blocks.forEach((block)=>{
      let container = document.querySelector(`.${block.container}`);
      if (container != null){
        container.innerHTML = " ";
      }
    })
    this.blocks.forEach((block)=>{
      console.log(block.mode)
      if ((new Set(block.mode)).has(this.mode)){
      let container = document.querySelector(`.${block.container}`);
      if (container!=null){
      if (!container.querySelector(`.${block.selector}`))
      {
        container.innerHTML += `<div class="${block.selector}"> </div>`
      }
      block.html = `<style type="text/css">${block.css}</style><div class="block">${block.header}`;
      let targets = Array.from(document.querySelectorAll(`.${block.selector}`));
      targets.forEach((target)=>target.innerHTML = "");
      console.log(block);
      if (block.type === "sp"){
        if (this.g[this.context].hasOwnProperty(block.predicate)){
          let count = this.g[this.context][block.predicate].length;
          let index = -1;
          let contexts = this.g[this.context][block.predicate].map((object)=>object.value);
          contexts.forEach((context)=>{
          //block.html = block.header;
          window.fetch(`${this.server}/lib/server.sjs?context=${context}`)
          .then((response)=>response.json())
          .then((json)=>{
            let graph = json.graph;
            block.html += block.template(context,graph,index,count);
            index += 1;
          })
          .then(()=>{
              let targets = Array.from(document.querySelectorAll(`.${block.selector}`));
              if (index + 1 === count){
                block.html += `${block.footer}</div>`;
                //console.log(block.html);
                targets.forEach((target)=>{
                   target.innerHTML = block.html;
                  
              })
            }
          })
      })
    }
  }
      if (block.type === "self"){
        console.log("Entering self");
        if (this.g[this.context].hasOwnProperty(block.predicate)){
          console.log(this.g[this.context][block.predicate]);
          let count = this.g[this.context][block.predicate].length;
          let index = -1;          
          let graph = this.g;
          let contexts = this.g[this.context][block.predicate].map((object)=>object.value);
          block.html += contexts.map((context)=>!this.isNullLink(context)?block.template(context,graph,index,count):'').join(block.separator);
          block.html += `${block.footer}</div>`;
          targets.forEach((target)=>{
             target.innerHTML = block.html;
          }) 

        }
      }
    }
    }})
  }
  isNullLink(context){
    return (context.match(/:_$/))
  }
  getValidLink(context,property){
    if (this.g[context].hasOwnProperty(property)){
      let validLink = this.g[context][property].find((value)=>!this.isNullLink(value));
      return validLink;
    }
    else {return false;}
  }
  summary(body){
    if (body!= null){
        let text = body.replace(/<.+?>/g,'');
        text = text.substr(0,300);
        return text.replace(/^(.*)\..*/,'$1 ...');
      }
    else {return ""}
  }
setBodyToTemplate(){
  let templateCurie = this.activeCard.template;
  if (templateCurie != ""){
    this.activeCard.body = this.availableTemplates.find((template)=>template.link === templateCurie).description;
    }
    else {
      this.activeCard.body = "";
    }
  }
  updateConfiguration(){
    let path = `${this.server}/lib/server.sjs?context=class:_Configuration`;
    window.fetch(path)
    .then((response)=>response.json())
    .then((json)=>{
      let graph = json.graph;
      if (graph.hasOwnProperty('class:_Configuration')){
//        console.log("graph",graph);
        if (graph["class:_Configuration"].hasOwnProperty('class:hasActiveConfiguration')){
          let configuration = graph['class:_Configuration']['class:hasActiveConfiguration'][0].value;
          if (configuration != this.oldConfiguration){
          this.oldConfiguration = configuration;
          let path = `${this.server}/lib/server.sjs?context=${configuration}`;
          window.fetch(path)
          .then((response)=>response.json())
          .then((json)=>{
            let graph = json.graph;
            this.theme = graph[configuration].hasOwnProperty('configuration:hasTheme')?graph[configuration]['configuration:hasTheme'][0].value:"";
            this.defaultLabel = graph[configuration].hasOwnProperty('configuration:hasSiteName')?graph[configuration]['configuration:hasSiteName'][0].value:"";
            this.defaultIcon = graph[configuration].hasOwnProperty('configuration:hasIcon')?graph[configuration]['configuration:hasIcon'][0].value:"";
            this.defaultPage =  graph[configuration].hasOwnProperty('configuration:hasHomePage')?graph[configuration]['configuration:hasHomePage'][0].value:"page:_Home";
            this.activeCSS =  graph[configuration].hasOwnProperty('configuration:hasCSS')?graph[configuration]['configuration:hasCSS'][0].value:"";
            this.footer =  graph[configuration].hasOwnProperty('configuration:hasFooter')?graph[configuration]['configuration:hasFooter'][0].value:"";
            this.topBannerMessage =   graph[configuration].hasOwnProperty('configuration:hasTopBanner')?graph[configuration]['configuration:hasTopBanner'][0].value:"";
            let mode = graph[configuration].hasOwnProperty('configuration:hasMode')?graph[configuration]['configuration:hasMode'][0].value:"card";
            this.mode=this.params.mode||mode;
            this.context = this.params != null?this.params.context||this.defaultPage:this.defaultPage;

            this.fetchContext(this.context,this.mode)
          })
          .catch((e)=>console.log(e))
          }}
        }

    })
    .catch((e)=>console.log(e))
  }
  titleCase(expr){
    return expr.replace(/(^|\W)(\w)/g,(text)=>(text).toUpperCase())
  }
  graphToContext(){
    //window.gvis.loadSelectedContext();
    let context = window.gvis?window.gvis.context:this.context;
    this.fetchContext(context,"card");
  }
  graphQ(event){
    console.log(event);
    if (event.keyCode === 13) {
      window.gvis.loadSelectedContext(this.context,this.qGraph);
    }
  }
  article(predicate,object){
    if (object[0].match(/[AEHIOU]/)){
      if (predicate.match(/ A$/)){
        predicate += 'n';
      }
    }
    return predicate;
  }
  getPredicate(predicate){
    return this.predicates?this.predicates.find((predicate)=>predicate === predicate.s):null;
  }
  getPreferredClasses(context){
    if (!this.g){return []}
    let contextClass = this.g[context]['rdf:type'][0].value;
    console.log(contextClass);
    let preferredProperty = this.g[contextClass].hasOwnProperty('term:hasPreferredProperty')?this.g[contextClass]['term:hasPreferredProperty'][0].value:'';
    console.log(preferredProperty);
    if (preferredProperty !=''){
      this.preferredProperty = preferredProperty;
      let prefix = preferredProperty.split(/:/)[0];
      console.log(prefix)
      //console.log(Array.from(this.instanceList['class:_Class']['rdf:type']));
      let classInstances = Array.from(this.instanceList['class:_Class']['rdf:type']).filter((instance)=>instance.prefix === prefix);
      console.log(classInstances);
      return classInstances
    }
    else return []  
  }
    loadMenu(context,selector){
      let path = `/lib/menu.sjs?context=${context}&predicate=menuItem:hasParentMenuItem&sort=sortMode:_OrdinalAsc&transitive=plus&pageSize=100`;
    window.fetch(path)
      .then((response)=>response.json())
      .then((json)=>{
        let menu = json.data;
        let html = this.traverseMenu(menu,context);
        html = html.replace(/<ul><\/ul>/g,'');
        let mainMenu = document.querySelector(selector);
        mainMenu.innerHTML = html;
      })
      .catch((error)=>console.log(error))
    }
    traverseMenu(menu,context,level=0){
      let subMenus = menu.filter((menuItem)=>menuItem.object === context);
      return subMenus.length>0?`<ul>${subMenus.map((menuItem)=>`<li class="menuItem level${level}"><div class="link" onclick="window.app.selectMenuItem('${menuItem.target}')"
        title="${menuItem.description}">${menuItem.linkLabel}</div>${this.traverseMenu(menu,menuItem.link,level+1)}</li>`).join('\n')}</ul>`:'';
    }
    selectMenuItem(context){
      if (context != ""){this.fetchContext(context,'card')};
      this.showMenu = false;
    }
    convertToRichText(){
      let editor = document.querySelector('.bodyEditor');
      editor.innerHTML = editor.textContent;  
      this.activeCard.body = editor.innerHTML;    
    }
    convertFromRichText(){
      let editor = document.querySelector('.bodyEditor');
      editor.textContent = editor.innerHTML;      
      this.activeCard.body = editor.innerHTML;
    }

    getVideoId(url) {
      var regExpYouTube = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var regExpVimeo = /^.*(vimeo\.com)\/(.+$)/

      var match = url.match(regExpYouTube);

      if (match && match[2].length == 11) {
          return {id:match[2],type:"youtube"};
      } else {
      match = url.match(regExpVimeo)  
      if (match){
        return {id:match[2],type:"vimeo"};

      }
      else

       {
          return {type:'error'};
      }
  }}
   generateVideoLink(url){
     var video = this.getVideoId(url);

     if (video.type != 'error'){
        if (video.type === "youtube") {return `<iframe width="640" height="480" src="//www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>`; }
        if (video.type === "vimeo") {return `<iframe width="640" height="480" src="//player.vimeo.com/video/${video.id}" frameborder="0" allowfullscreen></iframe>`; }

        }
      else {return ""}   
    }
    validateUserContext(){
      let role = this.loginData?this.loginData.data?this.loginData.data.hasOwnProperty('user:hasUserRole')?this.loginData.data['user:hasUserRole'][0].value:"":"":"";
      console.log(role);
      switch(role){
        case "userRole:_Admin":this.userValidated=true;break;
        case "userRole:_DataSteward":{
          let typeClass = this.g[this.context]['rdf:type'][0].value;
          this.userValidated = this.loginData.data.hasOwnProperty('user:hasEditClass')?this.loginData.data['user:hasEditClass'].find((editClass)=>editClass.value === typeClass ||editClass.value === this.context)!=null:false;
          };break;
        default: this.userValidated = false;
      }
    }
}

