// js/app.js - ARCHIVO COMPLETO
const estadoApp = {
    vistaActual: "catalogo", 
    carrito: [], 
    carritoAbierto: false,
    filtros: { categoria: "Todas", orden: "relevancia", busqueda: "" },
    productosGlobales: [], 
    cargando: true,
    usuarioActual: null // Guarda si el usuario inició sesión
};


const CATEGORIAS_CATALOGO = [
    "Máscaras de Madera",
    "Máscaras de Cartonería",
    "Vestuario de Viejos",
    "Sombreros y Chirriones",
    "Kits de Cuadrilla"
];

function generarSlug(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

function aplicarRutaDesdeHash() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (!hash) return;

    if (hash.startsWith("catalogo/")) {
        const slugCategoria = hash.replace("catalogo/", "");
        const encontrada = CATEGORIAS_CATALOGO.find(cat => generarSlug(cat) === slugCategoria);
        estadoApp.vistaActual = "catalogo";
        estadoApp.filtros.categoria = encontrada || "Todas";
    } else if (["catalogo", "pago", "login", "registro", "mis-compras"].includes(hash)) {
        estadoApp.vistaActual = hash;
    }
}

function actualizarTituloSEO() {
    const titulos = {
        "catalogo": estadoApp.filtros.categoria !== "Todas"
            ? `${estadoApp.filtros.categoria} | Tradición Xantolo`
            : "Tradición Xantolo | Máscaras de Madera y Vestuario Huasteco",
        "pago": "Finalizar Compra Segura | Tradición Xantolo",
        "mis-compras": "Mis Compras | Tradición Xantolo",
        "login": "Iniciar Sesión | Tradición Xantolo",
        "registro": "Crear Cuenta | Tradición Xantolo"
    };
    document.title = titulos[estadoApp.vistaActual] || "Tradición Xantolo";
}

document.addEventListener("DOMContentLoaded", async () => {
    aplicarRutaDesdeHash();
    actualizarInterfazCompleta(); 
    
    // Verificar si el usuario ya había iniciado sesión antes
    estadoApp.usuarioActual = await obtenerSesionActual();
    estadoApp.productosGlobales = await obtenerProductosDesdeDB();
    estadoApp.cargando = false;
    actualizarInterfazCompleta();
});

window.addEventListener("hashchange", () => {
    aplicarRutaDesdeHash();
    actualizarInterfazCompleta();
});

function actualizarInterfazCompleta() {
    const totalItems = estadoApp.carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    actualizarTituloSEO();
    renderHeader(totalItems, estadoApp.usuarioActual);
    renderFooter();

    if (estadoApp.vistaActual === "catalogo") {
        if (estadoApp.cargando) {
            renderVistaCargando();
        } else {
            const productosFiltrados = obtenerProductosFiltrados();
            renderVistaCatalogo(productosFiltrados, estadoApp.filtros);
        }
    } else if (estadoApp.vistaActual === "pago") {
        renderVistaPago(estadoApp.carrito);
    } else if (estadoApp.vistaActual === "login") {
        renderVistaLogin();
    } else if (estadoApp.vistaActual === "registro") {
        renderVistaRegistro();
    } else if (estadoApp.vistaActual === "mis-compras") {
        renderVistaMisCompras();
    }

    // Siempre activo en Catálogo, Mis Compras, Pago, Login y Registro
    inicializarBuscadorGlobal();
    renderCartDrawer(estadoApp.carrito, estadoApp.carritoAbierto);
}

// VISTA DE CARGA
function renderVistaCargando() {
    const mainContainer = document.getElementById("main-view-container");
    if (!mainContainer) return;
    
    mainContainer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
             <i class="fa-solid fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
             <h2 class="text-xl font-black text-black">Conectando con el taller artesanal...</h2>
             <p class="text-stone-500 mt-2">Cargando catálogo de productos desde la base de datos.</p>
        </div>
    `;
}

// PROTECCIÓN DE RUTAS Y NAVEGACIÓN
function navegarAVista(nombreVista, subSlug = "") {
    if ((nombreVista === "pago" || nombreVista === "mis-compras") && !estadoApp.usuarioActual) {
        alert("¡Hola! Necesitas iniciar sesión para acceder a esta sección.");
        estadoApp.vistaActual = "login";
        subSlug = "";
    } else {
        estadoApp.vistaActual = nombreVista;
    }

    const rutaFinal = subSlug ? `#/${estadoApp.vistaActual}/${subSlug}` : `#/${estadoApp.vistaActual}`;

    // ESCUDO: Evita que el navegador colapse si se abre con doble clic (file:///)
    try {
        window.history.pushState(null, '', rutaFinal);
    } catch (error) {
        console.warn("Ejecutando en archivo local, URLs amigables pausadas por seguridad.");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    actualizarInterfazCompleta();
}

// --- LOGICA DE FORMULARIOS DE AUTENTICACION ---
async function procesarRegistro(event) {
    event.preventDefault(); 
    const btn = document.getElementById("btn-submit-registro");
    const errorBox = document.getElementById("registro-error-msg");
    const nombre = document.getElementById("registro-nombre").value.trim();
    const email = document.getElementById("registro-email").value.trim();
    const password = document.getElementById("registro-password").value;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';
    errorBox.classList.add("hidden");

    const resultado = await registrarUsuarioDB(email, password, nombre);
    
    if (resultado.exito) {
        mostrarModalConfirmacionRegistro(email);
    } else {
        errorBox.textContent = "Error: " + resultado.mensaje;
        errorBox.classList.remove("hidden");
        btn.disabled = false;
        btn.innerHTML = 'Registrarme <i class="fa-solid fa-check"></i>';
    }
}

function mostrarModalConfirmacionRegistro(email) {
    const modalPrevio = document.getElementById("modal-confirmacion-registro");
    if (modalPrevio) modalPrevio.remove();

    const modal = document.createElement("div");
    modal.id = "modal-confirmacion-registro";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4";
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 border-orange-400 text-center space-y-5">
            <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                <i class="fa-solid fa-envelope-circle-check"></i>
            </div>
            <div class="space-y-2">
                <h3 class="text-xl font-black text-black">¡Revisa tu correo!</h3>
                <p class="text-xs font-bold text-stone-600 leading-relaxed">
                    Se ha enviado un correo de confirmación a tu bandeja de entrada:
                </p>
                <p id="modal-registro-email" class="text-sm font-black text-orange-600 bg-orange-50 py-2 px-3 rounded-lg border border-orange-200 break-all"></p>
                <p class="text-[11px] font-bold text-stone-500">
                    Abre el enlace que te enviamos (revisa también spam) y después inicia sesión con tu cuenta.
                </p>
            </div>
            <button id="btn-okey-registro" type="button" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm transition shadow-md">
                Okey
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    document.getElementById("modal-registro-email").textContent = email;

    document.getElementById("btn-okey-registro").addEventListener("click", () => {
        modal.remove();
        navegarAVista("login");
    });
}

async function procesarLogin(event) {
    event.preventDefault();
    const btn = document.getElementById("btn-submit-login");
    const errorBox = document.getElementById("login-error-msg");
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
    errorBox.classList.add("hidden");

    const resultado = await iniciarSesionDB(email, password);
    
    if (resultado.exito) {
        estadoApp.usuarioActual = { id: resultado.user.id, email: email, nombre: resultado.nombre };
        navegarAVista(estadoApp.carrito.length > 0 ? 'pago' : 'catalogo');
    } else {
        errorBox.textContent = resultado.mensaje;
        errorBox.classList.remove("hidden");
        btn.innerHTML = 'Ingresar a mi cuenta <i class="fa-solid fa-arrow-right"></i>';
    }
}

async function procesarCerrarSesion() {
    await cerrarSesionDB();
    estadoApp.usuarioActual = null;
    navegarAVista('catalogo');
}

// --- FILTROS, CARRITO Y BUSCADOR ---
function obtenerProductosFiltrados() {
    let lista = [...estadoApp.productosGlobales];
    if (estadoApp.filtros.categoria !== "Todas") {
        lista = lista.filter(p => p.categoria === estadoApp.filtros.categoria);
    }
    if (estadoApp.filtros.busqueda.trim() !== "") {
        const q = estadoApp.filtros.busqueda.toLowerCase();
        lista = lista.filter(p => 
            p.nombre.toLowerCase().includes(q) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
            p.categoria.toLowerCase().includes(q) ||
            (p.artesano && p.artesano.toLowerCase().includes(q))
        );
    }
    if (estadoApp.filtros.orden === "menor-precio") {
        lista.sort((a, b) => a.precio - b.precio);
    } else if (estadoApp.filtros.orden === "mayor-precio") {
        lista.sort((a, b) => b.precio - a.precio);
    }
    return lista;
}

function filtrarPorCategoria(categoria) {
    estadoApp.filtros.categoria = categoria;
    const slug = categoria === "Todas" ? "" : generarSlug(categoria);
    navegarAVista("catalogo", slug);
}

function cambiarOrdenProductos(orden) {
    estadoApp.filtros.orden = orden;
    actualizarInterfazCompleta();
}

function toggleCartDrawer(estado) {
    estadoApp.carritoAbierto = estado;
    renderCartDrawer(estadoApp.carrito, estadoApp.carritoAbierto);
}

function agregarAlCarrito(productoId) {
    const prod = estadoApp.productosGlobales.find(p => p.id === productoId);
    if (!prod) return;

    const stockDisponible = Number(prod.stock) || 0;
    if (stockDisponible <= 0) {
        alert("Lo sentimos, este producto se encuentra agotado.");
        return;
    }

    const existente = estadoApp.carrito.find(item => item.id === productoId);
    if (existente) {
        if (existente.cantidad >= stockDisponible) {
            alert(`Solo tenemos ${stockDisponible} ${stockDisponible === 1 ? 'pieza disponible' : 'piezas disponibles'} de "${prod.nombre}".`);
            estadoApp.carritoAbierto = true;
            actualizarInterfazCompleta();
            return;
        }
        existente.cantidad += 1;
    } else {
        estadoApp.carrito.push({ ...prod, cantidad: 1 });
    }

    estadoApp.carritoAbierto = true;
    actualizarInterfazCompleta();
}

function comprarAhora(productoId) {
    const prod = estadoApp.productosGlobales.find(p => p.id === productoId);
    if (!prod) return;

    const stockDisponible = Number(prod.stock) || 0;
    if (stockDisponible <= 0) {
        alert("Lo sentimos, este producto se encuentra agotado.");
        return;
    }

    const existente = estadoApp.carrito.find(item => item.id === productoId);
    if (!existente) {
        estadoApp.carrito.push({ ...prod, cantidad: 1 });
    } else if (existente.cantidad > stockDisponible) {
        existente.cantidad = stockDisponible;
    }

    estadoApp.carritoAbierto = false;
    navegarAVista("pago");
}

function cambiarCantidadCarrito(productoId, delta) {
    const item = estadoApp.carrito.find(i => i.id === productoId);
    if (!item) return;

    if (delta > 0) {
        const prodLive = estadoApp.productosGlobales.find(p => p.id === productoId);
        const stockDisponible = prodLive ? (Number(prodLive.stock) || 0) : (Number(item.stock) || 0);

        if (item.cantidad + delta > stockDisponible) {
            alert(`Solo hay ${stockDisponible} ${stockDisponible === 1 ? 'pieza disponible' : 'piezas disponibles'} en inventario.`);
            return;
        }
    }

    item.cantidad += delta;
    if (item.cantidad <= 0) {
        estadoApp.carrito = estadoApp.carrito.filter(i => i.id !== productoId);
    }
    actualizarInterfazCompleta();
}

function eliminarDelCarrito(productoId) {
    estadoApp.carrito = estadoApp.carrito.filter(i => i.id !== productoId);
    actualizarInterfazCompleta();
}

function inicializarBuscadorGlobal() {
    const searchInput = document.getElementById("global-search-input");
    const clearBtn = document.getElementById("clear-search-btn");
    const searchBtn = document.getElementById("search-btn-trigger");
    const dropdown = document.getElementById("search-results-dropdown");
    const targetElements = document.querySelectorAll(".search-target");

    if (!searchInput) return;

    searchInput.value = estadoApp.filtros.busqueda;
    if (searchInput.value.length > 0 && clearBtn) clearBtn.classList.remove("hidden");

    targetElements.forEach(el => {
        if (!el.dataset.originalContent) el.dataset.originalContent = el.textContent;
    });

    const ejecutarBusquedaYRedirigir = () => {
        estadoApp.filtros.busqueda = searchInput.value;
        estadoApp.filtros.categoria = "Todas";
        if (dropdown) dropdown.classList.add("hidden");
        navegarAVista("catalogo");
    };

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        estadoApp.filtros.busqueda = e.target.value;
        if (query.length > 0) {
            if (clearBtn) clearBtn.classList.remove("hidden");
            ejecutarResaltadoYDropdown(query, targetElements, dropdown);
        } else {
            limpiarResaltado(targetElements, dropdown, clearBtn);
        }
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            ejecutarBusquedaYRedirigir();
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            ejecutarBusquedaYRedirigir();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            estadoApp.filtros.busqueda = "";
            searchInput.value = "";
            limpiarResaltado(targetElements, dropdown, clearBtn);
            if (estadoApp.vistaActual === "catalogo") {
                actualizarInterfazCompleta();
            }
        });
    }
}

function ejecutarResaltadoYDropdown(query, elements, dropdown) {
    if (!dropdown) return;
    dropdown.innerHTML = "";
    let matchCount = 0;

    estadoApp.productosGlobales.forEach(prod => {
        if (prod.nombre.toLowerCase().includes(query) || prod.categoria.toLowerCase().includes(query)) {
            matchCount++;
            const item = document.createElement("div");
            item.className = "p-3 hover:bg-stone-100 cursor-pointer text-xs flex items-center justify-between transition";
            item.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <img src="${prod.imagen}" alt="${prod.alt || prod.nombre}" title="${prod.title || prod.nombre}" class="w-8 h-8 rounded object-cover border border-stone-200">
                    <div>
                        <p class="font-bold text-black">${prod.nombre}</p>
                        <p class="text-[11px] text-orange-600 font-bold">$${prod.precio} MXN • ${prod.categoria}</p>
                    </div>
                </div>
                <span class="text-[10px] bg-white text-stone-500 px-2 py-0.5 rounded font-bold border border-stone-200">Ver</span>
            `;
            item.addEventListener("click", () => {
                estadoApp.filtros.busqueda = prod.nombre;
                estadoApp.filtros.categoria = "Todas";
                navegarAVista("catalogo");
            });
            dropdown.appendChild(item);
        }
    });

    elements.forEach(el => {
        const text = el.dataset.originalContent;
        if (text && text.toLowerCase().includes(query)) {
            const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
            el.innerHTML = text.replace(regex, `<mark class="search-highlight">$1</mark>`);
        } else if (text) {
            el.innerHTML = text;
        }
    });

    if (matchCount > 0) dropdown.classList.remove("hidden");
    else {
        dropdown.innerHTML = '<div class="p-3 text-xs text-stone-500 text-center font-bold">Presiona Enter para buscar en la tienda</div>';
        dropdown.classList.remove("hidden");
    }
}

function limpiarResaltado(elements, dropdown, clearBtn) {
    clearBtn.classList.add("hidden");
    dropdown.classList.add("hidden");
    elements.forEach(el => {
        if (el.dataset.originalContent) el.innerHTML = el.dataset.originalContent;
    });
}

function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }