// admin/js/inventario.js - CRUD de productos y carga segura de imágenes

let inventarioLocal = [];

const TIPOS_IMAGEN_PERMITIDOS = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};
const MAX_PESO_IMAGEN_BYTES = 2 * 1024 * 1024; // 2 MB

async function cargarInventarioAdmin() {
    const tbody = document.getElementById("tabla-inventario-body");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-stone-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Cargando inventario...</td></tr>`;

    const { data, error } = await supabaseAdmin
        .from('productos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-red-600">Error al cargar: ${escaparHTML(error.message)}</td></tr>`;
        return;
    }

    inventarioLocal = data || [];
    actualizarMetricas(inventarioLocal);
    renderizarTabla(inventarioLocal);
}

function actualizarMetricas(productos) {
    const totalProd = document.getElementById("stat-total-productos");
    const totalStock = document.getElementById("stat-total-stock");
    const totalOfertas = document.getElementById("stat-total-ofertas");
    const totalAgotados = document.getElementById("stat-total-agotados");

    if (totalProd) totalProd.textContent = productos.length;
    if (totalStock) totalStock.textContent = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    if (totalOfertas) totalOfertas.textContent = productos.filter(p => p.oferta === 'activo').length;
    if (totalAgotados) totalAgotados.textContent = productos.filter(p => (Number(p.stock) || 0) <= 0).length;
}

function renderizarTabla(productos) {
    const tbody = document.getElementById("tabla-inventario-body");
    if (!tbody) return;

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-stone-400">No hay productos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = productos.map(prod => {
        const idSeguro = Number(prod.id);
        const stockNum = Number(prod.stock) || 0;
        const precioNum = Number(prod.precio) || 0;
        const precioOfertaNum = Number(prod.precio_oferta || prod.precio) || 0;
        const imgSegura = sanitizarUrlImagen(prod.imagen);

        return `
            <tr class="hover:bg-stone-50 transition">
                <td class="py-3 px-2 flex items-center gap-2.5">
                    <img src="${imgSegura}" alt="${escaparHTML(prod.alt)}" class="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0">
                    <div>
                        <p class="text-stone-900 font-extrabold line-clamp-1">${escaparHTML(prod.nombre)}</p>
                        <span class="text-[10px] text-stone-500">${escaparHTML(prod.categoria)}</span>
                    </div>
                </td>
                <td class="py-3 px-2">
                    <span class="text-stone-900 font-black">$${precioNum.toLocaleString('es-MX')}</span>
                    ${prod.oferta === 'activo' ? `<span class="block text-[10px] text-orange-600">Oferta: $${precioOfertaNum.toLocaleString('es-MX')}</span>` : ''}
                </td>
                <td class="py-3 px-2">
                    <span class="px-2 py-0.5 rounded-full text-[11px] ${stockNum > 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}">
                        ${stockNum} uds.
                    </span>
                </td>
                <td class="py-3 px-2">
                    <span class="text-[11px] ${stockNum > 0 && prod.estado === 'en existencia' ? 'text-emerald-600' : 'text-red-500'}">
                        ${escaparHTML(stockNum > 0 ? (prod.estado || 'en existencia') : 'sin existencia')}
                    </span>
                </td>
                <td class="py-3 px-2 text-right space-x-1 whitespace-nowrap">
                    <button onclick="prepararEdicion(${idSeguro})" class="bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-600 px-2.5 py-1.5 rounded-lg transition" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="eliminarProducto(${idSeguro})" class="bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-600 px-2.5 py-1.5 rounded-lg transition" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function validarArchivoImagen(archivo) {
    const extension = TIPOS_IMAGEN_PERMITIDOS[archivo.type];
    if (!extension) {
        return { valido: false, mensaje: "Formato no permitido. Usa únicamente imágenes JPG, PNG o WebP." };
    }
    if (archivo.size > MAX_PESO_IMAGEN_BYTES) {
        return { valido: false, mensaje: "La imagen supera el límite de 2 MB. Comprímela antes de subirla." };
    }
    return { valido: true, extension };
}

async function subirImagenBucket(archivo) {
    const validacion = validarArchivoImagen(archivo);
    if (!validacion.valido) {
        throw new Error(validacion.mensaje);
    }

    const sufijo = Math.random().toString(36).slice(2, 8);
    const nombreArchivo = `prod_${Date.now()}_${sufijo}.${validacion.extension}`;

    const { error } = await supabaseAdmin.storage
        .from('imagenes-productos')
        .upload(nombreArchivo, archivo, {
            cacheControl: '3600',
            contentType: archivo.type,
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

    const stockNum = parseInt(document.getElementById("prod-stock").value, 10);
    const precioNum = parseFloat(document.getElementById("prod-precio").value);

    if (Number.isNaN(stockNum) || stockNum < 0) {
        alert("El stock debe ser un número mayor o igual a 0.");
        return;
    }
    if (Number.isNaN(precioNum) || precioNum < 0) {
        alert("El precio base debe ser un monto válido.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Procesando...';

    try {
        if (archivoInput.files && archivoInput.files.length > 0) {
            urlImagenFinal = await subirImagenBucket(archivoInput.files[0]);
        }

        if (!urlImagenFinal) {
            throw new Error("Por favor selecciona una fotografía para el producto.");
        }

        const precioAnteriorVal = parseFloat(document.getElementById("prod-precio-anterior").value);
        const precioOfertaVal = parseFloat(document.getElementById("prod-precio-oferta").value);

        const datosProducto = {
            nombre: document.getElementById("prod-nombre").value.trim(),
            categoria: document.getElementById("prod-categoria").value,
            stock: stockNum,
            precio: precioNum,
            precio_anterior: Number.isNaN(precioAnteriorVal) ? null : precioAnteriorVal,
            precio_oferta: Number.isNaN(precioOfertaVal) ? null : precioOfertaVal,
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

function prepararEdicion(id) {
    const prod = inventarioLocal.find(p => p.id === id);
    if (!prod) return;

    document.getElementById("form-title").innerHTML = `<i class="fa-solid fa-pen-to-square text-orange-500 mr-1"></i> Editando Producto #${Number(prod.id)}`;
    document.getElementById("btn-cancelar-edicion").classList.remove("hidden");

    document.getElementById("prod-id").value = prod.id;
    document.getElementById("prod-imagen-actual").value = prod.imagen || "";
    document.getElementById("prod-nombre").value = prod.nombre || "";
    document.getElementById("prod-categoria").value = prod.categoria || "Máscaras de Madera";
    document.getElementById("prod-stock").value = prod.stock ?? 0;
    document.getElementById("prod-precio").value = prod.precio ?? "";
    document.getElementById("prod-precio-anterior").value = prod.precio_anterior ?? "";
    document.getElementById("prod-precio-oferta").value = prod.precio_oferta ?? "";
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
    if (error) {
        alert("No se pudo eliminar: " + error.message);
        return;
    }
    await cargarInventarioAdmin();
}