function renderCartDrawer(carrito = [], abierto = false) {
    const container = document.getElementById("cart-drawer-container");
    if (!container) return;

    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    container.innerHTML = `
        <div class="${abierto ? 'fixed' : 'hidden'} inset-0 z-50 overflow-hidden">
            <div onclick="toggleCartDrawer(false)" class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
            <div class="fixed inset-y-0 right-0 w-[90vw] sm:w-full max-w-md flex">
                <div class="w-full h-full bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
                    
                    <div class="p-4 sm:p-5 bg-stone-100 flex items-center justify-between gap-3 border-b-2 border-orange-500 shrink-0">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <i class="fa-solid fa-cart-shopping text-orange-500 text-xl shrink-0"></i>
                            <h2 class="font-black text-base sm:text-lg text-black truncate">Tu Carrito de Xantolo (${carrito.reduce((a, b) => a + b.cantidad, 0)})</h2>
                        </div>
                        <button onclick="toggleCartDrawer(false)" aria-label="Cerrar carrito" class="w-9 h-9 rounded-lg bg-white border border-stone-300 text-stone-700 hover:text-orange-600 hover:border-orange-400 flex items-center justify-center text-lg shrink-0 transition">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="p-5 flex-1 overflow-y-auto divide-y divide-stone-200">
                        ${carrito.length === 0 ? `
                            <div class="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                                <div class="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 text-stone-400 flex items-center justify-center text-2xl">
                                    <i class="fa-solid fa-masks-theater"></i>
                                </div>
                                <p class="font-black text-black text-sm">Tu carrito está vacío</p>
                                <p class="text-xs text-stone-600 font-bold max-w-xs">Explora las máscaras y trajes para agregarlos aquí.</p>
                            </div>
                        ` : carrito.map(item => {
                            const prodLive = (estadoApp.productosGlobales || []).find(p => p.id === item.id);
                            const stockMax = prodLive ? (Number(prodLive.stock) || 0) : (Number(item.stock) || 0);
                            const enLimite = item.cantidad >= stockMax;

                            return `
                            <div class="py-4 flex gap-3.5 items-center">
                                <img src="${item.imagen}" alt="${item.alt || item.nombre}" title="${item.title || item.nombre}" class="w-16 h-16 rounded-lg object-cover border border-stone-300 shrink-0">
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-xs font-black text-black truncate">${item.nombre}</h4>
                                    <p class="text-sm font-black text-orange-600 mt-0.5">$${(item.precio * item.cantidad).toLocaleString('es-MX')} MXN</p>
                                    
                                    <div class="flex items-center gap-2 mt-2">
                                        <button onclick="cambiarCantidadCarrito(${item.id}, -1)" class="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-black font-black text-xs border border-stone-300">-</button>
                                        <span class="text-xs font-black px-1 text-black">${item.cantidad}</span>
                                        <button
                                            onclick="cambiarCantidadCarrito(${item.id}, 1)"
                                            ${enLimite ? 'disabled title="Stock máximo alcanzado"' : ''}
                                            class="w-6 h-6 rounded font-black text-xs border ${enLimite ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed' : 'bg-stone-100 hover:bg-stone-200 text-black border-stone-300'}">+</button>
                                        <span class="text-[10px] font-bold ${enLimite ? 'text-amber-600' : 'text-stone-400'}">
                                            ${enLimite ? `Máx. (${stockMax})` : `Disp: ${stockMax}`}
                                        </span>
                                        <button onclick="eliminarDelCarrito(${item.id})" class="ml-auto text-xs text-stone-500 hover:text-red-600 transition">
                                            <i class="fa-regular fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>

                    ${carrito.length > 0 ? `
                        <div class="p-5 bg-stone-50 border-t border-stone-200 space-y-4">
                            <div class="flex justify-between text-lg font-black text-black pt-1">
                                <span>Subtotal:</span>
                                <span class="text-orange-600">$${subtotal.toLocaleString('es-MX')} MXN</span>
                            </div>
                            <button onclick="toggleCartDrawer(false); navegarAVista('pago');" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg">
                                <span>Continuar al Pago</span>
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}