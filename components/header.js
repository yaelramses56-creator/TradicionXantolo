function renderHeader(cartCount = 0, usuarioActual = null) {
    const headerContainer = document.getElementById("header-container");
    if (!headerContainer) return;

    // Generar el HTML de autenticación dinámico
    const authHTML = usuarioActual 
        ? `
            <div class="flex items-center gap-3 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                <span class="text-xs font-extrabold text-stone-600">Hola, <span class="text-orange-600">${usuarioActual.nombre.split(' ')[0]}</span></span>
                <span class="text-stone-300">|</span>
                <button onclick="navegarAVista('mis-compras')" class="text-xs font-extrabold text-stone-700 hover:text-orange-600 transition flex items-center gap-1">
                    <i class="fa-solid fa-box-open"></i> Mis Compras
                </button>
                <span class="text-stone-300">|</span>
                <a href="#" onclick="procesarCerrarSesion(); return false;" class="text-stone-500 hover:text-red-500 text-xs font-bold transition">Salir</a>
            </div>
          `
        : `
            <nav class="flex items-center gap-3 text-xs font-extrabold">
                <a href="#" onclick="navegarAVista('registro'); return false;" class="text-black hover:text-orange-600 transition">Crea tu cuenta</a>
                <span class="text-stone-300">|</span>
                <a href="#" onclick="navegarAVista('login'); return false;" class="text-black hover:text-orange-600 transition">Ingresa</a>
            </nav>
          `;

    headerContainer.innerHTML = `
        <header class="bg-white text-stone-800 shadow-md border-b-[3px] border-orange-500">
            <div class="max-w-7xl mx-auto px-4 py-3 space-y-3">
                <div class="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                    
                    <a href="#" onclick="navegarAVista('catalogo'); return false;" class="flex items-center gap-3 shrink-0 group">
                        <div class="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white text-xl md:text-2xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition">
                            <i class="fa-solid fa-masks-theater"></i>
                        </div>
                        <div>
                            <span class="text-lg md:text-xl font-black tracking-tight text-orange-600 block leading-none">Tradicion Xantolo</span>
                            <span class="text-[9px] md:text-[10px] uppercase tracking-widest text-stone-600 font-extrabold">Mercado Huasteco Oficial</span>
                        </div>
                    </a>

                    <button onclick="toggleCartDrawer(true)" class="md:hidden relative text-stone-900 hover:text-orange-500 transition text-2xl">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span id="header-cart-badge-mobile" class="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-white">
                            ${cartCount}
                        </span>
                    </button>

                    <div class="relative w-full md:max-w-2xl order-last md:order-none">
                        <div class="relative flex items-center bg-white rounded-md shadow-inner overflow-hidden border border-stone-300 focus-within:border-orange-500 transition-colors">
                            <input type="text" id="global-search-input" placeholder="Buscar máscaras, sombreros..." class="w-full pl-4 pr-12 py-2.5 text-sm bg-white text-black font-bold placeholder-stone-500 focus:outline-none">
                            <button id="clear-search-btn" class="hidden absolute right-12 text-stone-500 hover:text-orange-500 px-2">
                                <i class="fa-solid fa-circle-xmark"></i>
                            </button>
                            <button id="search-btn-trigger" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 transition border-l border-stone-300">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                        <div id="search-results-dropdown" class="hidden absolute left-0 right-0 top-full mt-1 bg-white text-stone-900 font-bold border border-stone-300 rounded-lg shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-stone-100"></div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs border-t border-stone-200">
                    <nav class="flex flex-nowrap overflow-x-auto items-center gap-4 md:gap-5 text-black font-extrabold pb-1 md:pb-0 scrollbar-hide w-full sm:w-auto">
                        <a href="#" onclick="navegarAVista('catalogo'); filtrarPorCategoria('Todas'); return false;" class="hover:text-orange-600 whitespace-nowrap transition">Catálogo Completo</a>
                        <a href="#" onclick="navegarAVista('catalogo'); filtrarPorCategoria('Máscaras de Madera'); return false;" class="hover:text-orange-600 whitespace-nowrap transition">Máscaras de Madera</a>
                        <a href="#" onclick="navegarAVista('catalogo'); filtrarPorCategoria('Kits de Cuadrilla'); return false;" class="hover:text-orange-600 whitespace-nowrap transition">Kits de Cuadrilla</a>
                    </nav>

                    <div class="hidden md:flex items-center gap-6">
                        <!-- AQUI INYECTAMOS EL LOGIN / INFO DE USUARIO -->
                        ${authHTML}

                        <button onclick="toggleCartDrawer(true)" class="relative bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition shadow-sm">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span>Carrito</span>
                            <span id="header-cart-badge" class="bg-white text-orange-600 text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-inner">
                                ${cartCount}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    `;
}