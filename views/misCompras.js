// views/misCompras.js - Historial de pedidos del cliente autenticado

async function renderVistaMisCompras() {
    const mainContainer = document.getElementById("main-view-container");
    if (!mainContainer) return;

    // Si no ha iniciado sesión, pedirle que entre a su cuenta
    if (!estadoApp.usuarioActual) {
        mainContainer.innerHTML = `
            <div class="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
                <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h2 class="text-2xl font-black text-black">Inicia sesión para ver tus compras</h2>
                <p class="text-sm font-bold text-stone-500">Aquí podrás consultar tus folios, comprobantes y productos adquiridos.</p>
                <button onclick="navegarAVista('login')" class="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-sm transition shadow-md">
                    Ir a Iniciar Sesión
                </button>
            </div>
        `;
        return;
    }

    // Pantalla de carga mientras consulta Supabase
    mainContainer.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-orange-500"></i>
            <p class="text-sm font-bold text-stone-600">Cargando tu historial de compras...</p>
        </div>
    `;

    const compras = await obtenerComprasUsuarioDB(estadoApp.usuarioActual.id);

    if (compras.length === 0) {
        mainContainer.innerHTML = `
            <div class="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                <div class="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center text-2xl mx-auto">
                    <i class="fa-solid fa-bag-shopping"></i>
                </div>
                <h2 class="text-2xl font-black text-black">Aún no tienes compras registradas</h2>
                <p class="text-sm font-bold text-stone-500">Cuando realices un pedido, aparecerá aquí con su folio y detalle.</p>
                <button onclick="navegarAVista('catalogo')" class="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-sm transition shadow-md">
                    Explorar Catálogo
                </button>
            </div>
        `;
        return;
    }

    mainContainer.innerHTML = `
        <section class="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <a href="#" onclick="navegarAVista('catalogo'); return false;" class="text-xs font-extrabold text-orange-600 hover:underline flex items-center gap-1">
                        <i class="fa-solid fa-arrow-left"></i> Volver al catálogo
                    </a>
                    <h1 class="text-2xl md:text-3xl font-black text-black mt-1">Mis Compras</h1>
                </div>
                <span class="text-xs font-extrabold bg-stone-200 text-stone-700 px-3 py-1.5 rounded-full self-start sm:self-auto">
                    ${compras.length} ${compras.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
                </span>
            </div>

            <div class="space-y-4">
                ${compras.map(venta => {
                    const fechaRaw = venta.fecha || venta.created_at;
                    const fechaTexto = fechaRaw
                        ? new Date(fechaRaw).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'Pedido registrado';

                    return `
                        <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                            <div class="bg-stone-50 px-5 py-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div class="flex flex-wrap items-center gap-4">
                                    <div>
                                        <span class="text-stone-400 font-bold block text-[10px] uppercase">Folio</span>
                                        <span class="font-black text-stone-900">#${venta.id}</span>
                                    </div>
                                    <div>
                                        <span class="text-stone-400 font-bold block text-[10px] uppercase">Fecha</span>
                                        <span class="font-bold text-stone-700">${fechaTexto}</span>
                                    </div>
                                    <div>
                                        <span class="text-stone-400 font-bold block text-[10px] uppercase">Método de pago</span>
                                        <span class="font-bold text-stone-700">${venta.metodo_pago || 'En línea'}</span>
                                    </div>
                                    ${venta.referencia_pago ? `
                                        <div>
                                            <span class="text-stone-400 font-bold block text-[10px] uppercase">Referencia</span>
                                            <span class="font-mono font-bold text-orange-600">${venta.referencia_pago}</span>
                                        </div>
                                    ` : ''}
                                </div>

                                <div class="flex items-center gap-3">
                                    <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                                        <i class="fa-solid fa-check mr-1"></i>${venta.estado || 'Pagado'}
                                    </span>
                                    <span class="text-base font-black text-black">$${Number(venta.total || 0).toLocaleString()} MXN</span>
                                </div>
                            </div>

                            <div class="p-5 divide-y divide-stone-100">
                                ${venta.items.length > 0 ? venta.items.map(item => `
                                    <div class="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                                        <div class="flex items-center gap-3">
                                            ${item.imagen
                                                ? `<img src="${item.imagen}" alt="${item.nombre}" class="w-14 h-14 rounded-xl object-cover border border-stone-200">`
                                                : `<div class="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400"><i class="fa-solid fa-mask"></i></div>`
                                            }
                                            <div>
                                                <p class="font-extrabold text-stone-900 text-sm">${item.nombre}</p>
                                                <p class="text-stone-500 font-bold">${item.categoria} • Cantidad: ${item.cantidad} x $${item.precio_venta.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span class="font-black text-stone-800 whitespace-nowrap">$${(item.precio_venta * item.cantidad).toLocaleString()} MXN</span>
                                    </div>
                                `).join('') : `<p class="text-xs font-bold text-stone-400">Sin detalle de productos registrado.</p>`}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}