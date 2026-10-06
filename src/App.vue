<template>
<router-view />

<PiaAlert />
</template>

<script>
import PiaAlert from '@/components/PiaAlert.vue'

export default {
  name: 'App',

  components: {
    PiaAlert
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
/* @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Open+Sans:ital@0;1&display=swap'); */

body {
  font-family: "Nunito", sans-serif;
}

.swal2-container {
  z-index: 99999 !important;
}
</style>
