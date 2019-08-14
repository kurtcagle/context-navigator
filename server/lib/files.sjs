let path = xdmp.getRequestField("path");
xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
if (path.endsWith(".json")){
    xdmp.setResponseContentType("application/json")
}
fn.doc(path)