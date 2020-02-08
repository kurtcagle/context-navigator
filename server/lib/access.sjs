var NS = require("/lib/ns.js");
var ns = new NS();


function login(username,password){
    let path = "/ns/stewards.json";
    let doc = fn.doc(path);
    let stewards = JSON.parse(doc);
    let steward = stewards.find((steward)=>steward.username === username && steward.password === password);
    return steward
}

xdmp.addResponseHeader("Access-Control-Allow-Origin", "*");
let requestJSON = xdmp.getRequestBody("json");
let request = JSON.parse(requestJSON);
if (request.action === "login"){
    let steward = login(request.username,request.password);
    if (steward){
        request = Object.assign({},steward);
        delete request.password;
        request.status = true;
        request.action = login;
        request.uid = xdmp.sha1(request.username);
        let query = `${ns.sparql()}
            describe ?user where {
                ?user a class:_User.
                ?user user:hasUsername ?username.
                filter(str(?username) = "${request.username}")
            }`
        let rows = Array.from(sem.sparql(query));
        let userData = {}
        if (rows.length > 0){
            userObj = ns.jsonCondense(rows);
            let userContext = Object.keys(userObj.graph)[0];
            request.context = userContext;
            userData = userObj.graph[userContext];
        }
        request.data = userData;
    }
    else {
        request = {username:"",permissions:[],status:false,isValid:false,action:"logout",data:{}};
        // xdmp.logout();
    }
}
else {
    //xdmp.logout();
    delete request.password;
    request.password = "";
    request.permissions = [];
    request.status = false;
    request.action = "logout";
    request.data = {};
}
JSON.stringify(request,null,4)