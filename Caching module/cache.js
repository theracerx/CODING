 let c_cache

 caches.open("CACHE_STORAGE_NAME")
    .then(cache => {    //match any similar URL in cache
        c_cache = cache
        return caches.match(url,{ignoreSearch:true}) 
    })
    .then(cacheResponse => { //actions on match result
        if(cacheResponse && cacheResponse.url == url){ //hit
            console.log("cache already exist")
            return cacheResponse.blob() 
        } else if(cacheResponse && cacheResponse.url != url){ //outdated
            c_cache.delete(cacheResponse.url)
            c_cache.add(url) 
            console.log("cache updated")
            return url
        } else { //miss
            c_cache.add(url)
            console.log("cache added")
            return url
        }
    })
    .then( src =>{ 
        // if newly updated! URL must be decode first
        // if cache already exists! convert blob to dataURL

        if (src instanceof Blob){
            let reader = new FileReader();
            reader.readAsDataURL(src);
            reader.onloadend = ()=>{
                // do something with dataURL
                console.log(reader.result)
            }
        } else {
            fetch(src)
            .then(res => res.arrayBuffer())
            .then(output => {
                //do something with output
                console.log(output)
            })
        }
    } )