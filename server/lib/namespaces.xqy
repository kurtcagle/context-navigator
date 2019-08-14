import module namespace admin = "http://marklogic.com/xdmp/admin"
		      at "/MarkLogic/admin.xqy";

              let $config := admin:get-configuration()
              let $groupid := admin:group-get-id($config, "Default")
              let $namespaces := admin:appserver-get-namespaces($config,
                         admin:appserver-get-id($config, $groupid, "8010-navigator-webapp"))
              let $map := map:new()
              let $_ := for $namespace in $namespaces return
                  map:put($map,$namespace/*:prefix,$namespace/*:namespace-uri/text())    
              return xdmp:to-json($map) 
          