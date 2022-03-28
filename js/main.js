//Variables globales
  
let listaProductos = [
    {
        nombre: "Carne",
        cantidad: "2",
        precio: 112.34,
    },
    {
        nombre: "Pan",
        cantidad: "5",
        precio: 32.34,
    },
    {
        nombre: "Fideos",
        cantidad: "3",
        precio: 66.34,
    },
    {
        nombre: "Leche",
        cantidad: "3",
        precio: 26.34,
    },
]

/*window.localStorage.setItem("listaProd", JSON.stringify(listaProductos))  */
 

//Funciones globales
function reiniciarItem(indice){
     listaProductos[indice].cantidad = "" 
     listaProductos[precio].precio = ""
}

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

function borrarItem(item, indice){
    console.warn(item, indice)
    listaNueva = listaProductos.splice(indice,1) //devolver lista sin ese item
    console.warn(listaNueva) 
    renderLista() // re render
     
}


async function renderLista() {
    let plantilla = await fetch("plantillas/item.hbs").then(r => r.text()) //obtengo plantilla en forma text
    let template = Handlebars.compile(plantilla)  // compilo con plantilla string
    let htmlFinal = template({ producto : listaProductos}) // alimento con lista, output html concatenado con c obj ref
    document.getElementById("lista").innerHTML = htmlFinal  
    componentHandler.upgradeElements(document.getElementById("lista"))
}


function agregarListeners(){
    document.getElementById("btn-add-producto").addEventListener("click", e => {
        console.warn("nuevo prod ingresado")
        let valor =  document.getElementById("sample1").value 
        if (valor !== ""){
            let nuevoProducto = {nombre: valor, valor:"",cantidad:""}
            listaProductos.push(nuevoProducto)
            document.getElementById("sample1").value = ""
            renderLista()

        }else{
            console.log("error")
        }
       
    })

    document.getElementById("btn-remove-all").addEventListener("click", e => {
        console.warn("borrado total")
        listaProductos = []
        renderLista()
    })
}

//registrar Service Worker
function registrarServiceWorker(){
    //verificar si nav es compatible con sv
    if ("serviceWorker" in navigator){
        navigator.serviceWorker.register("/PRACTICA-PWA/sw.js")
        .then( reg => {
            console.log("El service worker se registro correctamente", reg)
        })
        .catch( err => {
            console.log("error al registrar el Service Worker!", err)
        })
    }else{
        console.log("No hay service worker en navigator")
    }
   

}


function start() {
    
    console.warn("Super Lista")
    registrarServiceWorker()
    renderLista()
    agregarListeners()
}

 
//Ejecucion
start()