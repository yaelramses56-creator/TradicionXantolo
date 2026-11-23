function renderSidebar(categoriaActiva = "Todas", ordenActual = "relevancia") {
    const categorias = ["Todas", "Máscaras de Madera", "Máscaras de Cartonería", "Vestuario de Viejos", "Sombreros y Chirriones", "Kits de Cuadrilla"];

    return `
        <aside class="w-full lg:w-64 shrink-0 space-y-4 md:space-y-6">
            <!-- RECUADRO CON BORDE NARANJA -->
            <div class="bg-white p-4 md:p-5 rounded-xl border-2 border-orange-300 shadow-sm space-y-3">
                <h3 class="font-black text-xs md:text-sm text-black uppercase tracking-wider border-b border-orange-200 pb-2">
                    Categorías
                </h3>
                <ul class="space-y-1 text-sm flex flex-col">
                    ${categorias.map(cat => `
                        <li>
                            <button onclick="filtrarPorCategoria('${cat}')" class="w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between ${categoriaActiva === cat ? 'bg-orange-100 text-orange-700 font-black border-l-4 border-orange-500' : 'text-stone-700 hover:bg-orange-50 hover:text-black font-bold'}">
                                <span class="text-xs md:text-sm">${cat}</span>
                                <i class="fa-solid fa-chevron-right text-[9px] opacity-40"></i>
                            </button>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- RECUADRO CON BORDE NARANJA -->
            <div class="bg-white p-4 md:p-5 rounded-xl border-2 border-orange-300 shadow-sm space-y-3">
                <h3 class="font-black text-xs md:text-sm text-black uppercase tracking-wider border-b border-orange-200 pb-2">
                    Ordenar Productos
                </h3>
                <select onchange="cambiarOrdenProductos(this.value)" class="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs md:text-sm text-black font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
                    <option value="relevancia" ${ordenActual === 'relevancia' ? 'selected' : ''}>Más relevantes</option>
                    <option value="menor-precio" ${ordenActual === 'menor-precio' ? 'selected' : ''}>Menor precio</option>
                    <option value="mayor-precio" ${ordenActual === 'mayor-precio' ? 'selected' : ''}>Mayor precio</option>
                </select>
            </div>

            <div class="hidden lg:block bg-orange-50 text-stone-900 p-5 rounded-xl shadow-sm border-2 border-orange-300 space-y-2">
                <div class="flex items-center gap-2 text-orange-600 font-black text-sm">
                    <i class="fa-solid fa-award text-lg"></i>
                    <span>Artesanía 100% Huasteca</span>
                </div>
                <p class="text-xs text-black font-medium leading-relaxed search-target">
                    Cada máscara es tallada por maestros artesanos de Tehuetlán, Chililico y Huejutla de Reyes.
                </p>
            </div>
        </aside>
    `;
}