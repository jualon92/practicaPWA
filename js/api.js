import productos from "../js/main.js"

const getURL = (...id) => {
    //  let idNuevo = (id ? id : "")  // si id existe
    //  return `https://61c0e6c233f24c0017823675.mockapi.io/mercado${idNuevo}`
    let idNuevo = id || ""  //short circuit 
    return "https://61c0e6c233f24c0017823675.mockapi.io/mercado/" + idNuevo
}

/*GET*/
const get = async () => {

    try { // fetch => obj response => response.json => json
        let prod = await fetch("https://61c0e6c233f24c0017823675.mockapi.io/mercado").then(r => r.json())
        return prod
    }
    catch(error) { // si no hay conexion
        console.error('Error GET', error)

        let prods = productos.leerListaProductos()
        console.log(prods)
        return prods
    }

}


/*POST*/
async function post(prod) { //agregar info a la nube 
    try { // fetch => obj response => response.json => json
        let prods = await $.ajax({ url: getURL(), method: "post", data: prod })
        return prods
    }
    catch (error) {
        console.error("Error put", error)
    }
}

/*PUT*/
async function put(id, prod) { //actualizar
    try { // fetch => obj response => response.json => json
        let prods = await $.ajax({ url: getURL(id), method: "put", data: prod })
        return prods
    }
    catch (error) {
        console.error("Error put", error)
    }

}

async function del(id) {
    try { // fetch => obj response => response.json => json
        let prod = await $.ajax({ url: getURL(id), method: "DELETE" })
        return prod
    }
    catch (error) {
        console.error("Error delete", error)
    }
}

async function deleteAll(lista) { /*for each no async*/
    const progress = document.querySelector("progress")
    progress.style.display = "block"
    let porcentaje = 0

    for (let i = 0; i < lista.length; i++) {
        //  console.log(lista[i].id)
        porcentaje = parseInt((i * 100) / lista.length)
        progress.value = porcentaje
        console.log(porcentaje)
        await del(lista[i].id)

    }
    tiempoEspera = 1600
    porcentaje = 100
    progress.value = porcentaje
    setTimeout( () => { //delay
        progress.style.display = "none"
    }, tiempoEspera)
    

}
export default  // {} para empaquetar como obj
    {
        get,
        post,
        put,
        del,
        deleteAll

    }  /*{} con arrow*/