// admin/js/auth.js - Cliente Supabase aislado, utilidades XSS y control de acceso RBAC

const SUPABASE_URL = 'https://itefhoxpwpreztunzeac.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3-m3FR6HKd7rK5JeT95W2w_VFuMQcpq';

const supabaseAdmin = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storageKey: 'xantolo-admin-auth'
    }
});

// Escapa caracteres HTML para evitar inyección XSS al renderizar datos de BD
function escaparHTML(texto) {
    if (texto === null || texto === undefined) return '';
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizarUrlImagen(url) {
    if (!url) return '';
    const limpia = String(url).trim();
    if (limpia.startsWith('https://') || limpia.startsWith('http://') || limpia.startsWith('../') || limpia.startsWith('img/')) {
        return escaparHTML(limpia);
    }
    return '';
}

document.addEventListener("DOMContentLoaded", async () => {
    await verificarSesionAdmin();
});

async function verificarSesionAdmin() {
    const { data } = await supabaseAdmin.auth.getSession();
    const session = data?.session;

    if (session) {
        const { data: adminData, error } = await supabaseAdmin
            .from('administradores')
            .select('rol')
            .eq('id', session.user.id)
            .single();

        if (!error && adminData) {
            renderAdminDashboard(session.user.email);
            return;
        }

        // Si había sesión de un usuario sin rol admin, cerrarla
        await supabaseAdmin.auth.signOut();
    }

    renderAdminLogin();
}

async function iniciarSesionAdmin(event) {
    event.preventDefault();
    const emailInput = document.getElementById("admin-email");
    const passwordInput = document.getElementById("admin-password");
    const errorBox = document.getElementById("admin-login-error");
    const btn = document.getElementById("btn-admin-login");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    errorBox.classList.add("hidden");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';

    try {
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

        if (error) {
            throw new Error("Credenciales inválidas.");
        }

        const { data: adminData, error: adminError } = await supabaseAdmin
            .from('administradores')
            .select('rol')
            .eq('id', data.user.id)
            .single();

        if (adminError || !adminData) {
            await supabaseAdmin.auth.signOut();
            throw new Error("Acceso denegado: tu cuenta no tiene privilegios de administrador.");
        }

        renderAdminDashboard(data.user.email);
    } catch (err) {
        errorBox.textContent = err.message;
        errorBox.classList.remove("hidden");
        passwordInput.value = "";
        btn.disabled = false;
        btn.innerHTML = 'Entrar al Panel <i class="fa-solid fa-lock-open ml-1"></i>';
    }
}

async function cerrarSesionAdmin() {
    await supabaseAdmin.auth.signOut();
    if (typeof inventarioLocal !== "undefined") {
        inventarioLocal = [];
    }
    renderAdminLogin();
}