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
    <title>Navigator</title>
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
    <meta property="og:title" content="${cg['term:prefLabel'][0].value}" />
    <meta property="og:url" content="/?context=${context}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${cg.hasOwnProperty('term:hasPrimaryImageURL')?cg['term:hasPrimaryImageURL'][0].value:''}"/>

    <!--<script src="//cdn.jsdelivr.net/npm/pouchdb@7.1.1/dist/pouchdb.min.js"></script>-->
	<script>
	  var db = null;//new PouchDB('my_database');
	</script>
  </head>

  <body aurelia-app="main">
  <div class="splashFixed">
  <div class="splashContainer">
    <div class="splashItem"><img src="http://gracie.semanticdatagroup.com/lib/getImage.sjs?path=/images/2020-01-30T10_14_09/GracieSplashSmall.jpg"/>
</div>
    </div>
    <script src="scripts/vendor-bundle.js" data-main="aurelia-bootstrapper"></script>
  </body>

</html>`
