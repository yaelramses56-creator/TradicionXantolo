// admin/admin.js - Lógica de Administración (Seguridad con Tabla y sin MSI)

const SUPABASE_URL = 'https://itefhoxpwpreztunzeac.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3-m3FR6HKd7rK5JeT95W2w_VFuMQcpq';
const supabaseAdmin = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let inventarioLocal = [];

document.addEventListener("DOMContentLoaded", async () => {
    await verificarSesionAdmin();
});

// --- 1. AUTENTICACIÓN BASADA EN ROLES (RBAC) ---
async function verificarSesionAdmin() {
    const { data } = await supabaseAdmin.auth.getSession();
    const session = data.session;

    if (session) {
        // Validar que el usuario exista en la tabla 'administradores'
        const { data: adminData } = await supabaseAdmin
            .from('administradores')
            .select('rol')
            .eq('id', session.user.id)
            .single();

        if (adminData) {
            mostrarDashboard(session.user.email);
            return;
        }
    }
    mostrarLogin();
}

async function iniciarSesionAdmin(event) {
    event.preventDefault();
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;
    const errorBox = document.getElementById("admin-login-error");
    const btn = document.getElementById("btn-admin-login");

    errorBox.classList.add("hidden");
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';

    // 1. Intentar iniciar sesión en Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (error) {
        errorBox.textContent = "Credenciales incorrectas: " + error.message;
        errorBox.classList.remove("hidden");
        btn.innerHTML = 'Entrar al Panel <i class="fa-solid fa-lock-open ml-1"></i>';
        return;
    }

    // 2. Verificar permisos en la tabla de administradores
    const { data: adminData } = await supabaseAdmin
        .from('administradores')
        .select('rol')
        .eq('id', data.user.id)
        .single();

    if (!adminData) {
        // Si no es admin, lo expulsamos inmediatamente
        await supabaseAdmin.auth.signOut();
        errorBox.textContent = "Acceso denegado: Tu cuenta no tiene privilegios de Administrador.";
        errorBox.classList.remove("hidden");
        btn.innerHTML = 'Entrar al Panel <i class="fa-solid fa-lock-open ml-1"></i>';
        return;
    }

    mostrarDashboard(data.user.email);
}

async function cerrarSesionAdmin() {
    await supabaseAdmin.auth.signOut();
    mostrarLogin();
}

function mostrarLogin() {
    document.getElementById("admin-login-view").classList.remove("hidden");
    document.getElementById("admin-dashboard-view").classList.add("hidden");
}

function mostrarDashboard(email) {
    document.getElementById("admin-login-view").classList.add("hidden");
    document.getElementById("admin-dashboard-view").classList.remove("hidden");
    document.getElementById("admin-user-badge").textContent = `Admin: ${email}`;
    cargarInventarioAdmin();
}

// --- 2. LECTURA DE INVENTARIO ---
async function cargarInventarioAdmin() {
    const tbody = document.getElementById("tabla-inventario-body");
    tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-stone-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Cargando inventario...</td></tr>`;

    const { data, error } = await supabaseAdmin
        .from('productos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-red-600">Error al cargar: ${error.message}</td></tr>`;
        return;
    }

    inventarioLocal = data || [];
    actualizarMetricas(inventarioLocal);
    renderizarTabla(inventarioLocal);
}

function actualizarMetricas(productos) {
    document.getElementById("stat-total-productos").textContent = productos.length;
    const totalStock = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    document.getElementById("stat-total-stock").textContent = totalStock;
    const enOferta = productos.filter(p => p.oferta === 'activo').length;
    document.getElementById("stat-total-ofertas").textContent = enOferta;
}

function renderizarTabla(productos) {
    const tbody = document.getElementById("tabla-inventario-body");
    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-stone-400">No hay productos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = productos.map(prod => `
        <tr class="hover:bg-stone-50 transition">
            <td class="py-3 px-2 flex items-center gap-2.5">
                <img src="${prod.imagen}" alt="${prod.alt || ''}" class="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0">
                <div>
                    <p class="text-stone-900 font-extrabold line-clamp-1">${prod.nombre}</p>
                    <span class="text-[10px] text-stone-500">${prod.categoria}</span>
                </div>
            </td>
            <td class="py-3 px-2">
                <span class="text-stone-900 font-black">$${Number(prod.precio).toLocaleString()}</span>
                ${prod.oferta === 'activo' ? `<span class="block text-[10px] text-orange-600">Oferta: $${Number(prod.precio_oferta || prod.precio).toLocaleString()}</span>` : ''}
            </td>
            <td class="py-3 px-2">
                <span class="px-2 py-0.5 rounded-full text-[11px] ${prod.stock > 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}">
                    ${prod.stock} uds.
                </span>
            </td>
            <td class="py-3 px-2">
                <span class="text-[11px] ${prod.estado === 'en existencia' ? 'text-emerald-600' : 'text-stone-400'}">
                    ${prod.estado || 'en existencia'}
                </span>
            </td>
            <td class="py-3 px-2 text-right space-x-1 whitespace-nowrap">
                <button onclick="prepararEdicion(${prod.id})" class="bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-600 px-2.5 py-1.5 rounded-lg transition" title="Editar">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button onclick="eliminarProducto(${prod.id})" class="bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-600 px-2.5 py-1.5 rounded-lg transition" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// --- 3. SUBIDA DE IMAGEN Y GUARDADO ---
async function subirImagenBucket(archivo) {
    const extension = archivo.name.split('.').pop();
    const nombreArchivo = `prod_${Date.now()}.${extension}`;

    const { error } = await supabaseAdmin.storage
        .from('imagenes-productos')
        .upload(nombreArchivo, archivo, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: urlData } = supabaseAdmin.storage
        .from('imagenes-productos')
        .getPublicUrl(nombreArchivo);

    return urlData.publicUrl;
}

async function guardarProducto(event) {
    event.preventDefault();
    const btn = document.getElementById("btn-guardar-prod");
    const idEdicion = document.getElementById("prod-id").value;
    const archivoInput = document.getElementById("prod-imagen-file");
    let urlImagenFinal = document.getElementById("prod-imagen-actual").value;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Procesando...';

    try {
        if (archivoInput.files && archivoInput.files.length > 0) {
            urlImagenFinal = await subirImagenBucket(archivoInput.files[0]);
        }

        if (!urlImagenFinal) {
            alert("Por favor selecciona una fotografía para el producto.");
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-1"></i> Guardar Producto en Base de Datos';
            return;
        }

        const stockNum = parseInt(document.getElementById("prod-stock").value, 10) || 0;

        const datosProducto = {
            nombre: document.getElementById("prod-nombre").value.trim(),
            categoria: document.getElementById("prod-categoria").value,
            stock: stockNum,
            precio: parseFloat(document.getElementById("prod-precio").value) || 0,
            precio_anterior: parseFloat(document.getElementById("prod-precio-anterior").value) || null,
            precio_oferta: parseFloat(document.getElementById("prod-precio-oferta").value) || null,
            oferta: document.getElementById("prod-oferta").value,
            estado: stockNum > 0 ? document.getElementById("prod-estado").value : 'sin existencia',
            descuento: document.getElementById("prod-descuento").value.trim(),
            artesano: document.getElementById("prod-artesano").value.trim(),
            descripcion: document.getElementById("prod-descripcion").value.trim(),
            imagen: urlImagenFinal,
            alt: document.getElementById("prod-alt").value.trim(),
            title: document.getElementById("prod-title").value.trim()
        };

        if (idEdicion) {
            const { error } = await supabaseAdmin.from('productos').update(datosProducto).eq('id', idEdicion);
            if (error) throw error;
        } else {
            datosProducto.calificacion = 5.0;
            datosProducto.vendidos = 0;
            const { error } = await supabaseAdmin.from('productos').insert([datosProducto]);
            if (error) throw error;
        }

        limpiarFormularioProducto();
        await cargarInventarioAdmin();
        alert(idEdicion ? "¡Producto actualizado correctamente!" : "¡Producto registrado con éxito!");

    } catch (error) {
        console.error("Error al guardar producto:", error);
        alert("Hubo un error al guardar: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-1"></i> Guardar Producto en Base de Datos';
    }
}

// --- 4. EDICIÓN Y ELIMINACIÓN ---
function prepararEdicion(id) {
    const prod = inventarioLocal.find(p => p.id === id);
    if (!prod) return;

    document.getElementById("form-title").innerHTML = `<i class="fa-solid fa-pen-to-square text-orange-500 mr-1"></i> Editando Producto #${prod.id}`;
    document.getElementById("btn-cancelar-edicion").classList.remove("hidden");

    document.getElementById("prod-id").value = prod.id;
    document.getElementById("prod-imagen-actual").value = prod.imagen || "";
    document.getElementById("prod-nombre").value = prod.nombre || "";
    document.getElementById("prod-categoria").value = prod.categoria || "Máscaras de Madera";
    document.getElementById("prod-stock").value = prod.stock ?? 0;
    document.getElementById("prod-precio").value = prod.precio || "";
    document.getElementById("prod-precio-anterior").value = prod.precio_anterior || "";
    document.getElementById("prod-precio-oferta").value = prod.precio_oferta || "";
    document.getElementById("prod-oferta").value = prod.oferta || "inactivo";
    document.getElementById("prod-estado").value = prod.estado || "en existencia";
    document.getElementById("prod-descuento").value = prod.descuento || "";
    document.getElementById("prod-artesano").value = prod.artesano || "";
    document.getElementById("prod-descripcion").value = prod.descripcion || "";
    document.getElementById("prod-alt").value = prod.alt || "";
    document.getElementById("prod-title").value = prod.title || "";

    const infoImg = document.getElementById("imagen-actual-info");
    infoImg.textContent = "Imagen actual guardada. Sube un archivo nuevo solo si deseas reemplazarla.";
    infoImg.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limpiarFormularioProducto() {
    document.getElementById("form-producto").reset();
    document.getElementById("prod-id").value = "";
    document.getElementById("prod-imagen-actual").value = "";
    document.getElementById("imagen-actual-info").classList.add("hidden");
    document.getElementById("btn-cancelar-edicion").classList.add("hidden");
    document.getElementById("form-title").innerHTML = `<i class="fa-solid fa-plus-circle text-orange-500 mr-1"></i> Registrar Nuevo Producto`;
}

async function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto de la base de datos?")) return;
    const { error } = await supabaseAdmin.from('productos').delete().eq('id', id);
    if (error) { alert("No se pudo eliminar: " + error.message); return; }
    await cargarInventarioAdmin();
}