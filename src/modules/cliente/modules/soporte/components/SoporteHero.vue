<template>
<section class="soporte-hero">
  <div class="soporte-personaje">
    <img src="/images/pia/pia-character.png" alt="Asistente PIA" />
  </div>

  <div class="soporte-hero-texto">
    <h1>Ayuda y soporte</h1>

    <h2>¡Hola! ¿En qué podemos ayudarte?</h2>

    <div class="soporte-mensaje">
      <v-icon size="25">mdi-headset</v-icon>

      <p>
        Estamos aquí para ayudarte
        a disfrutar de PIA.
      </p>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: "SoporteHero",
};
</script>

<style lang="scss" scoped>
.soporte-hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 205px;
  overflow: hidden;
  margin-bottom: 18px;
  border-radius: 22px;
  background: linear-gradient(115deg, #008f9b, #00aaa4);
  color: white;
}

.soporte-personaje {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 48%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
  }
}

.soporte-hero-texto {
  position: relative;
  z-index: 2;
  width: 57%;
  margin-left: 43%;
  padding: 18px 12px 18px 4px;
  box-sizing: border-box;

  h1 {
    margin: 0 0 12px;
    color: white;
    font-size: 22px;
    line-height: 1.15;
    font-weight: 900;
  }

  h2 {
    margin: 0 0 14px;
    color: white;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 800;
  }
}

.soporte-mensaje {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px;
  border-radius: 16px;
  background: #c8f5ed;
  color: #006d70;

  p {
    margin: 0;
    font-size: 10px;
    line-height: 1.3;
    font-weight: 700;
  }
}

@media (max-width: 360px) {
  .soporte-hero {
    min-height: 185px;
  }

  .soporte-hero-texto h1 {
    font-size: 19px;
  }

  .soporte-hero-texto h2 {
    font-size: 12px;
  }
}
</style>
