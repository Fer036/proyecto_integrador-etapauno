const listaProductos = document.querySelector('#lista-carrito tbody')

const listaCompra = document.querySelector('#lista-compra')
// Añadir un producto al carrito
export function comprarProducto(e) {
    e.preventDefault() // detener el comportamiento por defecto (refrescar pantalla)
    //console.dir(e.target)

    // función para seleccionar el elemento al que le hago click
    if (e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.parentElement.parentElement
        console.log(producto)

        leerDatosProducto(producto)
    }
}

// Leer datos del producto
function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h5').textContent,
        precio: producto.querySelector('.precio').textContent,
        color: producto.querySelector('.color').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    console.log(infoProducto)

    let productosLS
    productosLS = obtenerProductosLocalStorage()

    productosLS.forEach(function(productoLS) {
        if(productoLS.id === infoProducto.id) {
            productosLS = productoLS.id;
        }
    })

    if (productosLS === infoProducto.id) {
        console.warn('El producto está en el local storage')
    } else {
        insertarCarrito(infoProducto)
    }
}

// Comprobar que hay elementos en el LS
function obtenerProductosLocalStorage(){
    let productosLS
    if (localStorage.getItem('productos') === null) {
        productosLS = []
    } else {
        productosLS = JSON.parse(localStorage.getItem('productos'))
    }
    return productosLS
}

// Insertar carrito
function insertarCarrito(producto) {
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>
            <img src="${producto.imagen}" alt="${producto.titulo}" width="100">
        </td>
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td>
            <a href="#" class="borrar-producto bi bi-x-lg" data-id="${producto.id}"></a>
        </td>
    `
    listaProductos.appendChild(row)
    guardarProductosLocalStorage(producto)
}

// Guardar productos en el LS
function guardarProductosLocalStorage(producto) {
    let productos
    productos = obtenerProductosLocalStorage()
    productos.push(producto)
    localStorage.setItem('productos', JSON.stringify(productos))
}

// Mostrar elementos guardados en LS
export function leerLocalStorage() {
    let productosLS
    productosLS = obtenerProductosLocalStorage()
    productosLS.forEach(function (producto) {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" alt="${producto.titulo}" width="100">
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto bi bi-x-lg" data-id="${producto.id}"></a>
            </td>
        `
        listaProductos.appendChild(row)
    })
}

// Eliminar producto del carrito y del LS
export function eliminarProducto(e) {
    e.preventDefault()
    let producto, productoID
    if (e.target.classList.contains('borrar-producto')) {
        //console.log(e.target.parentElement.parentElement.remove())
        producto = e.target.parentElement.parentElement
        productoID = producto.querySelector('a').getAttribute('data-id')
        producto.remove()
        eliminarProductoLocalStorage(productoID)
    }
}

function eliminarProductoLocalStorage(productoID){
    let productosLS
    productosLS = obtenerProductosLocalStorage()
    productosLS.forEach(function(productoLS, index) {
        if(productoLS.id === productoID){
            productosLS.splice(index, 1)
        }
    })
    localStorage.setItem('productos', JSON.stringify(productosLS))
}

// Vaciar carrito
export function vaciarCarrito(e) {
    e.preventDefault()
    while(listaProductos.firstChild) {
        listaProductos.removeChild(listaProductos.firstChild)
    }
    vaciarLocalStorage()

    return false
}

function vaciarLocalStorage() {
    window.localStorage.clear()
}

// Procesar compra
export function procesarPedido(e) {
    e.preventDefault()
    if (obtenerProductosLocalStorage().length === 0) {
        console.warn('El carrito está vacío')
    } else {
        location.href = 'pages/carrito.html'
    }
}

// Mostrar compra en página carrito
export function leerLocalStorageCompra() {
    let productosLS
    productosLS = obtenerProductosLocalStorage()
    productosLS.forEach(function(producto) {
        const div = document.createElement('div')
        div.classList.add('row', 'shadow-sm', 'm-2', 'card-carrito')
        div.innerHTML = `
            <div class="col-3 mb-1">
                <div class="bg-image rounded m-2">
                    <img src=${producto.imagen} alt="${producto.titulo}" class="w-100 rounded m-1">
                </div>
            </div>
            <div class="col-5">
                <p class="mt-2"><strong>${producto.titulo}</strong></p>
                <p class="m-1">${producto.color}</p>
                <p class="m-1">$${producto.precio} c/u</p>
                <button data-id=${producto.id} type="button" class="btn bi bi-trash3 btn-primary btn-sm me-1 my-2 borrar-producto-compra"></button>
            </div>
            <div class="col-2 mb-1">
                <div class="mt-2">
                    <input type="number" min="1" class="form-control text-center cantidad" placeholder="Cantidad" value="${producto.cantidad}">
                    <p class="text-center mt-4">
                        <strong>$</strong><strong class="precio">${producto.precio * producto.cantidad}</strong>
                    </p>
                </div>
            </div>
        `
        listaCompra.appendChild(div)
    })
}

// Eliminar elementos de la página carrito
export const eliminarCompra = (e) => {
    //console.log('Hicieron click', e.target.parentElement)
    e.preventDefault()
    let productoID
    if (e.target.classList.contains('borrar-producto-compra')) {
        e.target.parentElement.parentElement.remove()
        let producto = e.target.parentElement.parentElement
        productoID = producto.querySelector('button').getAttribute('data-id')
    }
    eliminarProductoLocalStorage(productoID)
}

// Sumar segun cantidades
export const obtenerEvento = (e) => {
    //console.log(e.target)
    e.preventDefault()
    let id, cantidad, producto, productosLS
    if(e.target.classList.contains('cantidad')) {
        //console.log('Cambio el input')
        producto = e.target.parentElement.parentElement.parentElement
        //console.log(producto)
        id = producto.querySelector('button').getAttribute('data-id')
        cantidad = producto.querySelector('input').value
        //console.log(id)
        //console.log(cantidad)
        let precio = producto.querySelector('.precio')
        productosLS = obtenerProductosLocalStorage()
        productosLS.forEach(function (productosLs, index) {
            if(productosLs.id === id) {
                productosLs.cantidad = cantidad
                let total = Number(productosLs.cantidad)*Number(productosLs.precio)
                precio.textContent = total.toFixed(2)
            }
        })
        localStorage.setItem('productos', JSON.stringify(productosLS))
        calcularTotal()
    }
}

// Calcular total en pagina carrito
export function calcularTotal() {
    let productosLS
    let total = 0, subtotal = 0, impuestos = 0
    productosLS = obtenerProductosLocalStorage()

    productosLS.forEach(productoLs => {
        let totalProducto = Number(productoLs.cantidad * productoLs.precio)
        total = total + totalProducto
    })

    //console.log(total)
    impuestos = parseFloat(total * 0.18).toFixed(2)
    subtotal = parseFloat(total-impuestos).toFixed(2)

    document.querySelector('.total-resumen').textContent = total.toFixed(2)
    document.querySelector('.subtotal').textContent = subtotal
    document.querySelector('.iva').textContent = impuestos
}
