function renderVistaLogin() {
    const mainContainer = document.getElementById("main-view-container");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <section class="max-w-md mx-auto px-4 py-16">
            <div class="bg-white p-8 rounded-2xl border-2 border-orange-300 shadow-lg space-y-6 text-center">
                <div class="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                    <i class="fa-solid fa-user-lock"></i>
                </div>
                
                <div>
                    <h2 class="text-2xl font-black text-black">Inicia Sesión</h2>
                    <p class="text-xs font-bold text-stone-500 mt-1">Para continuar con tu compra de Xantolo</p>
                </div>

                <div id="login-error-msg" class="hidden bg-red-100 border border-red-300 text-red-700 text-xs font-bold p-3 rounded-lg text-left"></div>

                <form id="login-form" class="space-y-4 text-left" onsubmit="procesarLogin(event)">
                    <div>
                        <label class="font-extrabold text-black block mb-1 text-sm">Correo Electrónico</label>
                        <input type="email" id="login-email" required placeholder="tu@correo.com" class="w-full bg-white border border-stone-300 text-black font-bold rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition">
                    </div>
                    <div>
                        <label class="font-extrabold text-black block mb-1 text-sm">Contraseña</label>
                        <input type="password" id="login-password" required placeholder="••••••••" class="w-full bg-white border border-stone-300 text-black font-bold rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition">
                    </div>
                    
                    <button type="submit" id="btn-submit-login" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                        Ingresar a mi cuenta <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </form>

                <p class="text-xs font-bold text-stone-600 border-t border-stone-200 pt-4">
                    ¿No tienes cuenta? <a href="#" onclick="navegarAVista('registro'); return false;" class="text-orange-600 hover:text-orange-700 transition">Regístrate aquí</a>
                </p>
            </div>
        </section>
    `;
}