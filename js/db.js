// js/db.js - ARCHIVO COMPLETO (Catálogo, Ventas con Stock y Autenticación)

const SUPABASE_URL = 'https://itefhoxpwpreztunzeac.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3-m3FR6HKd7rK5JeT95W2w_VFuMQcpq';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. CATÁLOGO DE PRODUCTOS ---
async function obtenerProductosDesdeDB() {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        if (!data) return [];

        return data.map(item => {
            const precioSeguro = Number(item.precio) || 0;
            const precioAnteriorSeguro = Number(item.precio_anterior) || precioSeguro;

            return {
                ...item,
                precio: precioSeguro,
                precioAnterior: precioAnteriorSeguro, 
                descuento: item.descuento || "",
                envioFull: false 
            };
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        return []; 
    }
}

// --- 2. PROCESAMIENTO DE VENTAS Y DESCUENTO DE INVENTARIO ---
async function procesarVenta(datosEnvio, carrito, total, metodoPago = 'PayPal Sandbox', referenciaPago = '') {
    try {
        // 1. Actualizar teléfono y dirección del cliente
        if (estadoApp.usuarioActual && estadoApp.usuarioActual.id) {
            await supabaseClient
                .from('clientes')
                .update({
                    telefono: datosEnvio.telefono,
                    direccion: `${datosEnvio.direccion}, ${datosEnvio.ciudad}, C.P. ${datosEnvio.cp}`
                })
                .eq('id', estadoApp.usuarioActual.id);
        }

        // 2. Insertar la venta en 'ventas'
        const { data: ventaData, error: ventaError } = await supabaseClient
            .from('ventas')
            .insert([{
                cliente_id: estadoApp.usuarioActual ? estadoApp.usuarioActual.id : null,
                subtotal: total,
                total: total,
                estado: 'Pagado',
                metodo_pago: metodoPago,
                referencia_pago: referenciaPago || `TX-${Date.now()}`
            }])
            .select();

        if (ventaError) throw ventaError;
        const ventaId = ventaData[0].id;

        // 3. Insertar detalles en 'detalle_ventas'
        const detalleInsertions = carrito.map(item => ({
            venta_id: ventaId,
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precioAnterior || item.precio,
            precio_venta: item.precio
        }));

        const { error: detalleError } = await supabaseClient
            .from('detalle_ventas')
            .insert(detalleInsertions);

        if (detalleError) throw detalleError;

        // 4. Descontar stock en 'productos' mediante función segura (RPC)
        for (const item of carrito) {
            const { error: stockError } = await supabaseClient.rpc('descontar_stock_producto', {
                p_producto_id: item.id,
                p_cantidad: item.cantidad
            });

            if (stockError) throw stockError;
        }

        // 5. Actualizar memoria local de la tienda
        estadoApp.productosGlobales = await obtenerProductosDesdeDB();

        return { exito: true, folio: ventaId, referencia: referenciaPago || `TX-${ventaId}` };

    } catch (error) {
        console.error("Error al procesar la venta:", error);
        return { exito: false, mensaje: error.message };
    }
}

// --- 3. FUNCIONES DE AUTENTICACIÓN ---
async function registrarUsuarioDB(email, password, nombreCompleto) {
    try {
        const urlRedireccion = `${window.location.origin}${window.location.pathname}`;

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: urlRedireccion,
                data: {
                    nombre_completo: nombreCompleto
                }
            }
        });
        if (error) throw error;

        if (data.user && data.user.identities && data.user.identities.length === 0) {
            return { exito: false, mensaje: "Este correo ya está registrado. Intenta iniciar sesión." };
        }

        if (data.session) {
            await supabaseClient.auth.signOut();
        }

        return { exito: true, user: data.user, nombre: nombreCompleto };
    } catch (error) {
        return { exito: false, mensaje: error.message };
    }
}
async function iniciarSesionDB(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) throw error;

        const { data: clienteData } = await supabaseClient
            .from('clientes')
            .select('nombre_completo')
            .eq('id', data.user.id)
            .single();

        return { 
            exito: true, 
            user: data.user, 
            nombre: clienteData ? clienteData.nombre_completo : 'Artesano' 
        };
    } catch (error) {
        if (error.message && error.message.toLowerCase().includes("email not confirmed")) {
            return { exito: false, mensaje: "Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada o carpeta de spam." };
        }
        return { exito: false, mensaje: "Correo o contraseña incorrectos." };
    }
}

async function cerrarSesionDB() {
    await supabaseClient.auth.signOut();
}

async function obtenerSesionActual() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error || !data.session) return null;
    
    const { data: clienteData } = await supabaseClient
        .from('clientes')
        .select('nombre_completo')
        .eq('id', data.session.user.id)
        .single();
        
    return {
        id: data.session.user.id,
        email: data.session.user.email,
        nombre: clienteData ? clienteData.nombre_completo : 'Artesano'
    };
} // <--- Aquí cerraba obtenerSesionActual

// --- 4. HISTORIAL DE COMPRAS DEL USUARIO ---
async function obtenerComprasUsuarioDB(clienteId) {
    try {
        if (!clienteId) return [];

        const { data: ventas, error: ventasError } = await supabaseClient
            .from('ventas')
            .select('*')
            .eq('cliente_id', clienteId)
            .order('id', { ascending: false });

        if (ventasError) throw ventasError;
        if (!ventas || ventas.length === 0) return [];

        const ventaIds = ventas.map(v => v.id);
        const { data: detalles, error: detallesError } = await supabaseClient
            .from('detalle_ventas')
            .select('*')
            .in('venta_id', ventaIds);

        if (detallesError) throw detallesError;

        let catalogo = estadoApp.productosGlobales || [];
        if (catalogo.length === 0) {
            catalogo = await obtenerProductosDesdeDB();
        }

        return ventas.map(venta => {
            const itemsVenta = (detalles || [])
                .filter(d => d.venta_id === venta.id)
                .map(d => {
                    const prod = catalogo.find(p => p.id === d.producto_id);
                    return {
                        cantidad: d.cantidad,
                        precio_venta: Number(d.precio_venta) || 0,
                        nombre: prod ? prod.nombre : `Producto #${d.producto_id}`,
                        imagen: prod ? prod.imagen : '',
                        categoria: prod ? prod.categoria : 'Artesanía'
                    };
                });

            return {
                ...venta,
                items: itemsVenta
            };
        });
    } catch (error) {
        console.error("Error al obtener historial de compras:", error);
        return [];
    }
}