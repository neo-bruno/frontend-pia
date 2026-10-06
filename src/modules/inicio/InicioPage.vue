<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <h1 class="text-h3 font-weight-bold">
          PIA
        </h1>

        <p class="text-body-1 mt-4">
          Marketplace para profesionales y negocios de belleza
        </p>

        <v-btn
          class="mt-6"
          color="primary"
          @click="probarBackend"
        >
          Probar Backend
        </v-btn>

        <div class="mt-6">
          {{ resultado }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { listarRoles } from './inicio.service'

export default {
  name: 'InicioPage',

  data() {
    return {
      resultado: '',
    }
  },

  methods: {
    async probarBackend() {
      try {
        const response = await listarRoles()

        this.resultado = JSON.stringify(response.data.data)
      } catch (error) {
        console.error(error)

        this.resultado = 'Error conectando con el backend'
      }
    },
  },
}
</script>