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
    }
    else {
        request = {username:"",permissions:[],status:false,isValid:isValid,action:logout};
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
}
JSON.stringify(request,null,4)