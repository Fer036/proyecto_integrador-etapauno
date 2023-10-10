import 'sweetalert'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './css/style.css'
import { calcularTotal, comprarProducto, eliminarCompra, eliminarProducto, leerLocalStorage, leerLocalStorageCompra, obtenerEvento, procesarPedido, vaciarCarrito } from './src/carrito'


const productos = document.getElementById('product')
//console.log(productos)
const carrito = document.getElementById('carrito')
//console.log(carrito)
const carritoCompra = document.getElementById('lista-compra')
//console.log(carritoCompra)
const btnSuccess = document.getElementById('success')


cargarEventos()

function cargarEventos () {
    const ruta = String(location.href)
    console.log(ruta)
    if (ruta.includes('contacto.html')) {
        console.log('Es la página de contactos')
    } 
    if (ruta.includes('carrito.html')) {
        esCarrito()
    } 
    if (!ruta.includes('carrito.html', 'contacto.html')) {
        esIndex()
    }
}

function esIndex() {
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito')
    const procesarCompraBtn = document.getElementById('procesar-pedido')
    console.log(vaciarCarritoBtn)
    console.log(procesarCompraBtn)

    console.log('No estoy en página carrito')

    productos.addEventListener('click', (e) => comprarProducto(e))

    document.addEventListener('DOMContentLoaded', leerLocalStorage())

    carrito.addEventListener('click', e => eliminarProducto(e))

    vaciarCarritoBtn.addEventListener('click', e => vaciarCarrito(e))
    procesarCompraBtn.addEventListener('click', e => procesarPedido(e))
}

function esCarrito() {
    console.log('Estoy en carrito')
    document.addEventListener('DOMContentLoaded', leerLocalStorageCompra())

    carritoCompra.addEventListener('click', e => eliminarCompra(e))

    calcularTotal()

    carritoCompra.addEventListener('change', e => obtenerEvento(e))
    carritoCompra.addEventListener('keyup', e => obtenerEvento(e))

    btnSuccess.addEventListener('click', function(e) {
        swal('¡Listo!', 'Tu compra está en proceso de pago', 'success')
    } )
}

