import apiLista from "./api.js"

//Variables globales

let listaProductos = [  
]

/*window.localStorage.setItem("listaProd", JSON.stringify(listaProductos))  */


function guardarListaProductos(lista) {
    localStorage.setItem('lista', JSON.stringify(lista))
}

function leerListaProductos() {
    let lista = []

    let prods = localStorage.getItem('lista')
    if(prods) {
        try {
            lista = JSON.parse(prods)
        }
        catch {
            guardarListaProductos(lista)
        }
    }
    return lista
}

//Funciones globales
async function reiniciarItem(id) {
    //encontrar item
    let ele = listaProductos.find(ele => ele.id == id)

    // setear
    ele[cantidad] = ""
    ele[precio] = ""
    await apiLista.put(id, ele) // actualizar 
    renderLista()
}


async function cambiarValor(atributo, cantidad, id) {  //lo recibe como string en atributo

    //encontrar el elemento
    let ele = listaProductos.find(ele => ele.id == id)


    let numero = atributo == "precio" ? parseInt(cantidad) : Number(cantidad)

    ele[atributo] = numero //cambiar su atributo
    console.warn(`${ele["nombre"]} cambio en ${atributo} :  ${numero}`)
    await apiLista.put(id, ele) //actualizar
    
    console.warn(await apiLista.get())
    renderLista()


}

async function borrarItem(id) {
    console.log("borrar" + id)
    await apiLista.del(id)
    console.warn(await apiLista.get())
    renderLista() // re render
}

window.packageHBS = {  
    cambiarValor, borrarItem, reiniciarItem
}
 



async function renderLista() {

    let plantilla = await fetch("plantillas/item.hbs").then(r => r.text()) //obtengo plantilla en forma text
    let template = Handlebars.compile(plantilla)  // compilo con plantilla string

    //no necesario tener que rehacer consultas
    listaProductos = await apiLista.get() //lista tomada de nube

     //Guardamos la lista de productos actualmente representada al render
     guardarListaProductos(listaProductos)
     
    let htmlFinal = template({ producto: listaProductos }) // alimento con lista, output html concatenado con c obj ref
    document.querySelector("#lista").innerHTML = htmlFinal
    componentHandler.upgradeElements(document.querySelector("#lista"))

}



function agregarListenersEleEstaticos() { //botones estaticos

    //agregar ele
    document.querySelector("#btn-add-producto").addEventListener("click", async () => {
        console.warn("nuevo prod ingresado")
        let valor = document.querySelector("#sample1").value
        if (valor) {
            let nuevoProducto = { nombre: valor, precio: 1, cantidad: 1 }
            await apiLista.post(nuevoProducto)
            renderLista()
        } else {
            console.log("error")
        }

    })

    document.getElementById("btn-remove-all").addEventListener("click", async e => {
        console.warn("borrado total")
        // listaProductos = [] // for each delete 
        await apiLista.deleteAll(listaProductos)

        renderLista()
    })
}

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        //estÃ³ de debe ejecutar cunado toda el documento web estÃ© cargado
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('El service worker se registrÃ³ correctamente',reg)

                reg.onupdatefound = () => {
                    const installingWorker = reg.installing
                    installingWorker.onstatechange = () => {
                        console.log('SW --> ', installingWorker.state)
                        if(installingWorker.state == 'activated') {
                            console.error('Reinicio en 2 segundos ...')
                            setTimeout(() => {
                                console.log('Ok')
                                location.reload()
                            },2000)
                        }
                    }
                }

            })
            .catch(err => {
                console.error('Error al registrar el service worker', err)
            })
    }
    else {
        console.error('serviceWorker no estÃ¡ disponible en navigator')
    }
}

function testCache(){
    if (window.caches){
        console.log("el cliente soporta cache")
        console.log(caches)

        /*creo espacio en caches*/
        caches.open("prueba1") /*si existe lo abre, si no existe lo crea y lo abre*/
        caches.open("prueba2")
        /**/
        caches.has("prueba1").then(console.log) /*toma funcion, console.log 

        /*borrar cache*/
        //caches.delete("prueba1").then(console.log)
      //  caches.has("prueba1").then(r => console.log(r))

        /* listo todos los caches*/
        caches.keys().then(console.log)

        /*abro cache y trabajo*/
        caches.open("cache-v1.1").then(c => {
           // c.add("/index.html")
            c.addAll([
                "/index.html",
                "/css/estilos.css",
                 
            ]).then( () => {console.log("recursos agregados")}) //por si no existe recurso
        })


    }
}


function start() {

    console.warn("Super Lista")
    registrarServiceWorker()
    renderLista()
    agregarListenersEleEstaticos()
    //testCache()
}


//Ejecucion
start()


export default {leerListaProductos, guardarListaProductos}