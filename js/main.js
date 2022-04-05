import apiLista from "./api.js"

//Variables globales

let listaProductos = [ //para no tener que hacer get
]

/*window.localStorage.setItem("listaProd", JSON.stringify(listaProductos))  */


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

window.packageHBS = { /*podria agregarse add event listener 
y pasar parametros a data set, pero con*/
    cambiarValor, borrarItem, reiniciarItem
}
/*
function cambiarPrecio(precioNuevo,indice){
    console.log("precio viejo ", listaProductos[indice].precio)
    
    console.warn("precio nuevo", precioNuevo)
    
    listaProductos[indice].precio = parseFloat(precioNuevo)

}

function cambiarCantidad(cantidadNueva ,indice){
    console.log("cantidad vieja ", listaProductos[indice].cantidad)
    
    console.warn("cantidad nueva", cantidadNueva)
    
    listaProductos[indice].cantidad = parseInt(cantidadNueva)  
}
*/





async function renderLista() {

    let plantilla = await fetch("plantillas/item.hbs").then(r => r.text()) //obtengo plantilla en forma text
    let template = Handlebars.compile(plantilla)  // compilo con plantilla string

    //no necesario tener que rehacer consultas
    listaProductos = await apiLista.get() //lista tomada de nube

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

//registrar Service Worker
function registrarServiceWorker() {
    //verificar si nav es compatible con sv
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js")
            .then(reg => {
                console.log("El service worker se registro correctamente", reg)
            })
            .catch(err => {
                console.log("error al registrar el Service Worker!", err)
            })
    } else {
        console.log("No hay service worker en navigator")
    }


}



function start() {

    console.warn("Super Lista")
    registrarServiceWorker()
    renderLista()
    agregarListenersEleEstaticos()

}


//Ejecucion
start()