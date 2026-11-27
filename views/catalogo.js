function renderVistaCatalogo(productosFiltrados, estadoFiltros) {
    const mainContainer = document.getElementById("main-view-container");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <section class="bg-orange-600 bg-papel-picado text-white border-b-2 border-orange-700 shadow-inner">
            <div class="max-w-7xl mx-auto px-4 py-10 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                <div class="space-y-3 max-w-2xl text-center lg:text-left">
                    <h1 class="text-3xl md:text-5xl font-black leading-tight search-target drop-shadow-md text-white">
                        Máscaras y Vestuario Tradicional de Viejos
                    </h1>
                    <p class="text-white text-sm md:text-base search-target drop-shadow-sm font-bold">
                        Equipa tu cuadrilla con máscaras talladas en madera de pemuche y cedro, chirriones de cuero y sombreros de palma real.
                    </p>
                </div>
                <div class="hidden lg:block bg-white/20 backdrop-blur-md border border-white/50 p-5 rounded-2xl text-center shrink-0 shadow-lg">
                    <span class="text-xs uppercase tracking-widest text-white font-extrabold block drop-shadow">Trato Directo</span>
                    <span class="text-3xl font-black text-white block my-1 drop-shadow-md">Artesanos</span>
                    <span class="text-xs text-white block drop-shadow font-bold">100% de la Huasteca Hidalguense</span>
                </div>
            </div>
        </section>

<section class="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
            <div class="bg-white rounded-xl shadow-md border border-orange-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
                <div class="flex flex-col sm:flex-row items-center sm:justify-center text-center sm:text-left gap-3 px-2 pt-1 sm:pt-0">
                    <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg shrink-0">
                        <i class="fa-solid fa-truck-fast"></i>
                    </div>
                    <div>
                        <p class="text-xs font-black text-black search-target">Envíos Seguros</p>
                        <p class="text-[10px] text-stone-600 font-bold hidden sm:block">A toda la región Huasteca</p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row items-center sm:justify-center text-center sm:text-left gap-3 px-2 pt-3 sm:pt-0 sm:pl-4">
                    <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg shrink-0">
                        <i class="fa-solid fa-hand-holding-heart"></i>
                    </div>
                    <div>
                        <p class="text-xs font-black text-black search-target">Directo del Artesano</p>
                        <p class="text-[10px] text-stone-600 font-bold hidden sm:block">Madera de cedro real</p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row items-center sm:justify-center text-center sm:text-left gap-3 px-2 pt-3 sm:pt-0 sm:pl-4">
                    <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg shrink-0">
                        <i class="fa-solid fa-shield-cat"></i>
                    </div>
                    <div>
                        <p class="text-xs font-black text-black search-target">Compra Protegida</p>
                        <p class="text-[10px] text-stone-600 font-bold hidden sm:block">Garantía de satisfacción</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
            ${renderSidebar(estadoFiltros.categoria, estadoFiltros.orden)}

            <div class="flex-1 space-y-4 min-w-0">
                <div class="bg-white px-4 md:px-5 py-3.5 rounded-xl border border-orange-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <h2 class="text-sm md:text-base font-black text-black">
                        Categoría: <span class="text-orange-600">${estadoFiltros.categoria}</span>
                        <span class="text-xs font-bold text-stone-500 ml-1">(${productosFiltrados.length} resultados)</span>
                    </h2>
                </div>

                ${productosFiltrados.length === 0 ? `
                    <div class="bg-white rounded-2xl p-12 text-center border border-orange-300 shadow-sm space-y-3">
                        <i class="fa-solid fa-masks-theater text-4xl text-orange-300"></i>
                        <h3 class="text-lg font-black text-black">No encontramos productos con ese filtro</h3>
                        <button onclick="filtrarPorCategoria('Todas')" class="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-sm">
                            Ver catálogo completo
                        </button>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                        ${productosFiltrados.map(prod => {
                            const stockDisponible = Number(prod.stock) || 0;
                            const agotado = stockDisponible <= 0;

                            return `
                            <article class="ml-product-card bg-white rounded-xl overflow-hidden border-2 ${agotado ? 'border-stone-300 opacity-90' : 'border-orange-300 hover:border-orange-500'} flex flex-col justify-between group">
                                <div>
                                    <div class="relative h-48 md:h-56 bg-stone-50 overflow-hidden border-b ${agotado ? 'border-stone-200' : 'border-orange-200'}">
                                        <img src="${prod.imagen}" alt="${prod.alt}" title="${prod.title}" class="w-full h-full object-cover ${agotado ? 'grayscale opacity-60' : 'group-hover:scale-105'} transition duration-500">
                                        
                                        <span class="absolute top-3 left-3 bg-white ${agotado ? 'text-stone-500 border-stone-300' : 'text-orange-600 border-orange-300'} text-[10px] font-black px-2.5 py-1 rounded-md border shadow-sm">
                                            ${prod.categoria}
                                        </span>

                                        ${agotado ? `
                                            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span class="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg border-2 border-white">
                                                    <i class="fa-solid fa-circle-exclamation mr-1"></i> Agotado
                                                </span>
                                            </div>
                                        ` : ''}
                                    </div>

                                    <div class="p-4 space-y-1.5">
                                        <p class="text-[10px] text-stone-500 font-extrabold uppercase tracking-wider search-target">${prod.artesano}</p>
                                        <h3 class="text-sm font-black ${agotado ? 'text-stone-500' : 'text-black'} line-clamp-2 leading-snug search-target">${prod.nombre}</h3>

                                        <div class="pt-2">
                                            <span class="text-[11px] text-stone-400 line-through block font-bold">$${prod.precioAnterior.toLocaleString('es-MX')}</span>
                                            <div class="flex items-baseline gap-2">
                                                <span class="text-2xl font-black ${agotado ? 'text-stone-400' : 'text-black'}">$${prod.precio.toLocaleString('es-MX')}</span>
                                                ${!agotado ? `<span class="text-[11px] font-black text-orange-600">${prod.descuento}</span>` : ''}
                                            </div>

                                            ${agotado ? `
                                                <p class="text-[11px] font-black text-red-600 mt-1 flex items-center gap-1">
                                                    <i class="fa-solid fa-box-open"></i> Sin existencias por el momento
                                                </p>
                                            ` : stockDisponible <= 3 ? `
                                                <p class="text-[11px] font-extrabold text-amber-600 mt-1">
                                                    ¡Solo ${stockDisponible === 1 ? 'queda 1 pieza' : `quedan ${stockDisponible} piezas`}!
                                                </p>
                                            ` : `
                                                <p class="text-[11px] font-bold text-emerald-700 mt-1">
                                                    ${stockDisponible} piezas disponibles
                                                </p>
                                            `}
                                        </div>
                                    </div>
                                </div>

                                <div class="p-4 pt-2 space-y-2">
                                    ${agotado ? `
                                        <button type="button" disabled class="w-full bg-stone-200 text-stone-500 font-black py-2.5 rounded-lg text-xs cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-300">
                                            <i class="fa-solid fa-ban"></i> No disponible
                                        </button>
                                    ` : `
                                        <button onclick="comprarAhora(${prod.id})" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm">
                                            Comprar ahora
                                        </button>
                                        <button onclick="agregarAlCarrito(${prod.id})" class="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 border border-orange-300">
                                            <i class="fa-solid fa-cart-plus"></i> Agregar
                                        </button>
                                    `}
                                </div>
                            </article>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        </section>
<section class="max-w-7xl mx-auto px-4 pb-12">
            <div class="bg-stone-900 text-white rounded-2xl overflow-hidden border-2 border-orange-500 shadow-xl grid grid-cols-1 lg:grid-cols-12">
                <div class="lg:col-span-7 bg-black relative flex items-center justify-center">
                    <video
                        controls
                        preload="metadata"
                        poster="https://itefhoxpwpreztunzeac.supabase.co/storage/v1/object/public/imagenes-productos/prod_1794241517770.jpg"
                        title="Proceso artesanal de tallado de máscaras de Xantolo en la Huasteca Hidalguense"
                        aria-label="Video documental sobre el tallado tradicional de máscaras de madera de pemuche y cedro"
                        class="w-full h-full max-h-[380px] object-cover">
                        <source src="media/proceso-tallado-xantolo.mp4" type="video/mp4">
                        Tu navegador no soporta la reproducción de video HTML5.
                    </video>
                </div>
                <div class="lg:col-span-5 p-6 md:p-8 flex flex-col justify-center space-y-4">
                    <span class="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-orange-400">
                        <i class="fa-solid fa-film"></i> Patrimonio Cultural Huasteco
                    </span>
                    <h2 class="text-2xl font-black leading-tight text-white">
                        El Arte del Tallado en Madera de Pemuche y Cedro
                    </h2>
                    <p class="text-xs md:text-sm text-stone-300 font-medium leading-relaxed">
                        Conoce cómo los maestros mascareros de Tehuetlán y Chililico transforman la madera en piezas únicas para las comparsas y cuadrillas de viejos durante la fiesta de Xantolo.
                    </p>
                    <div class="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400 font-bold">
                        <span><i class="fa-solid fa-location-dot text-orange-500 mr-1"></i> Huasteca Hidalguense</span>
                        <span><i class="fa-regular fa-clock text-orange-500 mr-1"></i> Duración: 01:30 min</span>
                    </div>
                </div>
            </div>

            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "El Arte del Tallado en Madera de Pemuche y Cedro - Tradición Xantolo",
              "description": "Proceso artesanal de tallado de máscaras de viejos y huehues por maestros artesanos de la Huasteca Hidalguense para la celebración de Xantolo.",
              "thumbnailUrl": [
                "https://itefhoxpwpreztunzeac.supabase.co/storage/v1/object/public/imagenes-productos/prod_1794241517770.jpg"
              ],
              "uploadDate": "2026-11-01T08:00:00-06:00",
              "duration": "PT1M30S",
              "contentUrl": "https://yaelramses56-creator.github.io/TradicionXantolo/media/proceso-tallado-xantolo.mp4",
              "embedUrl": "https://yaelramses56-creator.github.io/TradicionXantolo/#/catalogo"
            }
            </script>
        </section>
    `;
}