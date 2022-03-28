self.addEventListener("install", e => {
    console.log("sw instalado")
})

self.addEventListener("activate", e => {
    console.log("sw activate")
})

self.addEventListener("fetch", e => {
    console.log("sw fetch")
})
