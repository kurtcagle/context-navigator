function strip(html){
    return html.replace(/<.*?>/g,'').replace(/\"/g,'&#34;').replace(/\'/g,"&#39;")
}

let template = (graph,context,cg,schemaType)=>`{
    "@context": {
        "@vocab": "http://schema.org#",
        "schema":"http://schema.org#",
        "person": "http://semanticalllc.com/ns/person/",
        "company": "http://semanticalllc.com/ns/company/",
        "article": "http://semanticalllc.com/ns/article/",
        "magazine": "http://semanticalllc.com/ns/magazine/",
        "xsd": "http://www.w3.org/2001/XMLSchema"
    },
    "@type": "${schemaType}",
    "@id": "${context}",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "http://cognitiveworlds.com/?context=${context}"
    },
    ${cg.hasOwnProperty('document:hasAuthor')?`    "author": 
        ${cg['document:hasAuthor'].map((authorNode)=>authorNode.value).map((author)=>
        `{"@type": "Person",
        "name": "${graph[author]['term:prefLabel'][0].value}",
        "@id": "${author}",
        "url": "http://cognitiveworlds.com/?context=person:_${author}"}`)}
    ,`:''}
    "headline": "${cg['term:prefLabel'][0].value}",
    ${cg.hasOwnProperty('term:hasCreatedDate')?`"datePublished": "${cg['term:hasCreatedDate'][0].value}",`:''}
    "dateModified": "${cg['term:hasLastModifiedDate'][0].value}",
    "articleBody":"${strip(strip(cg['term:hasDescription'][0].value))}",  
    "url": "http://cognitiveworlds.com/?context=${context}",
    "publisher": {
        "@type": "Organization",
        "name": "Cognitive World",
        "@id": "company:_CognitiveWorld",
        "url": "http://cognitiveworlds.com/?context=company:_CognitiveWorld",
        "logo": {
            "@type": "ImageObject",
            "url": "http://cognitiveworlds.com/images/logo.jpg"
        }
    },
     ${cg.hasOwnProperty('article:hasMagazine')?`
    "publication": 
      ${cg['article:hasMagazine'].map((magazineNode)=>magazineNode.value).map((magazine)=>
        `{"@type": "PublicationEvent",
        "name": "${graph[magazine]['term:prefLabel'][0].value}",
        "@id": "${magazine}",
        "url": "${graph[magazine]['term:hasPrimaryImageURL'][0].value}"
        }`)},`:''}
    "image": {
    "@type": "ImageObject",
    "url": "${cg.hasOwnProperty('term:hasPrimaryImageURL')?cg['term:hasPrimaryImageURL'][0].value:''}"
    }
}`;
template