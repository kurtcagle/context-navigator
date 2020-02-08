(: let $js := fn:doc('/lib/index.sjs')/string() :)
let $_ := xdmp:set-response-content-type("text/html")
let $_ := xdmp:add-response-header("content-encoding","gzip")
(:let $text := xdmp:javascript-eval($js):)
let $text := xdmp:invoke('/lib/index.sjs')
return xdmp:gzip(text {$text})

(:let $output := xdmp:set-response-content-type("text/html")

let $data :=
<html>
  <head>
    <meta charset="utf-8"/>
    <meta rel="icon" href="/mstile-150x150.png"/>
    <title>Navigator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.1.1/dist/pouchdb.min.js"></script>
	<script>
	  var db = new PouchDB('my_database');
	</script>
  
  </head>

  <body aurelia-app="main">
    <script src="scripts/vendor-bundle.js" data-main="aurelia-bootstrapper">/**/</script>
  </body>

</html>
return $data:)
