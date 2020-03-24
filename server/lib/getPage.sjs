
let url = xdmp.getRequestField("url");
let htmlBlocks = Array.from(xdmp.httpGet(url))
let html = htmlBlocks[1];
html
