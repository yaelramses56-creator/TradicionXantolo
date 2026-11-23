// views/pago.js - Checkout con PayPal Sandbox, Mercado Pago Oficial y Control de Inventario

function renderVistaPago(carrito) {
    const mainContainer = document.getElementById("main-view-container");
    if (!mainContainer) return;

    if (!carrito || carrito.length === 0) {
        mainContainer.innerHTML = `
            <div class="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
                <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                    <i class="fa-solid fa-basket-shopping"></i>
                </div>
                <h2 class="text-2xl font-black text-black">Tu carrito está vacío</h2>
                <p class="text-sm font-bold text-stone-500">Agrega máscaras o vestuario tradicional antes de proceder al pago.</p>
                <button onclick="navegarAVista('catalogo')" class="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-sm transition shadow-md">
                    Volver al Catálogo
                </button>
            </div>
        `;
        return;
    }

    const totalPagar = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const nombreUsuario = estadoApp.usuarioActual ? estadoApp.usuarioActual.nombre : "";
    const emailUsuario = estadoApp.usuarioActual ? estadoApp.usuarioActual.email : "";

    mainContainer.innerHTML = `
        <section class="max-w-6xl mx-auto px-4 py-8">
            <div class="mb-6">
                <a href="#" onclick="navegarAVista('catalogo'); return false;" class="text-xs font-extrabold text-orange-600 hover:underline flex items-center gap-1">
                    <i class="fa-solid fa-arrow-left"></i> Volver al catálogo
                </a>
                <h1 class="text-2xl md:text-3xl font-black text-black mt-2">Finalizar Compra</h1>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- COLUMNA IZQUIERDA -->
                <div class="lg:col-span-7 space-y-6">
                    
                    <!-- Paso 1: Dirección -->
                    <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                        <div class="flex items-center gap-2 border-b border-stone-200 pb-3">
                            <span class="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">1</span>
                            <h2 class="text-base font-black text-black">Datos de Entrega en la Huasteca / México</h2>
                        </div>

                        <form id="form-datos-envio" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div class="sm:col-span-2">
                                <label class="font-extrabold text-stone-700 block mb-1">Nombre de quien recibe *</label>
                                <input type="text" id="envio-nombre" value="${nombreUsuario}" required class="w-full border border-stone-300 rounded-lg px-3 py-2.5 font-bold bg-stone-50">
                            </div>
                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Correo Electrónico *</label>
                                <input type="email" id="envio-email" value="${emailUsuario}" readonly class="w-full border border-stone-200 rounded-lg px-3 py-2.5 font-bold bg-stone-100 text-stone-500">
                            </div>
                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Teléfono de Contacto *</label>
                                <input type="tel" id="envio-telefono" required placeholder="Ej. 771 123 4567" class="w-full border border-stone-300 rounded-lg px-3 py-2.5 font-bold focus:outline-none focus:border-orange-500">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="font-extrabold text-stone-700 block mb-1">Calle, Número y Colonia *</label>
                                <input type="text" id="envio-direccion" required placeholder="Ej. Av. Revolución #45, Col. Centro" class="w-full border border-stone-300 rounded-lg px-3 py-2.5 font-bold focus:outline-none focus:border-orange-500">
                            </div>
                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Municipio / Ciudad *</label>
                                <input type="text" id="envio-ciudad" required value="Huejutla de Reyes, Hgo." class="w-full border border-stone-300 rounded-lg px-3 py-2.5 font-bold focus:outline-none focus:border-orange-500">
                            </div>
                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Código Postal *</label>
                                <input type="text" id="envio-cp" required value="43000" class="w-full border border-stone-300 rounded-lg px-3 py-2.5 font-bold focus:outline-none focus:border-orange-500">
                            </div>
                        </form>
                    </div>

                    <!-- Paso 2: Pasarelas -->
                    <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
                        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">2</span>
                                <h2 class="text-base font-black text-black">Método de Pago (Modo Sandbox / Pruebas)</h2>
                            </div>
                            <span class="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                                <i class="fa-solid fa-flask mr-1"></i> Entorno de Pruebas
                            </span>
                        </div>

                        <!-- Pestañas -->
                        <div class="grid grid-cols-2 gap-3">
                            <button type="button" id="tab-paypal" onclick="cambiarTabPago('paypal')" class="p-3 rounded-xl border-2 border-orange-500 bg-orange-50/50 text-left transition flex items-center gap-3">
                                <i class="fa-brands fa-paypal text-2xl text-blue-700"></i>
                                <div>
                                    <p class="text-xs font-black text-stone-900">PayPal Sandbox</p>
                                    <p class="text-[10px] font-bold text-stone-500">Cuenta PayPal o Tarjeta</p>
                                </div>
                            </button>

                            <button type="button" id="tab-mercadopago" onclick="cambiarTabPago('mercadopago')" class="p-3 rounded-xl border-2 border-stone-200 hover:border-stone-300 text-left transition flex items-center gap-3">
                                <i class="fa-solid fa-handshake-angle text-2xl text-sky-500"></i>
                                <div>
                                    <p class="text-xs font-black text-stone-900">Mercado Pago</p>
                                    <p class="text-[10px] font-bold text-stone-500">Checkout Oficial</p>
                                </div>
                            </button>
                        </div>

                        <!-- CONTENEDOR 1: PAYPAL -->
                        <div id="contenedor-pago-paypal" class="space-y-3 pt-2">
                            <p class="text-xs font-bold text-stone-600 bg-stone-100 p-3 rounded-lg">
                                <i class="fa-solid fa-circle-info text-blue-600 mr-1"></i>
                                Haz clic en el botón de <strong>PayPal</strong>. Asegúrate de llenar tu teléfono y dirección arriba.
                            </p>
                            <div id="paypal-button-container" class="min-h-[120px] flex items-center justify-center"></div>
                        </div>

                        <!-- CONTENEDOR 2: MERCADO PAGO OFICIAL -->
                        <div id="contenedor-pago-mercadopago" class="hidden space-y-4 pt-2">
                            <div class="bg-sky-50 border border-sky-200 p-4 rounded-xl text-xs space-y-2">
                                <p class="font-black text-sky-900 text-sm"><i class="fa-solid fa-shield-halved mr-1"></i> Checkout Pro de Mercado Pago</p>
                                <p class="font-bold text-sky-700">Serás redirigido a la plataforma oficial y segura de Mercado Pago para iniciar sesión en tu cuenta o ingresar los datos de tu tarjeta.</p>
                            </div>
                            <button type="button" id="btn-pagar-mp" onclick="simularPagoMercadoPago(${totalPagar})" class="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                                <i class="fa-solid fa-up-right-from-square"></i> Ir a Pagar $${totalPagar.toLocaleString()} MXN
                            </button>
                        </div>

                    </div>
                </div>

                <!-- COLUMNA DERECHA: RESUMEN -->
                <div class="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 sticky top-6">
                    <h3 class="text-base font-black text-black border-b border-stone-200 pb-3">Resumen de tu Pedido</h3>
                    
                    <div class="divide-y divide-stone-200 max-h-80 overflow-y-auto pr-1">
                        ${carrito.map(item => `
                            <div class="py-3 flex items-center justify-between gap-3 text-xs">
                                <div class="flex items-center gap-3">
                                    <img src="${item.imagen}" alt="${item.alt || item.nombre}" class="w-12 h-12 rounded-lg object-cover border border-stone-200">
                                    <div>
                                        <p class="font-extrabold text-stone-900 line-clamp-1">${item.nombre}</p>
                                        <p class="text-stone-500 font-bold">Cantidad: ${item.cantidad} x $${item.precio.toLocaleString()}</p>
                                    </div>
                                </div>
                                <span class="font-black text-stone-900">$${(item.precio * item.cantidad).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="border-t border-stone-200 pt-4 space-y-2 text-xs">
                        <div class="flex justify-between font-bold text-stone-600">
                            <span>Subtotal (${carrito.reduce((a, b) => a + b.cantidad, 0)} productos)</span>
                            <span>$${totalPagar.toLocaleString()} MXN</span>
                        </div>
                        <div class="flex justify-between font-bold text-emerald-600">
                            <span>Envío Regional Huasteca</span>
                            <span>GRATIS</span>
                        </div>
                        <div class="flex justify-between text-base font-black text-black pt-2 border-t border-stone-200">
                            <span>Total a Pagar</span>
                            <span class="text-orange-600">$${totalPagar.toLocaleString()} MXN</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    `;

    setTimeout(() => {
        inicializarBotonesPayPal(totalPagar);
    }, 150);
}

function cambiarTabPago(metodo) {
    const tabPaypal = document.getElementById("tab-paypal");
    const tabMp = document.getElementById("tab-mercadopago");
    const contPaypal = document.getElementById("contenedor-pago-paypal");
    const contMp = document.getElementById("contenedor-pago-mercadopago");

    if (metodo === 'paypal') {
        tabPaypal.className = "p-3 rounded-xl border-2 border-orange-500 bg-orange-50/50 text-left transition flex items-center gap-3";
        tabMp.className = "p-3 rounded-xl border-2 border-stone-200 hover:border-stone-300 text-left transition flex items-center gap-3";
        contPaypal.classList.remove("hidden");
        contMp.classList.add("hidden");
    } else {
        tabMp.className = "p-3 rounded-xl border-2 border-sky-500 bg-sky-50/50 text-left transition flex items-center gap-3";
        tabPaypal.className = "p-3 rounded-xl border-2 border-stone-200 hover:border-stone-300 text-left transition flex items-center gap-3";
        contMp.classList.remove("hidden");
        contPaypal.classList.add("hidden");
    }
}

function obtenerYValidarDatosEnvio() {
    const telefono = document.getElementById("envio-telefono")?.value.trim();
    const direccion = document.getElementById("envio-direccion")?.value.trim();
    const ciudad = document.getElementById("envio-ciudad")?.value.trim();
    const cp = document.getElementById("envio-cp")?.value.trim();

    if (!telefono || !direccion || !ciudad || !cp) {
        alert("Por favor completa tu teléfono y dirección de entrega en el Paso 1 antes de realizar el pago.");
        document.getElementById("envio-telefono")?.focus();
        return null;
    }

    return { telefono, direccion, ciudad, cp };
}

function inicializarBotonesPayPal(totalPagar) {
    const container = document.getElementById("paypal-button-container");
    if (!container) return;

    if (typeof paypal === "undefined") {
        container.innerHTML = `<p class="text-xs font-bold text-red-600">No se pudo cargar el SDK de PayPal.</p>`;
        return;
    }

    container.innerHTML = "";

    paypal.Buttons({
        onClick: function(data, actions) {
            const datosEnvio = obtenerYValidarDatosEnvio();
            if (!datosEnvio) return actions.reject();
            return actions.resolve();
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: "Compra en Tradicion Xantolo",
                    amount: { currency_code: "MXN", value: totalPagar.toFixed(2) }
                }]
            });
        },
        onApprove: async function(data, actions) {
            const detallesPayPal = await actions.order.capture();
            const datosEnvio = obtenerYValidarDatosEnvio();
            await finalizarOrdenEnBaseDeDatos(datosEnvio, totalPagar, "PayPal Sandbox", detallesPayPal.id);
        },
        onError: function(err) {
            console.error("Error en PayPal:", err);
            alert("Ocurrió un error con la ventana de PayPal.");
        }
    }).render('#paypal-button-container');
}

// CONEXIÓN REAL A MERCADO PAGO CON VERIFICACIÓN DE PAGO APROBADO

async function simularPagoMercadoPago(totalPagar) {
    const datosEnvio = obtenerYValidarDatosEnvio();
    if (!datosEnvio) return;

    const btn = document.getElementById("btn-pagar-mp");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando con Mercado Pago...';

    // PEGA AQUÍ TU ACCESS TOKEN DE PRUEBA
    const ACCESS_TOKEN_MP = "APP_USR-8375438074552696-111716-8d37e82303ce429e88773d042554d46e-3856148936";
    const referenciaExterna = `TX-${Date.now()}`;

    try {
        const itemsParaMP = estadoApp.carrito.map(item => ({
            title: item.nombre.substring(0, 250),
            quantity: Number(item.cantidad),
            currency_id: "MXN",
            unit_price: Number(item.precio)
        }));

        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN_MP}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: itemsParaMP,
                external_reference: referenciaExterna
            })
        });

        if (!response.ok) {
            throw new Error("Mercado Pago rechazó la petición");
        }

        const preferencia = await response.json();

        if (preferencia.init_point) {
            // Abre una ventana flotante centrada (NO una pestaña) y NO guarda nada todavía
            const ancho = 520;
            const alto = 720;
            const izquierda = (window.screen.width / 2) - (ancho / 2);
            const arriba = (window.screen.height / 2) - (alto / 2);

            const ventanaMP = window.open(
                preferencia.init_point,
                "MercadoPagoCheckout",
                `width=${ancho},height=${alto},top=${arriba},left=${izquierda},resizable=yes,scrollbars=yes`
            );

            // Cambiamos el botón a amarillo para confirmar que está en modo espera
            btn.className = "w-full bg-amber-500 text-white font-black py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2";
            btn.innerHTML = '<i class="fa-solid fa-clock fa-spin"></i> Esperando que completes el pago en la ventana...';

            // Pregunta cada 3 segundos a Mercado Pago si ya se pagó
            const intervaloVerificacion = setInterval(async () => {
                try {
                    const resPago = await fetch(`https://api.mercadopago.com/v1/payments/search?external_reference=${referenciaExterna}`, {
                        headers: {
                            "Authorization": `Bearer ${ACCESS_TOKEN_MP}`
                        }
                    });

                    if (resPago.ok) {
                        const dataPago = await resPago.json();
                        const pagoAprobado = dataPago.results?.find(p => p.status === "approved");

                        // SOLO SI EL PAGO FUE APROBADO se registra en Supabase
                        if (pagoAprobado) {
                            clearInterval(intervaloVerificacion);
                            if (ventanaMP && !ventanaMP.closed) ventanaMP.close();

                            await finalizarOrdenEnBaseDeDatos(
                                datosEnvio,
                                totalPagar,
                                "Mercado Pago Oficial",
                                String(pagoAprobado.id)
                            );
                            return;
                        }
                    }

                    // Si cierras la ventana flotante sin pagar, se cancela y regresa el botón azul
                    if (ventanaMP && ventanaMP.closed) {
                        clearInterval(intervaloVerificacion);
                        btn.disabled = false;
                        btn.className = "w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2";
                        btn.innerHTML = `<i class="fa-solid fa-up-right-from-square"></i> Ir a Pagar $${totalPagar.toLocaleString()} MXN`;
                    }
                } catch (errConsulta) {
                    console.error("Verificando pago...", errConsulta);
                }
            }, 3000);
        }

    } catch (error) {
        console.error("Error con Mercado Pago:", error);
        alert("Hubo un problema al conectar con Mercado Pago.");
        btn.disabled = false;
        btn.className = "w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2";
        btn.innerHTML = `<i class="fa-solid fa-up-right-from-square"></i> Ir a Pagar $${totalPagar.toLocaleString()} MXN`;
    }
}

async function finalizarOrdenEnBaseDeDatos(datosEnvio, totalPagar, metodoPago, referenciaPago) {
    // Respaldamos carrito y datos del cliente antes de limpiar la vista
    const productosComprados = [...estadoApp.carrito];
    const correoCliente = estadoApp.usuarioActual?.email || document.getElementById("envio-email")?.value || "";
    const nombreCliente = estadoApp.usuarioActual?.nombre || document.getElementById("envio-nombre")?.value || "Cliente";

    const resultado = await procesarVenta(datosEnvio, productosComprados, totalPagar, metodoPago, referenciaPago);

    if (!resultado.exito) {
        alert("Error al guardar en base de datos: " + resultado.mensaje);
        return;
    }

    // Disparamos el envío del correo de confirmación
    enviarCorreoConfirmacion(
        correoCliente,
        nombreCliente,
        datosEnvio,
        productosComprados,
        totalPagar,
        metodoPago,
        resultado.folio,
        resultado.referencia
    );

    estadoApp.carrito = [];
    renderHeader(0, estadoApp.usuarioActual);

    const mainContainer = document.getElementById("main-view-container");
    mainContainer.innerHTML = `
        <section class="max-w-xl mx-auto px-4 py-12">
            <div class="bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-xl text-center space-y-5">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                    <i class="fa-solid fa-check-double"></i>
                </div>
                <div>
                    <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">Pago Aprobado • Inventario Actualizado</span>
                    <h2 class="text-2xl font-black text-black mt-2">¡Gracias por tu compra!</h2>
                    <p class="text-xs font-bold text-stone-500 mt-1">
                        Enviamos tu comprobante a <span class="text-stone-800">${correoCliente}</span>.
                    </p>
                </div>
                <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2">
                    <div class="flex justify-between"><span class="text-stone-500 font-bold">Folio de Venta (BD):</span><span class="font-black text-stone-900">#${resultado.folio}</span></div>
                    <div class="flex justify-between"><span class="text-stone-500 font-bold">Método de Pago:</span><span class="font-black text-stone-900">${metodoPago}</span></div>
                    <div class="flex justify-between"><span class="text-stone-500 font-bold">Referencia:</span><span class="font-mono font-bold text-orange-600">${resultado.referencia}</span></div>
                    <div class="flex justify-between"><span class="text-stone-500 font-bold">Enviar a:</span><span class="font-bold text-stone-800">${datosEnvio.direccion}, ${datosEnvio.ciudad}</span></div>
                    <div class="border-t border-stone-200 pt-2 flex justify-between text-sm"><span class="font-black text-stone-900">Total Pagado:</span><span class="font-black text-emerald-600">$${totalPagar.toLocaleString()} MXN</span></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onclick="navegarAVista('mis-compras')" class="w-full bg-stone-900 hover:bg-black text-white font-black py-3.5 rounded-xl text-sm transition shadow-md">
                        Ver Mis Compras
                    </button>
                    <button onclick="navegarAVista('catalogo')" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-sm transition shadow-md">
                        Volver a la Tienda
                    </button>
                </div>
            </div>
        </section>
    `;
}

async function enviarCorreoConfirmacion(correoCliente, nombreCliente, datosEnvio, productosComprados, totalPagar, metodoPago, folio, referencia) {
    try {
        if (typeof emailjs === "undefined" || !correoCliente) return;

        const listaTexto = productosComprados
            .map(item => `• ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString()} MXN`)
            .join("\n");

        await emailjs.send("service_ybhi6zy", "template_1y5cwfl", {
            to_email: correoCliente,
            cliente_nombre: nombreCliente,
            folio: folio,
            metodo_pago: metodoPago,
            referencia: referencia,
            direccion: `${datosEnvio.direccion}, ${datosEnvio.ciudad}, C.P. ${datosEnvio.cp}`,
            productos_lista: listaTexto,
            total: totalPagar.toLocaleString()
        });

        console.log("Correo de confirmación enviado a:", correoCliente);
    } catch (error) {
        console.error("Error al enviar el correo con EmailJS:", error);
    }
}
