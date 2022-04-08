
const CACHE_STATIC_NAME = "static-v4"

const CACHE_INMUTABLE_NAME = "inmutable-v4"

const CACHE_DYNAMIC_NAME = "dynamic-v4"

const CON_CACHE = true

self.addEventListener("install", e => {
    console.warn(" -----> sw install")

    self.skipWaiting() //skip waiting automatico de sw


    const cacheEstatic = caches.open(CACHE_STATIC_NAME).then(cache => {
        //   console.log(cache)
        //guardar recursos de API SHELL
        return cache.addAll([ //promesa acaba en constante cache. setea cache y devuelve promesa
            '/index.html',
            "/js/api.js",
            "js/main.js",
            "/plantillas/item.hbs",
            "/icon/icon-192x192.png",
            "/icon/icon-256x256.png",
            "/icon/icon-512x512.png",
            "/css/estilos.css",

        ])
    })

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache => {
        //  console.log(cache)
        //guardar recursos de API SHELL
        return cache.addAll([ //promesa acaba en constante cache. setea cache y devuelve promesa
            "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js",
            "https://code.jquery.com/jquery-3.6.0.min.js",
            "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
            "https://fonts.googleapis.com/icon?family=Material+Icons",
            "https://code.getmdl.io/1.3.0/material.min.js",

        ])
    })

    e.waitUntil(Promise.all([cacheEstatic, cacheInmutable])) // esperar a que todas las promesas async terminen
})

self.addEventListener("activate", e => { //deberia borrar cache que no esten en whitelist
    console.warn(" -----> sw activate")
    const cacheWhitelist = [
        CACHE_STATIC_NAME,
        CACHE_DYNAMIC_NAME,
        CACHE_INMUTABLE_NAME
    ]

    //borro todos los cache que no esten en whiteList

    e.waitUntil( //espero que terminen todos los async procesos antes de terminar
        caches.keys().then(nombres => {
            return Promise.all(  // todas las promesas
                nombres.map(key => { //devuelve array de promesas
                    if (!cacheWhitelist.includes(key)) { // si la key es nueva

                        return caches.delete(key) // mapeo caches que necesito borrar
                    }
                })
            )

        }
        ))
})





self.addEventListener('fetch', e => {
    //console.warn('---> sw fetch!')

    if(CON_CACHE) {
        let { url,method } = e.request  //destructuring object
     //   console.log(e.request)

        if(method == 'GET' && !url.includes('mockapi.io')) {

            const respuesta = caches.match(e.request).then( res => {
                if(res) {
                    console.log('EXISTE: el recurso existe en el cache', url)
                    return res
                }
                console.error('NO EXISTE: el recurso NO existe en el cache', url)

                return fetch(e.request).then( nuevaRespuesta => {
                    caches.open(CACHE_DYNAMIC_NAME).then( cache => {
                        cache.put(e.request, nuevaRespuesta )
                    })
                    return nuevaRespuesta.clone()
                })
            })
            e.respondWith(respuesta)
        }
        else {
            console.warn('BYPASS', method, url)
        }
    }
})