//router.sjs
class Router {
    constructor(){
        this.routes = [];
    }
    add(regex,f=(matches)=>'/lib/target.sjs',method='GET'){
        this.routes.push({regex:regex,f:f,method:new Set([method.toUpperCase()])})
    }        
    get(regex,f=(matches)=>'/lib/target.sjs'){
        this.add(regex,f,"GET");
        return this;
    }    
    put(regex,f=(matches)=>'/lib/target.sjs'){
        this.add(regex,f,"PUT");
        return this;
    }    
    post(regex,f=(matches)=>'/lib/target.sjs'){
        this.add(regex,f,"POST");
        return this;
    }    
    delete(regex,f=(matches)=>'/lib/target.sjs'){
        this.add(regex,f,"DELETE");
        return this;
    }
    exec(path=xdmp.getRequestUrl(),method=xdmp.getRequestMethod()){
        this.routes.push({regex:/(.*)/,f:(matches)=>path,method:new Set(["GET","POST","PUT","DELETE"])});
        let matches = null;
        let route = this.routes.find((route)=>{matches = path.match(route.regex);return route.method.has(method) && matches});
        return route.f(matches);
    }   
}

(new Router())
.get(/^\/meta\/(.+?)[\/}:](.+?)\.(.+?)$/,(matches)=>`/lib/target.sjs?context=${matches[1]}:${matches[2]}&format=${matches[3]}`)
.get(/^\/(files)\/(.+?)$/,(matches)=>`/lib/files.sjs?path=/${matches[1]}/${matches[2]}`)
.exec();