// admin/views/dashboardView.js - Interfaz del panel de gestión de productos

function renderAdminDashboard(emailAdmin) {
    const app = document.getElementById("admin-app");
    if (!app) return;

    app.innerHTML = `
        <div class="min-h-screen flex flex-col">
            <!-- Barra Superior -->
            <header class="bg-stone-900 text-white shadow-md border-b-2 border-orange-500">
                <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                            <i class="fa-solid fa-screwdriver-wrench"></i>
                        </div>
                        <div>
                            <span class="font-black text-base tracking-tight block leading-none">Backoffice Xantolo</span>
                            <span class="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Sistema de Gestión Interna</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 sm:gap-4">
                        <a href="../index.html" target="_blank" rel="noopener noreferrer"
                            class="text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg border border-stone-700 transition">
                            <i class="fa-solid fa-up-right-from-square mr-1"></i> Ver Tienda
                        </a>
                        <span id="admin-user-badge" class="text-xs font-bold text-stone-400 hidden sm:inline">
                            Admin: ${escaparHTML(emailAdmin)}
                        </span>
                        <button onclick="cerrarSesionAdmin()"
                            class="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg transition">
                            <i class="fa-solid fa-power-off mr-1"></i> Salir
                        </button>
                    </div>
                </div>
            </header>

            <!-- Contenido Principal -->
            <main class="max-w-7xl w-full mx-auto px-4 py-8 space-y-8 flex-1">

                <!-- Tarjetas de Resumen -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-[11px] font-extrabold text-stone-500 uppercase">Total Productos</p>
                            <p id="stat-total-productos" class="text-3xl font-black text-stone-900 mt-1">0</p>
                        </div>
                        <div class="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-[11px] font-extrabold text-stone-500 uppercase">Unidades en Stock</p>
                            <p id="stat-total-stock" class="text-3xl font-black text-emerald-600 mt-1">0</p>
                        </div>
                        <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-warehouse"></i>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-[11px] font-extrabold text-stone-500 uppercase">En Oferta</p>
                            <p id="stat-total-ofertas" class="text-3xl font-black text-amber-600 mt-1">0</p>
                        </div>
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-tags"></i>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-[11px] font-extrabold text-stone-500 uppercase">Agotados</p>
                            <p id="stat-total-agotados" class="text-3xl font-black text-red-600 mt-1">0</p>
                        </div>
                        <div class="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-circle-exclamation"></i>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <!-- COLUMNA IZQUIERDA: FORMULARIO CREAR / EDITAR PRODUCTO -->
                    <div class="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                        <div class="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
                            <h2 id="form-title" class="text-lg font-black text-stone-900">
                                <i class="fa-solid fa-plus-circle text-orange-500 mr-1"></i> Registrar Nuevo Producto
                            </h2>
                            <button type="button" id="btn-cancelar-edicion" onclick="limpiarFormularioProducto()"
                                class="hidden text-xs font-bold text-red-600 hover:underline">
                                Cancelar edición
                            </button>
                        </div>

                        <form id="form-producto" onsubmit="guardarProducto(event)" class="space-y-4 text-xs">
                            <input type="hidden" id="prod-id">
                            <input type="hidden" id="prod-imagen-actual">

                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Nombre del Producto *</label>
                                <input type="text" id="prod-nombre" required placeholder="Ej. Máscara de Diablo en Pemuche"
                                    class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500">
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Categoría *</label>
                                    <select id="prod-categoria" required
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold bg-white focus:outline-none focus:border-orange-500">
                                        <option value="Máscaras de Madera">Máscaras de Madera</option>
                                        <option value="Máscaras de Cartonería">Máscaras de Cartonería</option>
                                        <option value="Vestuario de Viejos">Vestuario de Viejos</option>
                                        <option value="Sombreros y Chirriones">Sombreros y Chirriones</option>
                                        <option value="Kits de Cuadrilla">Kits de Cuadrilla</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Stock Disponible *</label>
                                    <input type="number" id="prod-stock" min="0" step="1" required placeholder="10"
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500">
                                </div>
                            </div>

                            <div class="grid grid-cols-3 gap-3">
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Precio Base ($) *</label>
                                    <input type="number" min="0" step="0.01" id="prod-precio" required placeholder="1250.00"
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500">
                                </div>
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Precio Anterior ($)</label>
                                    <input type="number" min="0" step="0.01" id="prod-precio-anterior" placeholder="1490.00"
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500">
                                </div>
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Precio Oferta ($)</label>
                                    <input type="number" min="0" step="0.01" id="prod-precio-oferta" placeholder="990.00"
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500">
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">¿Oferta Activa?</label>
                                    <select id="prod-oferta"
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold bg-white">
                                        <option value="inactivo">Inactivo</option>
                                        <option value="activo">Activo</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Estado de Inventario</label>
                                    <select id="prod-estado"
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold bg-white">
                                        <option value="en existencia">En existencia</option>
                                        <option value="sin existencia">Sin existencia</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Etiqueta Descuento</label>
                                <input type="text" id="prod-descuento" placeholder="Ej. 15% OFF"
                                    class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500">
                            </div>

                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Taller o Maestro Artesano *</label>
                                <input type="text" id="prod-artesano" required
                                    placeholder="Ej. Taller Hnos. Hernández (Tehuetlán)"
                                    class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500">
                            </div>

                            <div>
                                <label class="font-extrabold text-stone-700 block mb-1">Descripción del Producto *</label>
                                <textarea id="prod-descripcion" rows="3" required
                                    placeholder="Describe los materiales, técnica y detalles..."
                                    class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-orange-500"></textarea>
                            </div>

                            <!-- SUBIDA DE IMAGEN A SUPABASE STORAGE -->
                            <div class="p-3 bg-orange-50 rounded-xl border border-orange-200 space-y-2">
                                <label class="font-extrabold text-orange-900 block">Fotografía del Producto (JPG, PNG o WebP • Máx. 2 MB)</label>
                                <input type="file" id="prod-imagen-file" accept="image/jpeg,image/png,image/webp"
                                    class="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer">
                                <p id="imagen-actual-info" class="text-[11px] text-stone-500 hidden"></p>
                            </div>

                            <!-- CAMPOS SEO MULTIMEDIA -->
                            <div class="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Texto Alternativo (SEO Alt) *</label>
                                    <input type="text" id="prod-alt" required placeholder="Máscara de madera tallada..."
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold">
                                </div>
                                <div>
                                    <label class="font-extrabold text-stone-700 block mb-1">Título SEO (Atributo Title) *</label>
                                    <input type="text" id="prod-title" required placeholder="Máscara Tradicional Xantolo"
                                        class="w-full border border-stone-300 rounded-lg px-3 py-2 font-bold">
                                </div>
                            </div>

                            <button type="submit" id="btn-guardar-prod"
                                class="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm transition shadow-md">
                                <i class="fa-solid fa-floppy-disk mr-1"></i> Guardar Producto en Base de Datos
                            </button>
                        </form>
                    </div>

                    <!-- COLUMNA DERECHA: TABLA DE PRODUCTOS -->
                    <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        <div class="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
                            <h2 class="text-lg font-black text-stone-900">Catálogo Actual en Supabase</h2>
                            <button onclick="cargarInventarioAdmin()"
                                class="text-xs font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                <i class="fa-solid fa-rotate"></i> Actualizar lista
                            </button>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr class="border-b-2 border-stone-200 text-stone-500 uppercase">
                                        <th class="py-3 px-2">Producto</th>
                                        <th class="py-3 px-2">Precio</th>
                                        <th class="py-3 px-2">Stock</th>
                                        <th class="py-3 px-2">Estado</th>
                                        <th class="py-3 px-2 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="tabla-inventario-body" class="divide-y divide-stone-200 font-bold">
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    `;

    cargarInventarioAdmin();
}