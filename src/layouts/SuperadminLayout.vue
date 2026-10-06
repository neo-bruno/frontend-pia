<template>
<v-app>
  <v-navigation-drawer permanent>
    <v-list-item title="PIA" subtitle="Administración de plataforma" class="py-4" />

    <v-divider />

    <v-list nav>
      <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Inicio" to="/superadmin" />

      <v-list-item prepend-icon="mdi-file-document-check-outline" title="Comprobantes" to="/superadmin/comprobantes" />

      <!--
        <v-list-item
          prepend-icon="mdi-store-outline"
          title="Negocios"
          to="/superadmin/negocios"
        />

        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Clientes"
          to="/superadmin/clientes"
        />

        <v-list-item
          prepend-icon="mdi-account-cog-outline"
          title="Usuarios"
          to="/superadmin/usuarios"
        />

        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="Configuración"
          to="/superadmin/configuracion"
        />
        -->
    </v-list>
    
    <template #append>
      <v-divider />
  
      <v-list nav>
        <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" @click="cerrarSesion" />
      </v-list>
    </template>
  </v-navigation-drawer>


  <v-app-bar elevation="1">
    <v-toolbar-title>
      PIA · Superadmin
    </v-toolbar-title>

    <v-spacer />

    <v-chip color="primary">
      SUPERADMIN
    </v-chip>
  </v-app-bar>

  <v-main>
    <v-container>
      <h1>SUPERADMIN</h1>

      <router-view />
    </v-container>
  </v-main>
</v-app>
</template>

<script>
export default {
  name: "SuperadminLayout",

  methods: {
    cerrarSesion() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      this.$router.push({
        name: "login",
      });
    },
  },
};
</script>
