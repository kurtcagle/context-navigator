// Start SEO
'use strict';
//declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("/lib/ns.js");
var ns = new NS();
let context = xdmp.getRequestField("context","publisher:_CognitiveWorld")
let seoData = JSON.parse(xdmp.invoke("/lib/seo.sjs"),{isIndex:"true"});
let cg = JSON.parse(seoData.cg);
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
html,body {height:100%}
.splashFixed {display:fixed}
.splashContainer {
  display:flex;
  fled-direction:column;
  background-color:black;
  align-items:center;
  justify-content:center;
  width:100%;
  min-height:100vh;
  position:absolute;
  left:0;
  top:0;
  opacity:100%;
  z-index:10;
}
.splashItem img {}
.splashContainer.startFade {
  transition:opacity 4s,z-index 4s;
}
.splashContainer.hide {
 z-index:-2;
  opacity:0
}    
    </style>
    <script type="application/ld+json">
    ${seoData.seo}    
    </script> 
    <script src="/js/ctxmenu/ctxmenu.js">/* */</script>
    <meta property="og:title" content="${cg['term:prefLabel'][0].value}" />
    <meta property="og:url" content="/?context=${context}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${cg.hasOwnProperty('term:hasPrimaryImageURL')?cg['term:hasPrimaryImageURL'][0].value:''}"/>

    <!--<script src="//cdn.jsdelivr.net/npm/pouchdb@7.1.1/dist/pouchdb.min.js"></script>-->
	<script>
	  var db = null;//new PouchDB('my_database');
	</script>
	<script type="application/javascript">
class XPath {
  constructor(document=document,nsmap={}) {
    this.doc = document;
    this.nsmap = nsmap;
    this.resolver = this.namespaceGen(nsmap);
  }

namespaceGen(namespaces){
  return function(prefix) {
  var ns = namespaces;
  return ns[prefix] || null;
  }
}  
 
getNodes(context=this.doc,xpathStr){
   if (xpathStr==null){
     xpathStr = context;
     context = this.doc;
   }
   var  iterator = this.doc.evaluate(xpathStr, context, this.resolver,XPathResult.ANY_TYPE,null);
   var nodeArray = [];
   var node = iterator.iterateNext();
   while (node){
      nodeArray.push(node)
      node= iterator.iterateNext();
      }
  return Array.from(nodeArray);
   }
  
xp(context=this.doc,xpathStr){
  var arr = this.getNodes(context,xpathStr);
  return arr.map((obj)=>this.nodeStr(obj));
  }
}	
	</script>
	
  </head>

  <body aurelia-app="main">
  <div class="splashFixed">
  <div class="splashContainer">
    <div class="splashItem"><img src="/lib/getImage.sjs?path=/images/2020-02-15T05_01_09/Kaleidoscope_Banner_Small.jpg"/>
</div>
    </div>
    <script src="scripts/vendor-bundle.js" data-main="aurelia-bootstrapper"></script>
  </body>

</html>`
