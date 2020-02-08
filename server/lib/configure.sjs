declareUpdate();
var sem = require("/MarkLogic/semantics.xqy");
var NS = require("ns");
var ns = new NS();
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
var host = xdmp.getRequestField("host","");
var context = xdmp.getRequestField("context","null");
let query = `${ns.sparql()}
select ?context ?mode ?theme ?defaultLabel ?defaultIcon ?defaultPage ?activeCSS ?footer ?topBannerMessage ?hostName ?missingImage where {
    ?c a class:_Configuration.
    ?c configuration:hasHostName ?hostName.
    filter(regex(?hostName,"${host}","i"))
    optional {
    ?c configuration:hasSiteName ?defaultLabel.
    }
    optional {
    ?c configuration:hasIcon ?defaultIcon.
    }
    optional {
    ?c configuration:hasTheme ?theme.
    }
    optional {
    ?c configuration:hasHomePage ?defaultPage.
    }
    optional {
    ?c configuration:hasCSS ?activeCSS.
    }
    optional {
    ?c configuration:hasFooter ?footer.
    }
    optional {
    ?c configuration:hasTopBanner ?topBannerMessage.
    }
    optional {
    ?c configuration:hasMissingImage ?missingImage1.
    }
    bind(coalesce(?missingImage1,?defaultIcon) as ?missingImage)
    optional {
    ?c configuration:hasMode ?mode.
    }
    }
`
let rows = Array.from(sem.sparql(query));
let activeRow = rows[0];
activeRow


/*              this.theme = graph[configuration].hasOwnProperty('configuration:hasTheme')?graph[configuration]['configuration:hasTheme'][0].value:"";
            this.defaultLabel = graph[configuration].hasOwnProperty('configuration:hasSiteName')?graph[configuration]['configuration:hasSiteName'][0].value:"";
            this.defaultIcon = graph[configuration].hasOwnProperty('configuration:hasIcon')?graph[configuration]['configuration:hasIcon'][0].value:"";
            this.defaultPage =  graph[configuration].hasOwnProperty('configuration:hasHomePage')?graph[configuration]['configuration:hasHomePage'][0].value:"page:_Home";
            this.activeCSS =  graph[configuration].hasOwnProperty('configuration:hasCSS')?graph[configuration]['configuration:hasCSS'][0].value:"";
            this.footer =  graph[configuration].hasOwnProperty('configuration:hasFooter')?graph[configuration]['configuration:hasFooter'][0].value:"";
            this.topBannerMessage =   graph[configuration].hasOwnProperty('configuration:hasTopBanner')?graph[configuration]['configuration:hasTopBanner'][0].value:"";
            let mode = graph[configuration].hasOwnProperty('configuration:hasMode')?graph[configuration]['configuration:hasMode'][0].value:"card";
            this.mode=this.params.mode||mode;
            this.context = this.params != null?this.params.context||this.defaultPage:this.defaultPage;
*/