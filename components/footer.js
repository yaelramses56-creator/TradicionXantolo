function renderFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer class="bg-stone-950 text-stone-400 border-t-2 border-orange-600 mt-16">
            <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                
                <div class="space-y-3">
                    <div class="flex items-center gap-2 text-orange-500 font-black text-lg">
                        <i class="fa-solid fa-masks-theater"></i>
                        <span class="search-target">Tradicion Xantolo</span>
                    </div>
                    <p class="text-xs text-stone-500 leading-relaxed search-target">
                        Plataforma líder de comercio electrónico dedicada a preservar y distribuir máscaras de madera e indumentaria de cuadrillas en la Huasteca Hidalguense.
                    </p>
                </div>

                <div>
                    <h4 class="text-stone-200 font-bold mb-3 uppercase text-xs tracking-wider">Categorías</h4>
                    <ul class="space-y-2 text-xs">
                        <li><a href="#" onclick="filtrarPorCategoria('Máscaras de Madera'); return false;" class="hover:text-orange-500 transition">Máscaras de Madera Pemuche</a></li>
                        <li><a href="#" onclick="filtrarPorCategoria('Máscaras de Cartonería'); return false;" class="hover:text-orange-500 transition">Máscaras de Cartonería</a></li>
                        <li><a href="#" onclick="filtrarPorCategoria('Vestuario de Viejos'); return false;" class="hover:text-orange-500 transition">Trajes de Viejos y Comineras</a></li>
                        <li><a href="#" onclick="filtrarPorCategoria('Kits de Cuadrilla'); return false;" class="hover:text-orange-500 transition">Kits Completos de Cuadrilla</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-stone-200 font-bold mb-3 uppercase text-xs tracking-wider">Compra Protegida</h4>
                    <ul class="space-y-2 text-xs">
                        <li class="search-target"><i class="fa-solid fa-shield-halved text-orange-600 mr-1.5"></i> Garantía de tallado artesanal</li>
                        <li class="search-target"><i class="fa-solid fa-truck-fast text-orange-600 mr-1.5"></i> Envíos a toda la Huasteca</li>
                        <li class="search-target"><i class="fa-regular fa-credit-card text-orange-600 mr-1.5"></i> Meses sin intereses con tarjetas</li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-stone-200 font-bold mb-3 uppercase text-xs tracking-wider">Centro de Distribución</h4>
                    <p class="text-xs text-stone-500 search-target">
                        Zona Centro, C.P. 43000<br>
                        Huejutla de Reyes, Hidalgo, México.<br>
                        Atención a cuadrillas y mayoreo.
                    </p>
                </div>

            </div>
            <div class="bg-black/80 py-4 text-center text-[11px] text-stone-600 border-t border-stone-900">
                © 2026 Tradicion Xantolo S.A. de C.V. - Todos los derechos reservados | Proyecto E-commerce ISC - IT Huejutla.
            </div>
        </footer>
    `;
}