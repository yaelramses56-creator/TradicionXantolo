// admin/views/loginView.js - Vista exclusiva de autenticación administrativa

function renderAdminLogin() {
    const app = document.getElementById("admin-app");
    if (!app) return;

    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-stone-900 px-4">
            <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-t-4 border-orange-500 space-y-6">
                <div class="text-center">
                    <div class="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <h1 class="text-2xl font-black text-stone-900">Acceso Administrativo</h1>
                    <p class="text-xs font-bold text-stone-500 mt-1">Gestión de Inventario y Catálogo • Tradición Xantolo</p>
                </div>

                <div id="admin-login-error" class="hidden bg-red-100 border border-red-300 text-red-700 text-xs font-bold p-3 rounded-lg"></div>

                <form id="form-admin-login" onsubmit="iniciarSesionAdmin(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-extrabold uppercase text-stone-600 mb-1">Correo de Administrador</label>
                        <input type="email" id="admin-email" required autocomplete="username" placeholder="admin@correo.com"
                            class="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold uppercase text-stone-600 mb-1">Contraseña</label>
                        <input type="password" id="admin-password" required autocomplete="current-password" placeholder="••••••••"
                            class="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-orange-500">
                    </div>
                    <button type="submit" id="btn-admin-login"
                        class="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm transition shadow-md">
                        Entrar al Panel <i class="fa-solid fa-lock-open ml-1"></i>
                    </button>
                </form>

                <div class="text-center pt-2 border-t border-stone-200">
                    <a href="../index.html" class="text-xs font-bold text-stone-500 hover:text-orange-600 transition">
                        <i class="fa-solid fa-arrow-left mr-1"></i> Volver a la tienda
                    </a>
                </div>
            </div>
        </div>
    `;
}