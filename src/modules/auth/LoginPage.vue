<template>
<v-container fluid class="login-page fill-height pa-0">

  <!-- FONDO DECORATIVO -->
  <div class="background-shape background-shape-1"></div>
  <div class="background-shape background-shape-2"></div>

  <!-- BOTÓN VOLVER -->
  <div class="back-home">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="back-button" @click="$router.push('/')">
      Volver al inicio
    </v-btn>
  </div>

  <!-- CONTENIDO PRINCIPAL -->
  <div class="login-container">

    <!-- =========================
           PANEL IZQUIERDO
      ========================== -->
    <section class="welcome-panel">

      <div class="welcome-content">

        <div class="welcome-badge">
          <v-icon icon="mdi-sparkles" size="18" />
          <span>PIA Marketplace</span>
        </div>

        <h2 class="welcome-title">
          Belleza con más
          <span>oportunidades.</span>
        </h2>

        <p class="welcome-text">
          Conectamos profesionales de la belleza con más personas,
          más clientes y nuevas oportunidades.
        </p>

        <!-- BENEFICIOS -->
        <div class="benefits">

          <div class="benefit">
            <div class="benefit-icon">
              <v-icon icon="mdi-eye-outline" />
            </div>

            <div>
              <strong>Más visibilidad</strong>
              <span>Haz crecer tu negocio</span>
            </div>
          </div>

          <div class="benefit">
            <div class="benefit-icon">
              <v-icon icon="mdi-account-group-outline" />
            </div>

            <div>
              <strong>Más clientes</strong>
              <span>Conecta con nuevas personas</span>
            </div>
          </div>

          <div class="benefit">
            <div class="benefit-icon">
              <v-icon icon="mdi-heart-outline" />
            </div>

            <div>
              <strong>Más oportunidades</strong>
              <span>Forma parte de nuestra comunidad</span>
            </div>
          </div>

        </div>

      </div>

      <!-- FRASE -->
      <div class="welcome-phrase">
        <span>La belleza</span>
        <strong>también transforma.</strong>
        <v-icon icon="mdi-heart-outline" size="20" />
      </div>

    </section>

    <!-- =========================
           LOGIN
      ========================== -->
    <section class="login-section">

      <v-card class="login-card" elevation="16" rounded="xl">

        <!-- AVATAR PIA -->
        <div class="avatar-wrapper">
          <div class="avatar-ring">
            <img src="/images/pia/pia-avatar.png" alt="PIA" class="pia-avatar" />
          </div>
        </div>

        <!-- ENCABEZADO -->
        <div class="login-header text-center">

          <div class="pia-logo">
            PIA
          </div>

          <p class="pia-description">
            Marketplace de profesionales
            <br />
            de la belleza
          </p>

          <div class="logo-line"></div>

          <h1 class="login-title">
            Iniciar sesión
          </h1>

          <p class="login-subtitle">
            Ingresa con tu teléfono y contraseña
            <br class="desktop-only" />
            para continuar.
          </p>

        </div>

        <!-- FORMULARIO -->
        <v-card-text class="login-form">

          <v-form @submit.prevent="iniciarSesion">

            <!-- TELÉFONO -->
            <v-text-field v-model="form.telefono" label="Teléfono" placeholder="Ingresa tu número" prepend-inner-icon="mdi-phone-outline" variant="outlined" density="comfortable" class="login-field" :disabled="loading" required hide-details="auto" />

            <!-- CONTRASEÑA -->
            <v-text-field v-model="form.password" label="Contraseña" placeholder="Ingresa tu contraseña" prepend-inner-icon="mdi-lock-outline" :type="mostrarPassword ? 'text' : 'password'" :append-inner-icon="
                  mostrarPassword
                    ? 'mdi-eye-off-outline'
                    : 'mdi-eye-outline'
                " variant="outlined" density="comfortable" class="login-field" :disabled="loading" required hide-details="auto" @click:append-inner="
                  mostrarPassword = !mostrarPassword
                " />

            <!-- ERROR -->
            <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-5">
              {{ error }}
            </v-alert>

            <!-- BOTÓN -->
            <v-btn type="submit" color="primary" size="large" block rounded="lg" class="login-button" :loading="loading" :disabled="
                  !form.telefono ||
                  !form.password
                ">
              <template #default>
                Ingresar

                <v-icon end icon="mdi-arrow-right" />
              </template>
            </v-btn>

          </v-form>

        </v-card-text>

        <!-- SEPARADOR -->
        <div class="footer-separator">
          <span></span>
          <v-icon icon="mdi-heart-outline" size="17" />
          <span></span>
        </div>

        <!-- PIE -->
        <div class="login-footer">

          <strong>
            PIA
          </strong>

          <span>
            Plataforma de profesionales de belleza
          </span>

          <small>
            Juntos hacemos crecer la belleza
          </small>

        </div>

      </v-card>

    </section>

  </div>

</v-container>
</template>

<script>
import {
  useAuthStore
} from "@/stores/auth.store";

export default {

  name: "LoginPage",

  data() {
    return {

      form: {
        telefono: "",
        password: "",
      },

      loading: false,
      error: "",
      mostrarPassword: false,

    };
  },

  methods: {

    async iniciarSesion() {

      this.error = "";
      this.loading = true;

      const authStore = useAuthStore();

      try {
        
        await authStore.login(
          this.form.telefono,
          this.form.password,
        );
        
        const rol = authStore.rol;

        switch (rol) {
          case "SUPERADMIN":
            await this.$router.push("/superadmin");
            break;

          case "ADMIN":
            await this.$router.push("/admin");
            break;

          case "CLIENTE":
            await this.$router.push("/cliente");
            break;

          default:            
            authStore.logout();
            this.error = "El usuario no tiene un rol válido.";
            break;
        }

      } catch (error) {

        console.error("❌ ERROR LOGIN COMPLETO:", error);

        console.log("📌 STATUS:", error.response?.status);
        console.log("📌 DATA:", error.response?.data);
        console.log("📌 MESSAGE:", error.response?.data?.message);
        console.log("📌 RESPONSE:", error.response);

        this.error =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.friendlyMessage ||
          "Credenciales inválidas";

      } finally {
        this.loading = false;
      }
    },

  },

};
</script>

<style scoped>
/* =====================================================
   PÁGINA
===================================================== */

.login-page {

  position: relative;

  min-height: 100vh;

  overflow: hidden;

  background:
    radial-gradient(circle at 5% 15%,
      rgba(var(--v-theme-primary), 0.10),
      transparent 32%),
    radial-gradient(circle at 95% 85%,
      rgba(var(--v-theme-primary), 0.12),
      transparent 35%),
    rgb(var(--v-theme-background));

}

/* =====================================================
   FORMAS DE FONDO
===================================================== */

.background-shape {

  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(2px);

}

.background-shape-1 {

  width: 500px;
  height: 500px;

  left: -280px;
  top: -180px;

  background:
    rgba(var(--v-theme-primary), 0.05);

}

.background-shape-2 {

  width: 450px;
  height: 450px;

  right: -220px;
  bottom: -200px;

  background:
    rgba(var(--v-theme-primary), 0.06);

}

/* =====================================================
   VOLVER
===================================================== */

.back-home {

  position: absolute;

  top: 24px;
  left: 28px;

  z-index: 20;

}

.back-button {

  font-weight: 500;

  text-transform: none;

  letter-spacing: 0;

}

/* =====================================================
   CONTENEDOR
===================================================== */

.login-container {

  position: relative;

  z-index: 5;

  width: min(1180px, 100%);

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 0.9fr) minmax(400px, 0.8fr);

  align-items: center;

  gap: 80px;

  padding:
    90px 35px 45px;

}

/* =====================================================
   PANEL IZQUIERDO
===================================================== */

.welcome-panel {

  padding: 30px 10px;

}

.welcome-content {

  max-width: 480px;

}

.welcome-badge {

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 8px 14px;

  border-radius: 30px;

  background:
    rgba(var(--v-theme-primary), 0.08);

  color:
    rgb(var(--v-theme-primary));

  font-size: 13px;

  font-weight: 600;

  margin-bottom: 24px;

}

.welcome-title {

  margin: 0;

  font-size: clamp(42px, 5vw, 64px);

  line-height: 1.03;

  font-weight: 800;

  letter-spacing: -2px;

}

.welcome-title span {

  display: block;

  color:
    rgb(var(--v-theme-primary));

}

.welcome-text {

  max-width: 450px;

  margin-top: 25px;

  font-size: 17px;

  line-height: 1.7;

  color:
    rgba(var(--v-theme-on-background), 0.62);

}

/* =====================================================
   BENEFICIOS
===================================================== */

.benefits {

  display: flex;

  flex-direction: column;

  gap: 22px;

  margin-top: 38px;

}

.benefit {

  display: flex;

  align-items: center;

  gap: 16px;

}

.benefit-icon {

  width: 48px;
  height: 48px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(var(--v-theme-primary), 0.09);

  color:
    rgb(var(--v-theme-primary));

}

.benefit div:last-child {

  display: flex;

  flex-direction: column;

  gap: 3px;

}

.benefit strong {

  font-size: 15px;

  font-weight: 700;

}

.benefit span {

  font-size: 13px;

  color:
    rgba(var(--v-theme-on-background), 0.55);

}

/* =====================================================
   FRASE
===================================================== */

.welcome-phrase {

  margin-top: 65px;

  display: flex;

  align-items: center;

  gap: 6px;

  font-size: 19px;

  font-style: italic;

  color:
    rgba(var(--v-theme-on-background), 0.55);

}

.welcome-phrase strong {

  color:
    rgb(var(--v-theme-primary));

}

/* =====================================================
   LOGIN SECTION
===================================================== */

.login-section {

  display: flex;

  justify-content: center;

}

/* =====================================================
   CARD
===================================================== */

.login-card {

  position: relative;

  width: 100%;

  max-width: 475px;

  padding-top: 62px;

  overflow: visible;

  background:
    rgba(var(--v-theme-surface), 0.96);

  backdrop-filter: blur(20px);

  border:
    1px solid rgba(var(--v-theme-on-surface), 0.06);

}

/* =====================================================
   AVATAR
===================================================== */

.avatar-wrapper {

  position: absolute;

  top: -82px;

  left: 50%;

  transform: translateX(-50%);

  z-index: 5;

}

.avatar-ring {

  width: 164px;
  height: 164px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgb(var(--v-theme-surface));

  border:
    6px solid rgb(var(--v-theme-surface));

  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.14);

  overflow: hidden;

}

.pia-avatar {

  width: 100%;
  height: 100%;

  /* object-fit: cover; */

  border-radius: 50%;

}

/* =====================================================
   HEADER
===================================================== */

.login-header {

  padding:
    0 38px 12px;

}

.pia-logo {

  font-size: 52px;

  line-height: 1;

  font-weight: 900;

  letter-spacing: 5px;

  color:
    rgb(var(--v-theme-primary));

}

.pia-description {

  margin-top: 8px;

  font-size: 14px;

  line-height: 1.5;

  color:
    rgba(var(--v-theme-on-surface), 0.55);

}

.logo-line {

  width: 42px;

  height: 3px;

  margin:
    18px auto 22px;

  border-radius: 20px;

  background:
    rgb(var(--v-theme-primary));

}

.login-title {

  margin: 0;

  font-size: 30px;

  font-weight: 750;

  letter-spacing: -0.5px;

}

.login-subtitle {

  margin-top: 8px;

  font-size: 14px;

  line-height: 1.6;

  color:
    rgba(var(--v-theme-on-surface), 0.58);

}

/* =====================================================
   FORMULARIO
===================================================== */

.login-form {

  padding:
    15px 38px 28px;

}

.login-field {

  margin-bottom: 17px;

}

.login-button {

  height: 54px;

  margin-top: 6px;

  font-size: 16px;

  font-weight: 700;

  text-transform: none;

  letter-spacing: 0;

}

/* =====================================================
   FOOTER
===================================================== */

.footer-separator {

  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    0 38px;

}

.footer-separator span {

  flex: 1;

  height: 1px;

  background:
    rgba(var(--v-theme-on-surface), 0.08);

}

.footer-separator .v-icon {

  color:
    rgb(var(--v-theme-primary));

}

.login-footer {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;

  padding:
    18px 25px 28px;

  text-align: center;

}

.login-footer strong {

  font-size: 13px;

  color:
    rgb(var(--v-theme-primary));

}

.login-footer span {

  font-size: 12px;

  color:
    rgba(var(--v-theme-on-surface), 0.48);

}

.login-footer small {

  margin-top: 2px;

  font-size: 11px;

  color:
    rgba(var(--v-theme-on-surface), 0.35);

}

/* =====================================================
   TABLET
===================================================== */

@media (max-width: 950px) {

  .login-container {

    grid-template-columns: 1fr;

    gap: 30px;

    max-width: 600px;

  }

  .welcome-panel {

    display: none;

  }

  .login-section {

    width: 100%;

  }

}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {

  .back-home {

    top: 10px;

    left: 10px;

  }

  .login-container {

    padding:
      80px 16px 30px;

  }

  .login-card {

    max-width: 100%;

    padding-top: 55px;

  }

  .avatar-wrapper {

    top: -65px;

  }

  .avatar-ring {

    width: 130px;

    height: 130px;

  }

  .login-header {

    padding:
      0 22px 10px;

  }

  .pia-logo {

    font-size: 43px;

  }

  .login-title {

    font-size: 26px;

  }

  .login-form {

    padding:
      15px 22px 25px;

  }

  .footer-separator {

    padding:
      0 22px;

  }

  .desktop-only {

    display: none;

  }

}
</style>
