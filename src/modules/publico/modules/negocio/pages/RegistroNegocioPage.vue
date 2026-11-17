<template>
<v-container class="registro-container py-4">

  <!-- ================================================= -->
  <!-- TOOLBAR -->
  <!-- ================================================= -->

  <v-toolbar color="transparent" flat density="compact" class="registro-toolbar mb-3">
    <v-btn size="35" color="primary" variant="tonal" icon="mdi-undo" @click="$router.back()" />

    <v-toolbar-title class="text-center">
      <div class="registro-title">
        Registro tu negocio en PIA
      </div>

      <div class="registro-subtitle">
        Completa los 5 pasos para registrar tu negocio
      </div>
    </v-toolbar-title>

    <div class="toolbar-spacer"></div>
  </v-toolbar>

  <!-- ================================================= -->
  <!-- STEPPER -->
  <!-- ================================================= -->

  <v-card class="registro-card mx-auto" max-width="1100" elevation="2">

    <div class="stepper-wrapper pa-4">

      <div class="stepper">

        <div v-for="paso in pasos" :key="paso.numero" class="step" :class="{
              activo: pasoActual === paso.numero,
              completado: pasoActual > paso.numero
            }">

          <div class="step-circle">

            <v-icon v-if="pasoActual > paso.numero" size="18">
              mdi-check
            </v-icon>

            <span v-else>
              {{ paso.numero }}
            </span>

          </div>

          <div class="step-label">
            {{ paso.nombre }}
          </div>

        </div>

      </div>

    </div>

    <v-divider />

    <!-- ================================================= -->
    <!-- CONTENIDO DE LOS PASOS -->
    <!-- ================================================= -->

    <div class="pa-5 pa-md-8">

      <!-- ================================================= -->
      <!-- PASO 1 - NEGOCIO -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 1">

        <div class="section-header">

          <div class="section-icon">
            <v-icon>
              mdi-storefront-outline
            </v-icon>
          </div>

          <div>

            <div class="text-h6 font-weight-bold">
              Información del negocio
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Cuéntanos sobre tu negocio
            </div>

          </div>

        </div>

        <v-form ref="formNegocio" class="form-registro-minimal form-negocio mt-5" @submit.prevent>

          <!-- TIPO DE NEGOCIO: selector mediante panel inferior -->
          <v-text-field
            :model-value="tipoNegocioSeleccionado?.nombre || ''"
            label="(*) Tipo de negocio"
            placeholder="Toca para seleccionar"
            prepend-inner-icon="mdi-store-outline"
            append-inner-icon="mdi-chevron-down"
            variant="underlined"
            density="comfortable"
            readonly
            :rules="[reglas.requerido]"
            @click="abrirSelectorTipoNegocio"
            @click:append-inner="abrirSelectorTipoNegocio"
          />

          <div class="agregar-tipo">
            <span>¿No encuentras el tuyo?</span>
            <v-btn
              variant="text"
              color="primary"
              size="small"
              prepend-icon="mdi-plus"
              @click="abrirDialogoTipoNegocio"
            >
              Agregar nuevo tipo
            </v-btn>
          </div>

          <!-- DATOS PRINCIPALES -->
          <v-text-field
            v-model="form.negocio.nombre"
            label="(*) Nombre comercial"
            placeholder="Ej. Luna Studio"
            prepend-inner-icon="mdi-store"
            variant="underlined"
            density="comfortable"
            maxlength="150"
            :rules="[reglas.nombre]"
          />

          <v-text-field
            v-model="form.negocio.telefono"
            label="(*) Teléfono del negocio"
            placeholder="Ej. 70777777"
            prepend-inner-icon="mdi-phone-outline"
            variant="underlined"
            density="comfortable"
            maxlength="15"
            :rules="[reglas.telefono]"
          />

          <!-- UBICACIÓN -->
          <div class="form-subtitulo">Ubicación del negocio</div>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.negocio.departamento"
                label="(*) Departamento"
                placeholder="Selecciona"
                :items="departamentos"
                prepend-inner-icon="mdi-map-marker-outline"
                variant="underlined"
                density="comfortable"
                :rules="[reglas.requerido]"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.negocio.municipio"
                label="(*) Municipio/Localidad"
                placeholder="Ej. Cercado"
                prepend-inner-icon="mdi-map-marker"
                variant="underlined"
                density="comfortable"
                maxlength="150"
                :rules="[reglas.nombre]"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.negocio.zona"
            label="(*) Zona/Barrio"
            placeholder="Ej. Centro"
            prepend-inner-icon="mdi-map-outline"
            variant="underlined"
            density="comfortable"
            maxlength="150"
            :rules="[reglas.requerido]"
          />

          <v-text-field
            v-model="form.negocio.direccion"
            label="(*) Dirección del negocio"
            placeholder="Ej. Av. América N.º 123"
            prepend-inner-icon="mdi-home-map-marker"
            variant="underlined"
            density="comfortable"
            maxlength="255"
            :rules="[reglas.requerido]"
          />

        </v-form>

      </div>

      <!-- ================================================= -->
      <!-- PASO 2 - PROFESIONAL -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 2">

        <div class="section-header">

          <div class="section-icon">
            <v-icon>
              mdi-account-outline
            </v-icon>
          </div>

          <div>

            <div class="text-h6 font-weight-bold">
              Información del profesional
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Registra al profesional que representará tu negocio
            </div>

          </div>

        </div>

        <v-form ref="formProfesional" class="form-registro-minimal mt-5" @submit.prevent>

          <!-- TIPO PROFESIONAL -->

          <v-text-field
            :model-value="tipoProfesionalSeleccionado?.nombre || ''"
            label="(*) Tipo de profesional"
            placeholder="Toca para seleccionar"
            prepend-inner-icon="mdi-account-tie-outline"
            append-inner-icon="mdi-chevron-down"
            variant="underlined"
            density="comfortable"
            readonly
            :rules="[reglas.requerido]"
            @click="abrirSelectorTipoProfesional"
            @click:append-inner="abrirSelectorTipoProfesional"
          />

          <div class="agregar-tipo">

            <span>
              ¿No encuentras el tuyo?
            </span>

            <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-plus" @click="abrirDialogoTipoProfesional">
              Agregar nuevo tipo
            </v-btn>

          </div>

          <!-- NOMBRES -->

          <v-text-field v-model="form.profesional.nombres" label="(*) Nombres" placeholder="Ej. María Fernanda" variant="underlined" density="comfortable" maxlength="150" :rules="[reglas.nombre]" />

          <!-- APELLIDOS -->

          <v-text-field v-model="form.profesional.apellidos" label="(*) Apellidos" placeholder="Ej. López Sánchez" variant="underlined" density="comfortable" maxlength="150" :rules="[reglas.nombre]" />

          <!-- TELÉFONO -->

          <v-text-field v-model="form.profesional.telefono" label="(*) Teléfono personal" placeholder="Ej. 71234567" variant="underlined" density="comfortable" maxlength="15" :rules="[reglas.telefono]" />

          <!-- SEXO / FECHA -->

          <v-row>

            <v-col cols="12" sm="6">

              <v-select v-model="form.profesional.sexo" label="(*) Sexo" placeholder="Selecciona" :items="sexos" variant="underlined" density="comfortable" :rules="[reglas.sexo]" />

            </v-col>

            <v-col cols="12" sm="6">

              <v-text-field v-model="form.profesional.fecha_nacimiento" label="(*) Fecha de nacimiento" type="date" variant="underlined" density="comfortable" :rules="[reglas.fecha]" />

            </v-col>

          </v-row>

          <!-- PASSWORD -->

          <v-text-field v-model="form.profesional.password" label="(*) Contraseña de acceso" placeholder="Mínimo 6 caracteres" prepend-inner-icon="mdi-lock-outline" :type="mostrarPassword?'text' : 'password'" :append-inner-icon="
                mostrarPassword
                 ?'mdi-eye-off-outline'
                  : 'mdi-eye-outline'
              " @click:append-inner="
                mostrarPassword = !mostrarPassword
              " variant="underlined" density="comfortable" :rules="[reglas.password]" />

        </v-form>

      </div>

      <!-- ================================================= -->
      <!-- PASO 3 - MEMBRESÍA -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 3">

        <div class="section-header">

          <div class="section-icon">
            <v-icon>
              mdi-crown-outline
            </v-icon>
          </div>

          <div>

            <div class="text-h6 font-weight-bold">
              Plan de membresía
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Selecciona cuándo comenzará tu membresía
            </div>

          </div>

        </div>

        <v-card class="plan-card mt-6" variant="outlined">

          <div class="text-subtitle-1 font-weight-bold">
            Plan mensual PIA
          </div>

          <div class="plan-price mt-2">
            Bs. {{ gerencia.monto }}
            <span>/ mes</span>
          </div>

          <div class="mt-4">

            <div class="beneficio">
              <v-icon size="18">
                mdi-check
              </v-icon>

              Publicación de tu negocio
            </div>

            <div class="beneficio">
              <v-icon size="18">
                mdi-check
              </v-icon>

              Gestión de servicios
            </div>

            <div class="beneficio">
              <v-icon size="18">
                mdi-check
              </v-icon>

              Gestión de reservas
            </div>

            <div class="beneficio">
              <v-icon size="18">
                mdi-check
              </v-icon>

              Presencia dentro de PIA
            </div>

          </div>

        </v-card>

        <v-form ref="formMembresia" class="form-registro-minimal mt-5" @submit.prevent>

          <v-text-field v-model="membresia.fecha_inicio" label="Fecha de inicio" type="date" variant="underlined" density="comfortable" :rules="[reglas.fecha]" />

        </v-form>

        <v-alert class="mt-4" variant="tonal" type="success">

          <div class="text-body-2">
            Tu membresía será válida hasta:
          </div>

          <div class="font-weight-bold mt-1">
            {{ fechaFinFormateada }}

            <span class="text-caption ml-2">
              (1 mes)
            </span>
          </div>

        </v-alert>

        <v-card class="mt-4 pa-4" variant="outlined">

          <div class="text-body-2 text-medium-emphasis">
            Total a pagar
          </div>

          <div class="text-h5 font-weight-bold text-primary mt-1">
            Bs. {{ membresia.monto }}
          </div>

        </v-card>

      </div>

      <!-- ================================================= -->
      <!-- PASO 4 - PAGO -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 4">

        <div class="section-header">

          <div class="section-icon">
            <v-icon>
              mdi-credit-card-outline
            </v-icon>
          </div>

          <div>

            <div class="text-h6 font-weight-bold">
              Realiza el pago
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Realiza el pago de tu membresía
            </div>

          </div>

        </div>

        <v-form ref="formPago" class="form-registro-minimal pago-container mt-5" @submit.prevent>

          <div class="text-body-2 text-center mb-4">
            Escanea el código QR de Gerencia PIA
            para realizar el pago.
          </div>

          <!-- QR -->
          <div class="d-flex justify-end mb-2">
            <v-btn
              variant="text"
              size="small"
              color="primary"
              prepend-icon="mdi-download"
              @click="descargarQR"
            >
              Descargar QR
            </v-btn>
          </div>

          <div class="qr-container">            
            <v-img :src="urlQrGerencia(gerencia.url)" cover></v-img>
          </div>

          <!-- MONTO -->

          <div class="text-center mt-4">

            <div class="text-body-2 text-medium-emphasis">
              Monto a pagar
            </div>

            <div class="text-h5 font-weight-bold text-primary">
              Bs. {{ membresia.monto }}
            </div>

          </div>

          <!-- COMPROBANTE -->

          <v-file-input v-model="form.pago.comprobante" label="Comprobante de pago" hint="Imagen o PDF" persistent-hint accept="image/*,.pdf" prepend-icon="mdi-cloud-upload-outline" variant="underlined" density="comfortable" :rules="[reglas.archivo]" />

          <v-alert class="mt-4" variant="tonal" type="info">
            El comprobante será revisado por
            la Gerencia PIA antes de activar
            tu membresía.
          </v-alert>

        </v-form>

      </div>

      <!-- ================================================= -->
      <!-- PASO 5 - FINALIZAR -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 5" class="finalizar-container">

        <div class="success-icon">

          <v-icon size="55">
            mdi-check
          </v-icon>

        </div>

        <div class="text-h5 font-weight-bold mt-6">
          ¡Registro enviado!
        </div>

        <div class="text-body-1 text-medium-emphasis mt-3">
          Tu negocio y profesional fueron
          registrados correctamente.
        </div>

        <v-alert class="mt-6" variant="tonal" type="success">
          Tu comprobante de pago está pendiente
          de validación por la Gerencia PIA.
        </v-alert>

        <div class="text-body-2 text-medium-emphasis mt-5">
          Te notificaremos cuando tu membresía
          sea activada.
        </div>

      </div>

      <!-- ================================================= -->
      <!-- BOTONES -->
      <!-- ================================================= -->

      <div v-if="pasoActual < 5" class="acciones mt-8">

        <v-btn v-if="pasoActual > 1" variant="outlined" size="large" @click="anterior">
          Atrás
        </v-btn>

        <v-spacer />

        <v-btn color="primary" size="large" min-width="150" @click="siguiente">

          <span v-if="pasoActual < 4">
            Continuar
          </span>

          <span v-else>
            Finalizar
          </span>

          <v-icon end>
            mdi-arrow-right
          </v-icon>

        </v-btn>

      </div>

    </div>

  </v-card>

  <!-- ================================================= -->
  <!-- INFORMACIÓN DE LOS 5 PASOS -->
  <!-- ================================================= -->

  <div class="como-funciona mx-auto mt-8" style="max-width: 1100px;">

    <div class="text-h6 font-weight-bold mb-5">
      ¿Cómo funciona el registro?
    </div>

    <v-row>

      <v-col v-for="paso in pasos" :key="paso.numero" cols="12" sm="6" md="4">

        <div class="funciona-item">

          <div class="funciona-icon">

            <v-icon size="22">
              {{ paso.icono }}
            </v-icon>

          </div>

          <div>

            <div class="font-weight-bold">
              {{ paso.numero }}. {{ paso.nombre }}
            </div>

            <div class="text-caption text-medium-emphasis mt-1">
              {{ paso.descripcion }}
            </div>

          </div>

        </div>

      </v-col>

    </v-row>

  </div>
 
  <!-- ================================================= -->
  <!-- SELECTOR DE TIPO DE NEGOCIO -->
  <!-- ================================================= -->
  <v-bottom-sheet v-model="sheetTipoNegocio" scrollable>
    <v-card class="sheet-tipos-negocio">
      <div class="sheet-tipos-header">
        <div>
          <div class="text-subtitle-1 font-weight-bold">¿Qué tipo de negocio tienes?</div>
          <div class="text-caption text-medium-emphasis">Selecciona la categoría que mejor te representa</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar" @click="sheetTipoNegocio = false" />
      </div>

      <v-card-text class="pt-2">
        <v-text-field
          v-model="busquedaTipoNegocio"
          placeholder="Buscar tipo de negocio..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          density="comfortable"
          hide-details
          clearable
          class="mb-3"
        />

        <div v-if="tiposNegocioFiltrados.length" class="sheet-tipos-grid">
          <button
            v-for="tipo in tiposNegocioFiltrados"
            :key="tipo.id"
            type="button"
            class="sheet-tipo-opcion"
            :class="{ 'sheet-tipo-opcion--activo': Number(form.negocio.tipo_negocio_id) === Number(tipo.id) }"
            @click="seleccionarTipoNegocio(tipo)"
          >
            <span class="sheet-tipo-icono">
              <v-icon :icon="tipo.icono || 'mdi-store-outline'" size="23" />
            </span>
            <span class="sheet-tipo-nombre">{{ tipo.nombre }}</span>
            <v-icon
              v-if="Number(form.negocio.tipo_negocio_id) === Number(tipo.id)"
              class="sheet-tipo-check"
              icon="mdi-check-circle"
              size="18"
            />
          </button>
        </div>

        <div v-else class="text-center text-body-2 text-medium-emphasis py-8">
          No encontramos tipos de negocio con ese nombre.
        </div>

        <v-btn
          block
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          class="mt-3"
          @click="sheetTipoNegocio = false; abrirDialogoTipoNegocio()"
        >
          No encuentro mi tipo de negocio
        </v-btn>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>

  <!-- ================================================= -->
  <!-- SELECTOR DE TIPO DE PROFESIONAL -->
  <!-- ================================================= -->
  <v-bottom-sheet v-model="sheetTipoProfesional" scrollable>
    <v-card class="sheet-tipos-negocio">
      <div class="sheet-tipos-header">
        <div>
          <div class="text-subtitle-1 font-weight-bold">¿Qué tipo de profesional eres?</div>
          <div class="text-caption text-medium-emphasis">Selecciona la especialidad que mejor te representa</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar" @click="sheetTipoProfesional = false" />
      </div>

      <v-card-text class="pt-2">
        <v-text-field
          v-model="busquedaTipoProfesional"
          placeholder="Buscar tipo de profesional..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          density="comfortable"
          hide-details
          clearable
          class="mb-3"
        />

        <div v-if="tiposProfesionalFiltrados.length" class="sheet-tipos-grid">
          <button
            v-for="tipo in tiposProfesionalFiltrados"
            :key="tipo.id"
            type="button"
            class="sheet-tipo-opcion"
            :class="{ 'sheet-tipo-opcion--activo': Number(form.profesional.tipo_profesional_id) === Number(tipo.id) }"
            @click="seleccionarTipoProfesional(tipo)"
          >
            <span class="sheet-tipo-icono">
              <v-icon icon="mdi-account-tie-outline" size="23" />
            </span>
            <span class="sheet-tipo-nombre">{{ tipo.nombre }}</span>
            <v-icon
              v-if="Number(form.profesional.tipo_profesional_id) === Number(tipo.id)"
              class="sheet-tipo-check"
              icon="mdi-check-circle"
              size="18"
            />
          </button>
        </div>

        <div v-else class="text-center text-body-2 text-medium-emphasis py-8">
          No encontramos tipos de profesional con ese nombre.
        </div>

        <v-btn
          block
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          class="mt-3"
          @click="sheetTipoProfesional = false; abrirDialogoTipoProfesional()"
        >
          No encuentro mi tipo de profesional
        </v-btn>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>

  <!-- ================================================= -->
  <!-- SELECTOR DE TIPO DE PROFESIONAL -->
  <!-- ================================================= -->
  <v-bottom-sheet v-model="sheetTipoProfesional" scrollable>
    <v-card class="sheet-tipos-negocio">
      <div class="sheet-tipos-header">
        <div>
          <div class="text-subtitle-1 font-weight-bold">¿Qué tipo de profesional eres?</div>
          <div class="text-caption text-medium-emphasis">Selecciona la especialidad que mejor te representa</div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar" @click="sheetTipoProfesional = false" />
      </div>

      <v-card-text class="pt-2">
        <v-text-field
          v-model="busquedaTipoProfesional"
          placeholder="Buscar tipo de profesional..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          density="comfortable"
          hide-details
          clearable
          class="mb-3"
        />

        <div v-if="tiposProfesionalFiltrados.length" class="sheet-tipos-grid">
          <button
            v-for="tipo in tiposProfesionalFiltrados"
            :key="tipo.id"
            type="button"
            class="sheet-tipo-opcion"
            :class="{ 'sheet-tipo-opcion--activo': Number(form.profesional.tipo_profesional_id) === Number(tipo.id) }"
            @click="seleccionarTipoProfesional(tipo)"
          >
            <span class="sheet-tipo-icono">
              <v-icon icon="mdi-account-tie-outline" size="23" />
            </span>
            <span class="sheet-tipo-nombre">{{ tipo.nombre }}</span>
            <v-icon
              v-if="Number(form.profesional.tipo_profesional_id) === Number(tipo.id)"
              class="sheet-tipo-check"
              icon="mdi-check-circle"
              size="18"
            />
          </button>
        </div>

        <div v-else class="text-center text-body-2 text-medium-emphasis py-8">
          No encontramos tipos de profesional con ese nombre.
        </div>

        <v-btn
          block
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          class="mt-3"
          @click="sheetTipoProfesional = false; abrirDialogoTipoProfesional()"
        >
          No encuentro mi tipo de profesional
        </v-btn>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>

  <!-- ================================================= -->
  <!-- DIALOGO - NUEVO TIPO DE NEGOCIO -->
  <!-- ================================================= -->

  <v-dialog
    v-model="dialogoTipoNegocio"
    max-width="450"
    width="calc(100% - 24px)"
    scrollable
  >
    <v-card class="dialogo-tipo-card">

      <!-- ENCABEZADO -->
      <v-card-title class="dialogo-tipo-header">
        <div class="dialogo-tipo-header-icon">
          <v-icon size="28">mdi-store-plus-outline</v-icon>
        </div>

        <div class="flex-grow-1">
          <div class="text-h6 font-weight-bold">
            Nuevo tipo de negocio
          </div>

          <div class="dialogo-tipo-subtitulo">
            Personaliza la categoría de tu negocio
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          size="small"
          aria-label="Cerrar"
          @click="cerrarDialogoTipoNegocio"
        />
      </v-card-title>

      <!-- FORMULARIO -->
      <v-card-text class="dialogo-tipo-contenido">

        <v-form
          ref="formTipoNegocio"
          @submit.prevent
        >
          <!-- NOMBRE -->
          <v-text-field
            v-model="nuevoTipoNegocio.nombre"
            autofocus
            label="(*) Nombre"
            placeholder="Ej. Barbería"
            prepend-inner-icon="mdi-store-outline"
            variant="outlined"
            density="comfortable"
            maxlength="100"
            counter="100"
            :rules="[reglas.requerido, reglas.tipoNombre]"
          />

          <!-- DESCRIPCIÓN -->
          <v-textarea
            v-model="nuevoTipoNegocio.descripcion"
            label="Descripción"
            placeholder="Describe el tipo de negocio"
            prepend-inner-icon="mdi-text"
            variant="outlined"
            density="comfortable"
            maxlength="255"
            counter="255"
            rows="3"
            auto-grow
          />

          <!-- SELECCIÓN DE ICONO -->
          <div class="selector-iconos-negocio">

            <div class="selector-iconos-titulo">
              <div class="selector-iconos-titulo-icono">
                <v-icon size="20">mdi-palette-outline</v-icon>
              </div>

              <div>
                <div class="text-subtitle-1 font-weight-bold">
                  Elige un icono
                </div>

                <div class="text-caption text-medium-emphasis">
                  Representará a este tipo de negocio
                </div>
              </div>
            </div>

            <v-item-group
              v-model="nuevoTipoNegocio.icono"
              mandatory
            >
              <div class="iconos-negocio-grid">

                <v-item
                  v-for="icono in iconosNegocio"
                  :key="icono.value"
                  :value="icono.value"
                  v-slot="{ selected, toggle }"
                >
                  <v-card
                    class="icono-negocio-card"
                    :class="{
                      'icono-negocio-card--selected': selected
                    }"
                    variant="flat"
                    rounded="xl"
                    @click="toggle"
                  >
                    <div class="icono-negocio-figura">
                      <v-icon
                        size="27"
                        :icon="icono.value"
                      />
                    </div>

                    <span class="icono-negocio-label">
                      {{ icono.label }}
                    </span>

                    <v-icon
                      v-if="selected"
                      class="icono-negocio-check"
                      icon="mdi-check-circle"
                      size="17"
                    />
                  </v-card>
                </v-item>

              </div>
            </v-item-group>

            <!-- ICONO SELECCIONADO -->
            <div
              v-if="nuevoTipoNegocio.icono"
              class="icono-negocio-seleccionado"
            >
              <v-icon color="primary" size="20">
                {{ nuevoTipoNegocio.icono }}
              </v-icon>

              <span>
                Icono seleccionado:
                <strong>{{ nuevoTipoNegocio.icono }}</strong>
              </span>
            </div>

          </div>
        </v-form>

      </v-card-text>

      <!-- BOTONES -->
      <v-card-actions class="dialogo-tipo-acciones">

        <v-btn
          prepend-icon="mdi-close"
          color="error"
          variant="outlined"
          @click="cerrarDialogoTipoNegocio"
        >
          Cancelar
        </v-btn>

        <v-spacer />

        <v-btn
          variant="elevated"
          class="btn-guardar-tipo"
          prepend-icon="mdi-content-save"
          color="primary"
          @click="guardarTipoNegocio"
        >
          Guardar
        </v-btn>

      </v-card-actions>

    </v-card>
  </v-dialog>


  <!-- ================================================= -->
  <!-- DIALOGO - NUEVO TIPO DE PROFESIONAL -->
  <!-- ================================================= -->
  <v-dialog
    v-model="dialogoTipoProfesional"
    max-width="450"
    width="calc(100% - 24px)"
    scrollable
  >
    <v-card class="dialogo-tipo-card">
      <v-card-title class="dialogo-tipo-header">
        <div class="dialogo-tipo-header-icon">
          <v-icon size="28">mdi-account-plus-outline</v-icon>
        </div>

        <div class="flex-grow-1">
          <div class="text-h6 font-weight-bold">Nuevo tipo de profesional</div>
          <div class="dialogo-tipo-subtitulo">
            Añade una especialidad para identificar tu experiencia
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          size="small"
          aria-label="Cerrar"
          @click="cerrarDialogoTipoProfesional"
        />
      </v-card-title>

      <v-card-text class="dialogo-tipo-contenido">
        <div class="dialogo-form-intro">
          <div class="dialogo-form-intro-icon">
            <v-icon size="21">mdi-lightbulb-on-outline</v-icon>
          </div>
          <div>
            <div class="dialogo-form-intro-title">Cuéntanos la especialidad</div>
            <div class="dialogo-form-intro-text">
              Escribe un nombre claro para que los clientes puedan reconocerte.
            </div>
          </div>
        </div>

        <v-form ref="formTipoProfesional" @submit.prevent>
          <v-text-field
            v-model="nuevoTipoProfesional.nombre"
            autofocus
            label="(*) Nombre de la especialidad"
            placeholder="Ej. Estilista, colorista, manicurista"
            prepend-inner-icon="mdi-account-tie-outline"
            variant="underlined"
            density="comfortable"
            maxlength="100"
            counter="100"
            :rules="[reglas.tipoNombre]"
          />

          <v-textarea
            v-model="nuevoTipoProfesional.descripcion"
            label="Descripción"
            placeholder="Describe brevemente esta especialidad y los servicios que realiza"
            prepend-inner-icon="mdi-text"
            variant="underlined"
            density="comfortable"
            maxlength="255"
            counter="255"
            rows="3"
            auto-grow
            class="mt-3"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="dialogo-tipo-acciones">
        <v-btn
          prepend-icon="mdi-close"
          color="error"
          variant="outlined"
          @click="cerrarDialogoTipoProfesional"
        >
          Cancelar
        </v-btn>

        <v-spacer />

        <v-btn
          variant="elevated"
          class="btn-guardar-tipo"
          prepend-icon="mdi-content-save"
          color="primary"
          @click="guardarTipoProfesional"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</v-container>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>

</template>

<script>
import { urlQrGerencia } from '@/utils/ayuda';
import { piaAlert } from '@/services/piaAlert';
import { getManagement } from '../../gerencia/services/gerencia.api';
import { getProfessionalsTypes } from '../../profesional/services/profesional.api';
import { saveBusinessProfession } from '../services/negocio.api';
import { getBusinessTypes } from '../services/tipoNegocio.api';

export default {
  name: "RegistroNegocioPage",

  data() {
    return {
      reglas: {
        requerido: (value) => {
          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {
            return "Este campo es obligatorio";
          }

          if (
            typeof value === "string" &&
            !value.trim()
          ) {
            return "Este campo es obligatorio";
          }

          return true;
        },

        nombre: (value) => {
          if (
            value === null ||
            value === undefined ||
            !String(value).trim()
          ) {
            return "Este campo es obligatorio";
          }

          const texto = String(value).trim();

          if (texto.length < 2) {
            return "Debe tener al menos 2 caracteres";
          }

          if (texto.length > 150) {
            return "No puede superar los 150 caracteres";
          }

          return true;
        },

        tipoNombre: (value) => {
          if (
            value === null ||
            value === undefined ||
            !String(value).trim()
          ) {
            return "El nombre es obligatorio";
          }

          const texto = String(value).trim();

          if (texto.length < 3) {
            return "Debe tener al menos 3 caracteres";
          }

          if (texto.length > 100) {
            return "No puede superar los 100 caracteres";
          }

          return true;
        },

        telefono: (value) => {
          if (
            value === null ||
            value === undefined ||
            !String(value).trim()
          ) {
            return "El teléfono es obligatorio";
          }

          const telefono = String(value).replace(
            /\D/g,
            ""
          );

          if (
            telefono.length < 7 ||
            telefono.length > 15
          ) {
            return "Ingresa un teléfono válido";
          }

          return true;
        },

        password: (value) => {
          if (!value) {
            return "La contraseña es obligatoria";
          }

          if (value.length < 6) {
            return "Debe tener al menos 6 caracteres";
          }

          return true;
        },

        sexo: (value) => {
          if (!value) {
            return "Selecciona el sexo";
          }

          return true;
        },

        fecha: (value) => {
          if (!value) {
            return "La fecha es obligatoria";
          }

          return true;
        },

        archivo: (value) => {
          if (!value) {
            return "Debes subir el comprobante";
          }

          return true;
        },
      },
      
      // ============================================
      // PASO ACTUAL
      // ============================================

      pasoActual: 1,

      pasos: [{
          numero: 1,
          nombre: "Negocio",
          icono: "mdi-storefront-outline",
          descripcion: "Registra la información de tu negocio",
        },
        {
          numero: 2,
          nombre: "Profesional",
          icono: "mdi-account-outline",
          descripcion: "Registra al profesional principal",
        },
        {
          numero: 3,
          nombre: "Membresía",
          icono: "mdi-crown-outline",
          descripcion: "Selecciona el inicio de tu membresía",
        },
        {
          numero: 4,
          nombre: "Pago",
          icono: "mdi-credit-card-outline",
          descripcion: "Realiza el pago y adjunta el comprobante",
        },
        {
          numero: 5,
          nombre: "Finalizar",
          icono: "mdi-check-circle-outline",
          descripcion: "Envía tu registro a PIA",
        },
      ],

      // ============================================
      // DATOS DE GERENCIA
      // ============================================
      gerencia: {},

      // ============================================
      // DATOS DEL REGISTRO
      // ============================================

      form: {
        negocio: {
          tipo_negocio_id: null,
          nombre: "",
          telefono: "",
          departamento: null,
          municipio: null,
          zona: "",
          direccion: "",
          tipo_negocio: null
        },

        profesional: {
          tipo_profesional_id: null,
          nombres: "",
          apellidos: "",
          telefono: "",
          sexo: 'MASCULINO',
          fecha_nacimiento: "",
          password: "",
          tipo_profesional: null
        },

        pago: {
          comprobante: null,
        },
      },

      // ============================================
      // MEMBRESÍA
      // ============================================

      membresia: {
        fecha_inicio: "",
        monto: 10,
      },

      // ============================================
      // DATOS AUXILIARES
      // ============================================
      tiposNegocio: [],
      tiposProfesional: [],
      sheetTipoNegocio: false,
      busquedaTipoNegocio: "",
      sheetTipoProfesional: false,
      busquedaTipoProfesional: "",
      
      iconosNegocio: [
        { label: "Salón", value: "mdi-face-woman" },
        { label: "Barbería", value: "mdi-content-cut" },
        { label: "Belleza", value: "mdi-star-four-points" },
        { label: "Spa", value: "mdi-spa" },
        { label: "Uñas", value: "mdi-palette" },
        { label: "Pestañas", value: "mdi-eye-outline" },
        { label: "Estética", value: "mdi-face-woman" },
        { label: "Cosmética", value: "mdi-flower" },
        { label: "Depilación", value: "mdi-flash" },
        { label: "Masajes", value: "mdi-hand-heart" },
        { label: "Tatuajes", value: "mdi-needle" },
        { label: "Tienda", value: "mdi-store" },
        { label: "Academia", value: "mdi-school" },
        { label: "Bienestar", value: "mdi-heart-pulse" },
        { label: "Cabello", value: "mdi-water" },
        { label: "Otros", value: "mdi-shape-outline" },
      ],

      departamentos: [
        "Cochabamba",
        "La Paz",
        "Santa Cruz",
        "Oruro",
        "Potosí",
        "Chuquisaca",
        "Tarija",
        "Beni",
        "Pando",
      ],

      sexos: [{
          title: "Masculino",
          value: "MASCULINO",
        },
        {
          title: "Femenino",
          value: "FEMENINO",
        },
      ],

      // ============================================
      // DIALOGOS
      // ============================================

      dialogoTipoNegocio: false,

      dialogoTipoProfesional: false,

      nuevoTipoNegocio: {
        id: 0,
        nombre: "",
        descripcion: "",
        icono: "mdi-store-outline",
      },

      nuevoTipoProfesional: {
        id: 0,
        nombre: "",
        descripcion: "",
      },

      // ============================================
      // UI
      // ============================================

      mostrarPassword: false,

      guardando: false,

      overlay: false,
    };
  },

  computed: {
    tipoNegocioSeleccionado() {
      return this.tiposNegocio.find(
        (tipo) => Number(tipo.id) === Number(this.form.negocio.tipo_negocio_id)
      ) || null;
    },

    tiposNegocioFiltrados() {
      const busqueda = String(this.busquedaTipoNegocio || "").trim().toLocaleLowerCase("es");
      if (!busqueda) return this.tiposNegocio;

      return this.tiposNegocio.filter((tipo) =>
        String(tipo.nombre || "").toLocaleLowerCase("es").includes(busqueda)
      );
    },

    tipoProfesionalSeleccionado() {
      return this.tiposProfesional.find(
        (tipo) => Number(tipo.id) === Number(this.form.profesional.tipo_profesional_id)
      ) || null;
    },

    tiposProfesionalFiltrados() {
      const busqueda = String(this.busquedaTipoProfesional || "").trim().toLocaleLowerCase("es");
      if (!busqueda) return this.tiposProfesional;

      return this.tiposProfesional.filter((tipo) =>
        String(tipo.nombre || "").toLocaleLowerCase("es").includes(busqueda)
      );
    },

    // ============================================
    // FECHA FIN DE MEMBRESÍA
    // ============================================

    fechaFin() {
      if (!this.membresia.fecha_inicio) {
        return null;
      }

      const fecha = new Date(
        `${this.membresia.fecha_inicio}T00:00:00`
      );

      if (Number.isNaN(fecha.getTime())) {
        return null;
      }

      fecha.setMonth(fecha.getMonth() + 1);

      return fecha;
    },

    // ============================================
    // FECHA FIN FORMATEADA
    // ============================================

    fechaFinFormateada() {
      if (!this.fechaFin) {
        return "Selecciona una fecha de inicio";
      }

      return this.fechaFin.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },

  watch: {
    // ============================================
    // CUANDO CAMBIA LA FECHA DE INICIO
    // ============================================

    "membresia.fecha_inicio"(valor) {
      if (!valor) {
        return;
      }

      console.log(
        "📅 Fecha inicio membresía:",
        valor
      );

      console.log(
        "📅 Fecha fin membresía:",
        this.fechaFinFormateada
      );
    },

    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },

  },

  methods: {    
    urlQrGerencia,

    // ==================================================
    // DESCARGAR QR
    // ==================================================
    descargarQR() {
      const url = urlQrGerencia(this.gerencia.url);

      const link = document.createElement("a");
      link.href = url;
      link.download = "QR-Pago-PIA.png";
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // ==================================================
    // SIGUIENTE
    // ==================================================

    async siguiente() {
      let formulario = null;

      if (this.pasoActual === 1) {
        formulario = this.$refs.formNegocio;
      }

      if (this.pasoActual === 2) {
        formulario = this.$refs.formProfesional;
      }

      if (this.pasoActual === 3) {
        formulario = this.$refs.formMembresia;
      }

      if (this.pasoActual === 4) {
        formulario = this.$refs.formPago;
      }

      // ------------------------------------------
      // VALIDAR FORMULARIO
      // ------------------------------------------

      if (formulario) {
        const resultado = await formulario.validate();

        if (!resultado.valid) {
          console.log("❌ El formulario tiene errores");

          await this.$nextTick();

          setTimeout(() => {
            const primerError = document.querySelector(
              ".v-input--error"
            );

            if (primerError) {
              primerError.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 100);

          return;
        }
      }

      // ------------------------------------------
      // SI ES EL PASO 4
      // ------------------------------------------

      if (this.pasoActual === 4) {
        await this.finalizarRegistro();
        return;
      }

      // ------------------------------------------
      // AVANZAR
      // ------------------------------------------

      if (this.pasoActual < 5) {
        this.pasoActual++;
      }

      // ------------------------------------------
      // SUBIR AL INICIO DEL NUEVO PASO
      // ------------------------------------------

      await this.$nextTick();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    // ==================================================
    // ANTERIOR
    // ==================================================

    anterior() {
      if (this.pasoActual > 1) {
        this.pasoActual--;
      }
    },

    // ==================================================
    // SELECTOR TIPO DE NEGOCIO
    // ==================================================

    abrirSelectorTipoNegocio() {
      this.busquedaTipoNegocio = "";
      this.sheetTipoNegocio = true;
    },

    seleccionarTipoNegocio(tipo) {
      this.form.negocio.tipo_negocio_id = tipo.id;
      this.form.negocio.tipo_negocio = tipo;
      this.sheetTipoNegocio = false;
      this.busquedaTipoNegocio = "";
    },

    abrirSelectorTipoProfesional() {
      this.busquedaTipoProfesional = "";
      this.sheetTipoProfesional = true;
    },

    seleccionarTipoProfesional(tipo) {
      this.form.profesional.tipo_profesional_id = tipo.id;
      this.form.profesional.tipo_profesional = tipo;
      this.sheetTipoProfesional = false;
      this.busquedaTipoProfesional = "";
    },

    // ==================================================
    // DIALOGO TIPO NEGOCIO
    // ==================================================

    abrirDialogoTipoNegocio() {
      this.nuevoTipoNegocio = {
        nombre: "",
        descripcion: "",
      };

      this.dialogoTipoNegocio = true;

      this.$nextTick(() => {
        this.$refs.formTipoNegocio?.resetValidation();
      });
    },

    // ==================================================
    // GUARDAR TIPO NEGOCIO
    // ==================================================

    async guardarTipoNegocio() {

      const formulario = this.$refs.formTipoNegocio;
      if (!formulario) {
        return;
      }

      const resultado = await formulario.validate();
      if (!resultado.valid) {
        return;
      }

      const datos = {
        nombre: this.nuevoTipoNegocio.nombre.trim(),
        descripcion: this.nuevoTipoNegocio.descripcion.trim(),
      };

      console.log("===================================="
      );

      console.log(
        "📦 NUEVO TIPO DE NEGOCIO"
      );

      console.log(datos);

      console.log(
        "===================================="
      );

      // ------------------------------------------
      // SIMULACIÓN TEMPORAL
      // ------------------------------------------

      const nuevoTipo = {
        id: this.obtenerSiguienteId(this.tiposNegocio),
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        icono: this.nuevoTipoNegocio.icono || "mdi-store-outline",
      };

      this.tiposNegocio.push(nuevoTipo);

      // Seleccionarlo automáticamente

      this.form.negocio.tipo_negocio_id = nuevoTipo.id;
      this.form.negocio.tipo_negocio = nuevoTipo;

      this.cerrarDialogoTipoNegocio();
    },

    // ==================================================
    // CERRAR TIPO NEGOCIO
    // ==================================================

    cerrarDialogoTipoNegocio() {
      this.dialogoTipoNegocio = false;

      this.nuevoTipoNegocio = {
        nombre: "",
        descripcion: "",
      };

      this.$nextTick(() => {
        this.$refs.formTipoNegocio?.resetValidation();
      });
    },

    // ==================================================
    // DIALOGO TIPO PROFESIONAL
    // ==================================================

    abrirDialogoTipoProfesional() {
      this.nuevoTipoProfesional = {
        nombre: "",
        descripcion: "",
      };

      this.dialogoTipoProfesional = true;

      this.$nextTick(() => {
        this.$refs.formTipoProfesional?.resetValidation();
      });
    },

    // ==================================================
    // GUARDAR TIPO PROFESIONAL
    // ==================================================

    async guardarTipoProfesional() {
      const formulario =
        this.$refs.formTipoProfesional;

      if (!formulario) {
        return;
      }

      const resultado =
        await formulario.validate();

      if (!resultado.valid) {
        return;
      }

      const datos = {
        nombre: this.nuevoTipoProfesional.nombre.trim(),

        descripcion: this.nuevoTipoProfesional.descripcion.trim(),
      };

      console.log(
        "===================================="
      );

      console.log(
        "📦 NUEVO TIPO DE PROFESIONAL"
      );

      console.log(datos);

      console.log(
        "===================================="
      );

      // ------------------------------------------
      // SIMULACIÓN TEMPORAL
      // ------------------------------------------

      const nuevoTipo = {
        id: this.obtenerSiguienteId(
          this.tiposProfesional
        ),

        nombre: datos.nombre,
      };

      this.tiposProfesional.push(nuevoTipo);

      // Seleccionarlo automáticamente

      this.form.profesional.tipo_profesional_id = nuevoTipo.id;
      this.form.profesional.tipo_profesional = nuevoTipo;

      this.cerrarDialogoTipoProfesional();
    },

    // ==================================================
    // CERRAR TIPO PROFESIONAL
    // ==================================================

    cerrarDialogoTipoProfesional() {
      this.dialogoTipoProfesional = false;

      this.nuevoTipoProfesional = {
        nombre: "",
        descripcion: "",
      };

      this.$nextTick(() => {
        this.$refs.formTipoProfesional?.resetValidation();
      });
    },

    // ==================================================
    // SIGUIENTE ID TEMPORAL
    // ==================================================

    obtenerSiguienteId(lista) {
      if (!lista.length) {
        return 1;
      }

      return (
        Math.max(
          ...lista.map((item) => item.id)
        ) + 1
      );
    },

    // ==================================================
    // FINALIZAR REGISTRO
    // ==================================================

    async finalizarRegistro() {
      if (this.guardando) {
        return;
      }

      this.guardando = true;

      try {
        // ----------------------------------------
        // CONSTRUIR OBJETO FINAL
        // ----------------------------------------
        const datosRegistro = {
          negocio: {
            ...this.form.negocio,
            // tipo_negocio: this.nuevoTipoNegocio
          },

          profesional: {
            ...this.form.profesional,
            // tipo_profesional: this.nuevoTipoProfesional
          },

          membresia: {
            fecha_inicio: this.membresia.fecha_inicio,
            fecha_fin: this.formatearFechaISO(this.fechaFin),
            monto: this.membresia.monto,
          },

          pago: {
            comprobante: this.form.pago.comprobante,
          },
        };

        // Crear FormData
        const formData = new FormData();
        formData.append("negocio", JSON.stringify(datosRegistro.negocio));
        formData.append("profesional", JSON.stringify(datosRegistro.profesional));
        formData.append("membresia", JSON.stringify(datosRegistro.membresia));
        formData.append("comprobante", datosRegistro.pago.comprobante);

        // ----------------------------------------
        // MOSTRAR EN CONSOLA
        // ----------------------------------------

        console.log(
          "========================================"
        );

        console.log(
          "🚀 REGISTRO COMPLETO PIA"
        );

        console.log(
          "========================================"
        );

        console.log(
          "📦 DATOS QUE SE VAN A GUARDAR:"
        );

        console.log(datosRegistro);

        console.log(
          "🏪 NEGOCIO:"
        );

        console.log(
          datosRegistro.negocio
        );

        console.log(
          "👤 PROFESIONAL:"
        );

        console.log(
          datosRegistro.profesional
        );

        console.log(
          "👑 MEMBRESÍA:"
        );

        console.log(
          datosRegistro.membresia
        );

        console.log(
          "💳 PAGO:"
        );

        console.log(
          datosRegistro.pago
        );

        console.log(
          "📄 ARCHIVO:"
        );

        console.log(
          datosRegistro.pago.comprobante
        );

        console.log(
          "========================================"
        );

        // ----------------------------------------
        // POR AHORA NO ENVIAMOS AL BACKEND
        // ----------------------------------------
        const res = await saveBusinessProfession(formData)

        if (res.status === 201) {
          piaAlert.success(
            "Se guardaron correctamente los datos del negocio y del profesional.",
            { title: "¡Registro enviado!", duration: 2500 }
          );

          setTimeout(() => {
            this.pasoActual = 5;
            this.$router.push({ path: "/" });
          }, 2500);
        }

      } catch (error) {
        piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado"
        );
      } finally {
        this.guardando = false;
      }
    },

    // ==================================================
    // FECHA ISO
    // ==================================================

    formatearFechaISO(fecha) {
      if (!fecha) {
        return null;
      }

      const year = fecha.getFullYear();

      const month = String(
        fecha.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        fecha.getDate()
      ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },

    async obtenerTiposNegocio(){
      try {
        this.overlay = true

        const res = await getBusinessTypes()

        if (res.data.ok) {
          this.tiposNegocio = res.data.data
        }
      } catch (error) {
        console.log(error)
        piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado"
        );
      } finally {
        this.overlay = false
      }
    },

    async obtenerTiposProfesionales(){
      try {
        this.overlay = true

        const res = await getProfessionalsTypes()

        if (res.data.ok) {
          this.tiposProfesional = res.data.data
        }
      } catch (error) {
        console.log(error)
        piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado"
        );
      } finally {
        this.overlay = false
      }
    },

    async obtenerGerencia(){
      try {
        this.overlay = true

        const res = await getManagement()

        if (res.data.ok) {
          console.log(res)
          this.gerencia = res.data.data
          this.membresia.monto = this.gerencia.monto_qr
        }
      } catch (error) {
        console.log(error)
        piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado"
        );
      } finally {
        this.overlay = false
      }
    },

  },

  mounted(){
    this.obtenerTiposNegocio()
    this.obtenerTiposProfesionales()
    this.obtenerGerencia()
  }
};
</script>

<style lang="css" scoped>
.registro-container {
  min-height: 100vh;
  background: #ffffff;
}

.registro-card {
  border-radius: 18px;
  overflow: hidden;
}

.stepper-wrapper {
  overflow-x: auto;
}

.stepper {
  display: flex;
  justify-content: space-between;
  min-width: 620px;
  position: relative;
}

.step {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
}

.step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 17px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: -1;
}

.step.completado:not(:last-child)::after {
  background: #35b7b0;
}

.step-circle {
  width: 34px;
  height: 34px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2f2;
  color: #64748b;
  font-weight: 600;
}

.step.activo .step-circle,
.step.completado .step-circle {
  background: #0f8f8c;
  color: white;
}

.step-label {
  margin-top: 7px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

.step.activo .step-label {
  color: #0f8f8c;
  font-weight: 700;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.section-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #eaf7f6;
  color: #0f8f8c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agregar-tipo {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 0px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #64748b;
}

.plan-card {
  padding: 20px;
  border-radius: 14px;
  border-color: #35b7b0 !important;
  background: #f3fbfa;
}

.plan-price {
  font-size: 26px;
  font-weight: 700;
  color: #0f8f8c;
}

.plan-price span {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
}

.beneficio {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 9px;
  font-size: 14px;
}

.beneficio .v-icon {
  color: #0f8f8c;
}

.pago-container {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.qr-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.finalizar-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 40px 10px;
}

.success-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f8f8c;
  color: white;
  box-shadow: 0 0 0 14px #eaf7f6;
}

.acciones {
  display: flex;
  align-items: center;
  gap: 12px;
}

.como-funciona {
  padding: 10px;
}

.funciona-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.funciona-icon {
  min-width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #eaf7f6;
  color: #0f8f8c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.registro-toolbar {
  min-height: 58px;
}

.registro-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0b5f63;
  line-height: 1.2;
}

.registro-subtitle {
  margin-top: 3px;
  font-size: 0.68rem;
  font-weight: 400;
  color: #64748b;
  line-height: 1.2;
}

.toolbar-spacer {
  width: 34px;
  min-width: 34px;
}

@media (max-width: 600px) {
  .registro-container {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .stepper {
    min-width: 560px;
  }

  .step-label {
    font-size: 10px;
  }

  .agregar-tipo {
    flex-direction: column;
    align-items: flex-end;
  }

  .acciones {
    flex-wrap: wrap;
  }

  .acciones .v-spacer {
    display: none;
  }

  .acciones .v-btn {
    flex: 1;
  }
}

.tipo-negocio-nombre {
  font-size: 13px;
  line-height: 1.35;
  white-space: normal;
  overflow-wrap: anywhere;
  min-width: 0;
}

@media (max-width: 600px) {
  .tipo-negocio-nombre {
    font-size: 12px;
    line-height: 1.35;
  }
}

.tipo-negocio-seleccion {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 13px;
  line-height: 1.3;
}

.tipo-negocio-seleccion span {
  min-width: 0;
}

.iconos-negocio-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}

.icono-negocio-card {
  min-width: 0;
  min-height: 82px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
}

.icono-negocio-label {
  display: block;
  width: 100%;
  font-size: 11px;
  line-height: 1.25;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
}

@media (max-width: 400px) {
  .iconos-negocio-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .icono-negocio-card {
    min-height: 76px;
  }
}

/* ================================================= */
/* DIALOGO NUEVO TIPO DE NEGOCIO                    */
/* ================================================= */

.dialogo-tipo-card {
  overflow: hidden;
  border-radius: 18px !important;
  background: #ffffff;
  box-shadow: 0 16px 45px rgb(20 50 65 / 18%);
}

/* ================================================= */
/* ENCABEZADO                                        */
/* ================================================= */

.dialogo-tipo-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #008f8c, #12aaa2);
  white-space: normal;
}

.dialogo-tipo-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 14px;
  color: #ffffff;
  background: rgb(255 255 255 / 18%);
}

.dialogo-tipo-subtitulo {
  margin-top: 3px;
  color: rgb(255 255 255 / 85%);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
}

/* ================================================= */
/* CONTENIDO                                         */
/* ================================================= */

.dialogo-tipo-contenido {
  padding: 22px 20px 18px;
  background: #ffffff;
}

/* ================================================= */
/* SELECTOR DE ICONOS                                */
/* ================================================= */

.selector-iconos-negocio {
  margin-top: 8px;
  padding: 16px;
  border: 1px solid #e5eeee;
  border-radius: 16px;
  background: #f8fbfb;
}

.selector-iconos-titulo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.selector-iconos-titulo-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  color: #008f8c;
  background: #def5f2;
}

/* ================================================= */
/* CUADRICULA                                        */
/* ================================================= */

.iconos-negocio-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}

/* ================================================= */
/* TARJETAS DE ICONOS                                */
/* ================================================= */

.icono-negocio-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  min-height: 92px;
  padding: 12px 5px;
  overflow: hidden;
  border: 1px solid #e1e9ed;
  background: #ffffff;
  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.icono-negocio-card:hover {
  border-color: #65c9c2;
  background: #f0fbf9;
  transform: translateY(-2px);
}

/* FIGURA DEL ICONO */

.icono-negocio-figura {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 14px;
  color: #008f8c;
  background: #e1f5f2;

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

/* TEXTO DE CADA ICONO */

.icono-negocio-label {
  display: block;
  width: 100%;
  color: #344b5e;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
}

/* ================================================= */
/* ICONO SELECCIONADO                                */
/* ================================================= */

.icono-negocio-card--selected {
  border: 2px solid #009c95;
  background: #e9f9f6;
  box-shadow: 0 4px 12px rgb(0 143 140 / 12%);
}

.icono-negocio-card--selected .icono-negocio-figura {
  color: #ffffff;
  background: #009c95;
}

.icono-negocio-card--selected .icono-negocio-label {
  color: #007d79;
  font-weight: 700;
}

.icono-negocio-check {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #009c95;
}

/* ================================================= */
/* RESUMEN DEL ICONO SELECCIONADO                    */
/* ================================================= */

.icono-negocio-seleccionado {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 12px;
  border: 1px solid #d7efeb;
  border-radius: 10px;
  color: #405966;
  background: #effaf8;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.icono-negocio-seleccionado strong {
  color: #007d79;
  font-weight: 600;
}

/* ================================================= */
/* ACCIONES                                          */
/* ================================================= */

.dialogo-tipo-acciones {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px 20px;
  border-top: 1px solid #edf1f3;
  background: #f8fbfc;
}

.dialogo-tipo-acciones .v-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}

.btn-guardar-tipo {
  box-shadow: 0 3px 8px rgb(0 143 140 / 18%);
}

/* ================================================= */
/* RESPONSIVE                                        */
/* ================================================= */

@media (max-width: 400px) {
  .dialogo-tipo-header {
    gap: 10px;
    padding: 16px;
  }

  .dialogo-tipo-header-icon {
    width: 40px;
    height: 40px;
  }

  .dialogo-tipo-contenido {
    padding: 16px 14px;
  }

  .selector-iconos-negocio {
    padding: 12px;
  }

  .iconos-negocio-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .icono-negocio-card {
    min-height: 82px;
    padding: 9px 4px;
  }

  .icono-negocio-figura {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .icono-negocio-label {
    font-size: 10px;
  }

  .dialogo-tipo-acciones {
    gap: 6px;
    padding: 12px 14px 16px;
  }

  .dialogo-tipo-acciones .v-btn {
    font-size: 12px;
  }
}



/* =========================================================
   ELEMENTOS COMPARTIDOS DE LOS DIÁLOGOS
========================================================= */
.dialogo-form-intro {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 20px;
  padding: 13px;
  border: 1px solid #dcefeb;
  border-radius: 14px;
  background: linear-gradient(135deg, #f0fbf9, #f8fcfc);
}

.dialogo-form-intro-icon {
  display: grid;
  place-items: center;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #078f89;
  background: #ddf5f1;
}

.dialogo-form-intro-title {
  color: #244557;
  font-size: 13px;
  font-weight: 700;
}

.dialogo-form-intro-text {
  margin-top: 3px;
  color: #718293;
  font-size: 11px;
  line-height: 1.45;
}

.dialogo-tipo-contenido :deep(.v-field) {
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.dialogo-tipo-contenido :deep(.v-field__underlay) {
  background: transparent !important;
}

.dialogo-tipo-contenido :deep(.v-field--underlined .v-field__outline::after) {
  border-color: #dce7e8 !important;
  opacity: 1;
}

.dialogo-tipo-contenido :deep(.v-field--focused .v-field__outline::after) {
  border-color: #0f9993 !important;
  border-width: 0 0 2px !important;
}

.dialogo-tipo-contenido :deep(.v-field__prepend-inner > .v-icon) {
  color: #0b9993;
}

.dialogo-tipo-contenido :deep(.v-field__input) {
  font-size: 14px;
  color: #263b4b;
}

.dialogo-tipo-contenido :deep(.v-label) {
  color: #718293;
  font-size: 13px;
}

/* =========================================================
   FORMULARIO MÓVIL MINIMALISTA - PASO NEGOCIO
   ========================================================= */
.form-registro-minimal {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Un solo lenguaje visual para negocio, profesional, membresía y pago. */
.form-registro-minimal :deep(.v-field) {
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.form-registro-minimal :deep(.v-field__underlay) {
  background: transparent !important;
}

.form-registro-minimal :deep(.v-field--underlined .v-field__outline::after) {
  border-color: #dce7e8 !important;
  opacity: 1;
}

.form-registro-minimal :deep(.v-field--focused .v-field__outline::after) {
  border-color: #0f9993 !important;
  border-width: 0 0 2px !important;
}

.form-registro-minimal :deep(.v-field__input) {
  min-height: 48px;
  padding-top: 10px;
  padding-bottom: 8px;
  font-size: 14px;
  color: #263b4b;
}

.form-registro-minimal :deep(.v-label) {
  color: #718293;
  font-size: 13px;
}

.form-registro-minimal :deep(.v-field__prepend-inner > .v-icon),
.form-registro-minimal :deep(.v-field__append-inner > .v-icon) {
  color: #0b9993;
  opacity: .9;
}

.form-registro-minimal :deep(.v-input__details) {
  padding-inline-start: 0;
}

.form-registro-minimal :deep(.v-messages) {
  font-size: 11px;
}

.form-registro-minimal :deep(.v-file-input .v-field__input) {
  min-height: 48px;
}

.form-registro-minimal .form-subtitulo {
  margin: 7px 0 -3px;
  color: #078b86;
  font-size: 14px;
  font-weight: 650;
}

.form-registro-minimal .agregar-tipo {
  margin-top: -13px;
  margin-bottom: 1px;
  flex-direction: row;
  justify-content: flex-end;
  gap: 4px;
}

/* El bottom sheet se muestra como panel limpio, no como botones HTML */
:deep(.sheet-tipos-negocio) {
  width: 100%;
  max-height: min(78vh, 680px);
  overflow: hidden;
  border-radius: 22px 22px 0 0 !important;
  background: #fff;
}

:deep(.sheet-tipos-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 12px;
}

:deep(.sheet-tipos-header .text-subtitle-1) {
  color: #183548;
  font-size: 17px !important;
  letter-spacing: -.2px;
}

:deep(.sheet-tipos-grid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

:deep(.sheet-tipo-opcion) {
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  min-height: 62px;
  padding: 10px 11px;
  border: 1px solid #e7eeee;
  border-radius: 13px;
  background: #fff;
  color: #385064;
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease;
}

:deep(.sheet-tipo-opcion:active),
:deep(.sheet-tipo-opcion--activo) {
  border-color: #0b9993;
  background: #effaf8;
}

:deep(.sheet-tipo-icono) {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: #eaf7f6;
  color: #078f89;
}

:deep(.sheet-tipo-nombre) {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 1.3;
  font-weight: 550;
  overflow-wrap: anywhere;
}

:deep(.sheet-tipo-check) {
  flex: 0 0 auto;
  color: #078f89;
}

@media (max-width: 380px) {
  :deep(.sheet-tipos-header) { padding: 17px 16px 10px; }
  :deep(.sheet-tipos-grid) { gap: 7px; }
  :deep(.sheet-tipo-opcion) { min-height: 58px; padding: 8px; gap: 7px; }
  :deep(.sheet-tipo-icono) { flex-basis: 32px; width: 32px; height: 32px; }
  :deep(.sheet-tipo-nombre) { font-size: 11px; }
}

</style>
