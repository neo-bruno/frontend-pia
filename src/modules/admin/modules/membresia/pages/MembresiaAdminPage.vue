<template>
<div class="membresia-page">
  <!-- ENCABEZADO -->
  <header class="page-header">
    <div class="header-icon">
      <v-icon icon="mdi-crown" size="27" />
    </div>

    <div class="header-text">
      <h1>Mi membresía</h1>
      <p>Tu cuenta profesional en PIA</p>
    </div>

    <v-btn icon="mdi-refresh" variant="text" color="primary" :loading="cargando" aria-label="Actualizar membresías" @click="cargarMembresias" />
  </header>

  <!-- CARGANDO -->
  <div v-if="cargando" class="loading-state">
    <v-progress-circular indeterminate color="teal" size="38" />
    <p>Cargando tu membresía...</p>
  </div>

  <template v-else>
    <!-- ERROR -->
    <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">
      {{ error }}

      <template #append>
        <v-btn size="small" variant="text" @click="cargarMembresias">
          Reintentar
        </v-btn>
      </template>
    </v-alert>

    <!-- SIN MEMBRESÍAS -->
    <v-card v-if="!error && membresias.length === 0" class="empty-card" elevation="0">
      <v-icon icon="mdi-crown-outline" size="56" color="teal" />

      <h2>Aún no tienes membresías</h2>

      <p>
        Cuando exista una membresía asociada a tu cuenta profesional,
        aparecerá aquí.
      </p>
    </v-card>

    <template v-else-if="membresias.length > 0">
      <!-- MEMBRESÍA PRINCIPAL -->
      <section class="membership-section">
        <div class="section-heading">
          <h2>Mi plan</h2>
          <span class="section-caption">
            {{ membresias.length }}
            {{ membresias.length === 1?'membresía' : 'membresías' }}
          </span>
        </div>

        <v-card class="membership-card" elevation="0">
          <div class="membership-card-top">
            <div class="crown-circle">
              <v-icon icon="mdi-crown" size="34" color="#F59E0B" />
            </div>

            <div class="membership-info">
              <span class="eyebrow">PIA PROFESIONAL</span>
              <h3>Membresía profesional</h3>
              <p>{{ membresiaActual.negocio_nombre || 'Mi negocio' }}</p>
            </div>

            <v-chip :color="colorEstado(membresiaActual)" variant="tonal" size="small" class="status-chip">
              {{ textoEstado(membresiaActual) }}
            </v-chip>
          </div>

          <div class="membership-price">
            <span class="currency">Bs</span>
            <strong>{{ formatoMonto(membresiaActual.monto) }}</strong>
            <span class="period">/ período</span>
          </div>

          <div class="period-card">
            <div class="period-icon">
              <v-icon icon="mdi-calendar-month-outline" size="25" color="primary" />
            </div>

            <div class="period-info">
              <span class="period-label">
                {{ membresiaActual.estado_pagado
                   ?'Período de membresía'
                    : 'Período a pagar' }}
              </span>

              <strong>
                {{ formatearFecha(membresiaActual.fecha_inicio) }}
                -
                {{ formatearFecha(membresiaActual.fecha_fin) }}
              </strong>
            </div>
          </div>

          <!-- VENCIMIENTO -->
          <div class="expiration-row">
            <div class="expiration-icon">
              <v-icon icon="mdi-clock-outline" size="23" color="primary" />
            </div>

            <div class="expiration-info">
              <span>Fecha de vencimiento</span>
              <strong>
                {{ formatearFecha(membresiaActual.fecha_fin) }}
              </strong>
            </div>

            <div v-if="membresiaActual.estado_pagado" class="days-box" :class="{
                  'days-warning': diasRestantes(membresiaActual) <= 3
                    && diasRestantes(membresiaActual) >= 0,
                  'days-expired': diasRestantes(membresiaActual) < 0
                }">
              <strong>
                {{ etiquetaDias(membresiaActual) }}
              </strong>
            </div>
          </div>

          <!-- PROGRESO DEL PERÍODO -->
          <div v-if="membresiaActual.estado_pagado" class="progress-section">
            <div class="progress-track">
              <div class="progress-value" :style="{
                    width: progresoPeriodo(membresiaActual) + '%'
                  }" />
            </div>

            <div class="progress-footer">
              <span>
                {{ progresoPeriodo(membresiaActual) }}%
                del período transcurrido
              </span>

              <span>
                {{ diasPeriodoTranscurridos(membresiaActual) }}
                de {{ totalDiasPeriodo(membresiaActual) }} días
              </span>
            </div>
          </div>

          <!-- AVISO DE PAGO -->
          <div v-if="!membresiaActual.estado_pagado" class="payment-notice">
            <v-icon icon="mdi-information-outline" size="22" />

            <div>
              <strong>Pago pendiente de validación</strong>
              <p>
                {{ textoEstado(membresiaActual) }}.
                Consulta el estado del comprobante antes de realizar
                otro pago.
              </p>
            </div>
          </div>

          <!-- ACCIÓN PRINCIPAL -->
          <v-btn block size="x-large" color="teal" class="pay-button" prepend-icon="mdi-qrcode" @click="abrirDialogoPago(membresiaActual)">
            {{ membresiaActual.estado_pagado
               ?'Ver información de pago'
                : 'Ver estado del pago' }}
          </v-btn>

          <!-- RENOVACIÓN: abre el flujo real de QR y comprobante -->
          <v-btn v-if="puedeRenovar(membresiaActual)" block size="large" color="primary" variant="outlined" class="renew-button" prepend-icon="mdi-calendar-refresh" :disabled="renovando" @click="iniciarRenovacion(membresiaActual)">
            Renovar membresía
          </v-btn>
        </v-card>
      </section>

      <!-- AVISO DE VENCIMIENTO -->
      <div class="reminder-card">
        <div class="reminder-icon">
          <v-icon icon="mdi-bell-ring-outline" size="23" color="#1676E8" />
        </div>

        <div>
          <strong>Recuerda tu renovación</strong>
          <p>
            Te recomendamos revisar tu membresía antes de la fecha
            de vencimiento.
          </p>
        </div>
      </div>

      <!-- HISTORIAL -->
      <section class="history-section">
        <div class="section-heading">
          <div>
            <h2>Historial de membresías</h2>
            <p>Consulta tus períodos y comprobantes.</p>
          </div>

          <v-icon icon="mdi-history" color="teal" size="25" />
        </div>

        <div v-for="item in membresias" :key="item.membresia_id" class="history-card" @click="abrirDetalle(item)">
          <div class="history-date">
            <strong>{{ diaFecha(item.fecha_inicio) }}</strong>
            <span>{{ mesFecha(item.fecha_inicio) }}</span>
            <small>{{ anioFecha(item.fecha_inicio) }}</small>
          </div>

          <div class="history-info">
            <strong class="history-price">
              Bs {{ formatoMonto(item.monto) }}
            </strong>

            <span class="history-business">
              {{ item.negocio_nombre || 'Mi negocio' }}
            </span>

            <span class="history-period">
              {{ formatearFecha(item.fecha_inicio) }}
              - {{ formatearFecha(item.fecha_fin) }}
            </span>

            <span v-if="item.comprobante_estado" class="receipt-status" :class="claseComprobante(item.comprobante_estado)">
              <v-icon :icon="iconoComprobante(item.comprobante_estado)" size="15" />
              {{ item.comprobante_estado }}
            </span>

            <span v-else class="receipt-status status-no-receipt">
              <v-icon icon="mdi-file-document-outline" size="15" />
              Sin comprobante registrado
            </span>
          </div>

          <v-icon icon="mdi-chevron-right" size="24" color="#66809A" />
        </div>
      </section>
    </template>
  </template>

  

<!-- BOTTOM SHEET: PAGO DE RENOVACIÓN -->
<v-bottom-sheet
  v-model="sheetRenovacion"
  inset
  scroll-strategy="block"
>
  <v-card class="renew-sheet" rounded="t-xl">

    <!-- ENCABEZADO -->
    <div class="renew-sheet-header">

      <!-- FILA 1: MARCA Y CERRAR -->
      <div class="renew-sheet-top-row">
        <span class="text-overline text-teal">
          PIA PROFESIONAL
        </span>

        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          aria-label="Cerrar renovación"
          :disabled="enviandoComprobante || creandoRenovacion"
          @click="cerrarSheetRenovacion"
        />
      </div>

      <!-- FILA 2: TÍTULO Y DESCRIPCIÓN -->
      <div class="renew-sheet-title-row">
        <h2 class="text-h6 font-weight-bold">
          Renovar membresía
        </h2>

        <p class="text-body-2 text-medium-emphasis">
          Escanea el QR oficial y envía tu comprobante para validación.
        </p>
      </div>
    </div>

    <v-divider />

    <!-- CONTENIDO -->
    <div class="renew-sheet-content">

      <!-- ERROR DEL PROCESO -->
      <v-alert
        v-if="errorRenovacion"
        type="error"
        variant="tonal"
        density="comfortable"
        class="mb-4"
      >
        {{ errorRenovacion }}
      </v-alert>

      <!-- PREPARANDO DATOS -->
      <div
        v-if="creandoRenovacion"
        class="text-center py-8"
      >
        <v-progress-circular
          indeterminate
          color="teal"
          size="36"
        />

        <p class="mt-3 text-body-2">
          Preparando la información de pago...
        </p>
      </div>

      <template v-else-if="renovacion">

        <!-- IMPORTE -->
        <div class="renew-amount">
          <span>Importe a pagar</span>

          <strong>
            Bs {{ formatoMonto(renovacion.membresia?.monto) }}
          </strong>

          <small>
            Tu membresía seguirá pendiente de validación
            hasta que el SUPERADMIN acepte el comprobante.
          </small>
        </div>

        <!-- QR OFICIAL DE GERENCIA -->
        <div class="qr-panel">
          <div class="d-flex align-center justify-space-between ga-2 mb-3">
            <strong>QR oficial de Gerencia PIA</strong>

            <v-btn
              v-if="qrGerencia?.url"
              size="small"
              variant="text"
              color="teal"
              prepend-icon="mdi-open-in-new"
              @click="abrirQr"
            >
              Ver QR
            </v-btn>
          </div>

          <v-img
            v-if="qrGerencia?.url"
            :src="urlArchivo(qrGerencia.url)"
            alt="QR oficial de membresía PIA"
            width="100%"
            max-height="280"
            contain
            class="qr-renovacion"
          />

          <v-alert
            v-else
            type="warning"
            variant="tonal"
            density="comfortable"
          >
            No se pudo cargar el QR oficial de Gerencia.
          </v-alert>

          <p
            v-if="qrGerencia?.nombre"
            class="text-caption text-center mt-2"
          >
            {{ qrGerencia.nombre }}
          </p>
        </div>

        <!-- COMPROBANTE -->
        <v-form @submit.prevent="enviarComprobanteRenovacion">

          <v-file-input
            v-model="archivoComprobante"
            label="Comprobante de pago"
            hint="JPG, PNG, WEBP o PDF · Máximo 5 MB"
            persistent-hint
            accept="image/jpeg,image/png,image/webp,application/pdf"
            prepend-icon="mdi-cloud-upload-outline"
            variant="outlined"
            density="comfortable"
            :disabled="enviandoComprobante || comprobanteEnviado"
            :error-messages="errorArchivo"
            @update:model-value="validarArchivoComprobante"
          />

          <!-- ACLARACIÓN DEL ESTADO -->
          <v-alert
            v-if="!comprobanteEnviado"
            type="info"
            variant="tonal"
            density="comfortable"
            class="mt-3"
          >
            El envío del comprobante no confirma el pago.
            El SUPERADMIN debe revisarlo y aceptarlo para
            que la membresía se marque como pagada.
          </v-alert>

          <!-- COMPROBANTE RECIBIDO -->
          <v-alert
            v-if="comprobanteEnviado"
            type="success"
            variant="tonal"
            density="comfortable"
            class="mt-3"
          >
            Comprobante enviado correctamente.
            Está pendiente de validación por el SUPERADMIN.
          </v-alert>

          <!-- BOTONES -->
          <div class="renew-sheet-actions">

            <v-btn
              type="button"
              variant="outlined"
              :disabled="enviandoComprobante || creandoRenovacion"
              @click="cerrarSheetRenovacion"
            >
              Cerrar
            </v-btn>

            <v-btn
              v-if="!comprobanteEnviado"
              type="submit"
              color="teal"
              :loading="enviandoComprobante"
              :disabled="
                !archivoComprobante ||
                Boolean(errorArchivo) ||
                enviandoComprobante ||
                creandoRenovacion
              "
            >
              Enviar comprobante
            </v-btn>

          </div>
        </v-form>
      </template>
    </div>
  </v-card>
</v-bottom-sheet>



  <!-- DIÁLOGO DE INFORMACIÓN DE PAGO -->
  <v-dialog v-model="dialogoPago" max-width="440" width="calc(100% - 28px)" scrollable>
    <v-card class="payment-dialog">
      <div class="dialog-header">
        <div class="dialog-crown">
          <v-icon icon="mdi-crown" size="29" color="#F59E0B" />
        </div>

        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar" @click="dialogoPago = false" />
      </div>

      <v-card-title class="dialog-title">
        Información de membresía
      </v-card-title>

      <v-card-text v-if="membresiaSeleccionada">
        <p class="dialog-business">
          {{ membresiaSeleccionada.negocio_nombre || 'Mi negocio' }}
        </p>

        <div class="dialog-amount">
          <span>Importe de la membresía</span>
          <strong>
            Bs {{ formatoMonto(membresiaSeleccionada.monto) }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Período</span>
          <strong>
            {{ formatearFecha(membresiaSeleccionada.fecha_inicio) }}
            -
            {{ formatearFecha(membresiaSeleccionada.fecha_fin) }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Estado de membresía</span>
          <v-chip size="small" :color="colorEstado(membresiaSeleccionada)" variant="tonal">
            {{ textoEstado(membresiaSeleccionada) }}
          </v-chip>
        </div>

        <div class="dialog-detail">
          <span>Último pago</span>
          <strong>
            {{ membresiaSeleccionada.pago_numero || 'Sin registro' }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Comprobante</span>
          <strong>
            {{ membresiaSeleccionada.comprobante_estado || 'Sin registro' }}
          </strong>
        </div>

        <v-alert type="info" variant="tonal" density="comfortable" rounded="lg" class="mt-4">
          <template #text>
            La renovación queda pendiente de validación. La membresía solo se marcará como pagada cuando el SUPERADMIN acepte el comprobante.
          </template>
        </v-alert>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-btn block color="teal" variant="flat" size="large" @click="dialogoPago = false">
          Entendido
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- DETALLE DE HISTORIAL -->
  <v-dialog v-model="dialogoDetalle" max-width="440" width="calc(100% - 28px)" scrollable>
    <v-card class="payment-dialog">
      <v-card-title class="dialog-title">
        Detalle de membresía
      </v-card-title>

      <v-card-text v-if="membresiaDetalle">
        <div class="dialog-amount">
          <span>Monto</span>
          <strong>
            Bs {{ formatoMonto(membresiaDetalle.monto) }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Negocio</span>
          <strong>
            {{ membresiaDetalle.negocio_nombre || 'Mi negocio' }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Inicio</span>
          <strong>
            {{ formatearFecha(membresiaDetalle.fecha_inicio) }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Vencimiento</span>
          <strong>
            {{ formatearFecha(membresiaDetalle.fecha_fin) }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Pago registrado</span>
          <strong>
            {{ membresiaDetalle.pago_numero || 'Sin registro' }}
          </strong>
        </div>

        <div class="dialog-detail">
          <span>Comprobante</span>
          <strong>
            {{ membresiaDetalle.comprobante_estado || 'Sin registro' }}
          </strong>
        </div>

        <div v-if="membresiaDetalle.comprobante_observacion" class="observation-box">
          <strong>Observación</strong>
          <p>{{ membresiaDetalle.comprobante_observacion }}</p>
        </div>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-btn block color="teal" variant="flat" size="large" @click="dialogoDetalle = false">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import {
  getMisMembresias,
  getQrGerenciaMembresia,
  enviarComprobanteRenovacion as apiEnviarComprobanteRenovacion,
} from "../services/membresia.api";

import {
  getFileUrl
} from '@/utils/ayuda'

export default {
  name: 'MembresiaAdminPage',

  data() {
    return {
      cargando: false,
      error: null,
      membresias: [],
      dialogoPago: false,
      dialogoDetalle: false,
      membresiaSeleccionada: null,
      membresiaDetalle: null,
      renovando: false,
      sheetRenovacion: false,
      creandoRenovacion: false,
      enviandoComprobante: false,
      renovacion: null,
      qrGerencia: null,
      archivoComprobante: null,
      errorArchivo: '',
      errorRenovacion: '',
      comprobanteEnviado: false,
    }
  },

  computed: {
    membresiaActual() {
      if (!this.membresias?.length) return null;

      const ordenarPorInicio = (a, b) => {
        const fechaA = String(a.fecha_inicio ?? "").slice(0, 10);
        const fechaB = String(b.fecha_inicio ?? "").slice(0, 10);

        if (fechaA !== fechaB) {
          return fechaB.localeCompare(fechaA);
        }

        return Number(b.membresia_id ?? b.id ?? 0) -
          Number(a.membresia_id ?? a.id ?? 0);
      };

      return [...this.membresias].sort(ordenarPorInicio)[0];
    },
  },

  mounted() {
    this.cargarMembresias()
  },

  methods: {
    getFileUrl,

    obtenerPagoIdRenovacion() {
      return (
        this.renovacion?.pago?.id ??
        this.renovacion?.pago?.pago_id ??
        this.renovacion?.pago_id ??
        this.renovacion?.pago?.id_pago ??
        null
      )
    },

    async cargarMembresias() {
      this.cargando = true
      this.error = null

      try {
        const respuesta = await getMisMembresias()

        if (respuesta.data?.ok) {
          this.membresias = Array.isArray(respuesta.data.data) ?
            respuesta.data.data : []
        } else {
          this.error =
            respuesta.data?.message ||
            'No se pudieron cargar las membresías.'
        }
      } catch (error) {
        console.error(
          'Error al cargar membresías:',
          error.response?.data || error
        )

        this.error =
          error.response?.data?.message ||
          'No se pudieron cargar las membresías. Intenta nuevamente.'
      } finally {
        this.cargando = false
      }
    },

    fechaLocal(valor) {
      if (!valor) return null

      const texto = String(valor).slice(0, 10)
      const partes = texto.split('-')

      if (partes.length !== 3) return null

      const [anio, mes, dia] = partes.map(Number)
      const fecha = new Date(anio, mes - 1, dia)

      return Number.isNaN(fecha.getTime())?null : fecha
    },

    formatearFecha(valor) {
      const fecha = this.fechaLocal(valor)

      if (!fecha) return 'Sin fecha'

      return fecha.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    },

    formatoMonto(valor) {
      const monto = Number(valor)

      if (!Number.isFinite(monto)) return '0.00'

      return monto.toLocaleString('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },

    diasRestantes(item) {
      const fin = this.fechaLocal(item?.fecha_fin)

      if (!fin) return 0

      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      return Math.round((fin.getTime() - hoy.getTime()) / 86400000)
    },

    etiquetaDias(item) {
      const dias = this.diasRestantes(item)

      if (dias < 0) {
        return `Venció hace ${Math.abs(dias)} días`
      }

      if (dias === 0) return 'Vence hoy'

      return `Faltan ${dias} días`
    },

    totalDiasPeriodo(item) {
      const inicio = this.fechaLocal(item?.fecha_inicio)
      const fin = this.fechaLocal(item?.fecha_fin)

      if (!inicio || !fin || fin < inicio) return 0

      return Math.max(
        1,
        Math.round((fin.getTime() - inicio.getTime()) / 86400000) + 1
      )
    },

    diasPeriodoTranscurridos(item) {
      const inicio = this.fechaLocal(item?.fecha_inicio)
      const fin = this.fechaLocal(item?.fecha_fin)

      if (!inicio || !fin) return 0

      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      if (hoy < inicio) return 0

      return Math.min(
        this.totalDiasPeriodo(item),
        Math.max(
          0,
          Math.floor((hoy.getTime() - inicio.getTime()) / 86400000) + 1
        )
      )
    },

    progresoPeriodo(item) {
      const total = this.totalDiasPeriodo(item)

      if (!total) return 0

      return Math.min(
        100,
        Math.round((this.diasPeriodoTranscurridos(item) / total) * 100)
      )
    },

    textoEstado(item) {
      if (!item) return 'Sin datos'

      if (item.estado_pagado) {
        if (this.diasRestantes(item) < 0) return 'Vencida'
        if (this.diasRestantes(item) <= 3) return 'Por vencer'

        return 'Pagada'
      }

      const comprobante = String(
        item.comprobante_estado || ''
      ).toUpperCase()

      if (comprobante === 'PENDIENTE') return 'En revisión'
      if (comprobante === 'RECHAZADO') return 'Pago rechazado'

      return 'Pago pendiente'
    },

    colorEstado(item) {
      const estado = this.textoEstado(item)

      if (estado === 'Pagada') return 'success'
      if (estado === 'Por vencer') return 'warning'
      if (estado === 'Vencida') return 'error'
      if (estado === 'En revisión') return 'info'
      if (estado === 'Pago rechazado') return 'error'

      return 'warning'
    },

    claseComprobante(estado) {
      const valor = String(estado || '').toUpperCase()

      if (valor === 'ACEPTADO') return 'status-accepted'
      if (valor === 'RECHAZADO') return 'status-rejected'
      if (valor === 'PENDIENTE') return 'status-pending'

      return 'status-no-receipt'
    },

    iconoComprobante(estado) {
      const valor = String(estado || '').toUpperCase()

      if (valor === 'ACEPTADO') return 'mdi-check-circle'
      if (valor === 'RECHAZADO') return 'mdi-close-circle'

      return 'mdi-clock-outline'
    },

    diaFecha(valor) {
      const fecha = this.fechaLocal(valor)

      return fecha ?
        String(fecha.getDate()).padStart(2, '0') :
        '--'
    },

    mesFecha(valor) {
      const fecha = this.fechaLocal(valor)

      return fecha ?
        fecha.toLocaleDateString('es-BO', {
          month: 'short'
        })
        .replace('.', '')
        .toUpperCase() :
        '---'
    },

    anioFecha(valor) {
      const fecha = this.fechaLocal(valor)

      return fecha?fecha.getFullYear() : '----'
    },

    puedeRenovar(item) {
      if (!item || !item.estado_pagado) return false

      const relacionadas = this.membresias.filter(
        (m) => Number(m.profesional_negocio_id) === Number(item.profesional_negocio_id)
      )

      const ultima = relacionadas.reduce((actual, siguiente) => {
        if (!actual) return siguiente
        const fechaA = String(actual.fecha_fin || '')
        const fechaB = String(siguiente.fecha_fin || '')
        if (fechaB > fechaA) return siguiente
        if (fechaB === fechaA && Number(siguiente.membresia_id) > Number(actual.membresia_id)) return siguiente
        return actual
      }, null)

      if (!ultima || Number(ultima.membresia_id) !== Number(item.membresia_id)) return false
      return !relacionadas.some((m) => !m.estado_pagado)
    },

    urlArchivo(ruta) {
      if (!ruta) return ''
      return getFileUrl(ruta)
    },
    
    async iniciarRenovacion(item) {
      if (!this.puedeRenovar(item) || this.renovando) return

      this.renovando = true
      this.creandoRenovacion = true
      this.errorRenovacion = ''
      this.comprobanteEnviado = false
      this.archivoComprobante = null
      this.errorArchivo = ''
      this.qrGerencia = null

      // Abrir el sheet NO crea una membresía ni un pago.
      this.renovacion = {
        membresia: {
          ...item,
          monto: Number(item.monto),
        },
        membresia_origen_id: item.membresia_id,
        pago: null,
      }

      this.sheetRenovacion = true

      try {
        const respuestaQr = await getQrGerenciaMembresia()
        const qr = respuestaQr.data?.data

        if (!respuestaQr.data?.ok || !qr?.url) {
          throw new Error(
            respuestaQr.data?.message ||
            'No se pudo obtener el QR oficial de Gerencia.'
          )
        }

        this.qrGerencia = qr
      } catch (error) {
        console.error(
          'Error al cargar QR de renovación:',
          error.response?.data || error
        )

        this.errorRenovacion =
          error.response?.data?.message ||
          error.message ||
          'No se pudo cargar el QR oficial de Gerencia.'

        this.$piaAlert?.error(this.errorRenovacion, {
          title: 'Error al cargar el QR',
        })
      } finally {
        this.renovando = false
        this.creandoRenovacion = false
      }
    },


    validarArchivoComprobante(valor) {
      this.errorArchivo = ''
      const archivo = Array.isArray(valor)?valor[0] : valor
      this.archivoComprobante = archivo || null
      if (!archivo) return

      const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
      if (!permitidos.includes(archivo.type)) {
        this.errorArchivo = 'Solo se aceptan archivos JPG, PNG, WEBP o PDF.'
      } else if (archivo.size > 5 * 1024 * 1024) {
        this.errorArchivo = 'El comprobante no puede superar los 5 MB.'
      }
    },
    
    
    async enviarComprobanteRenovacion() {
      if (this.enviandoComprobante || this.creandoRenovacion) return;

      const archivo = Array.isArray(this.archivoComprobante)
        ? this.archivoComprobante[0]
        : this.archivoComprobante;

      const membresiaId = Number(
        this.renovacion?.membresia_origen_id ??
        this.renovacion?.membresia?.membresia_id
      );

      if (!Number.isInteger(membresiaId) || membresiaId <= 0) {
        this.errorRenovacion =
          "No se encontró una membresía válida para renovar.";
        return;
      }

      if (!archivo) {
        this.errorArchivo = "Selecciona el comprobante de pago.";
        return;
      }

      this.validarArchivoComprobante(archivo);

      if (this.errorArchivo) return;

      this.enviandoComprobante = true;
      this.errorRenovacion = "";

      try {
        const respuesta = await apiEnviarComprobanteRenovacion( membresiaId, archivo);

        if (!respuesta.data?.ok) {
          throw new Error(
            respuesta.data?.message ||
            "No se pudo enviar el comprobante."
          );
        }

        this.comprobanteEnviado = true;

        await this.cargarMembresias();

        this.sheetRenovacion = false;

        this.$piaAlert?.success?.(
          "Comprobante enviado. Queda pendiente de validación por el SUPERADMIN."
        );
      } catch (error) {
        console.error(
          "Error al enviar comprobante de renovación:",
          error.response?.data || error
        );

        this.errorRenovacion =
          error.response?.data?.message ||
          error.message ||
          "No se pudo enviar el comprobante.";
      } finally {
        this.enviandoComprobante = false;
      }
    },


    abrirQr() {
      const url = this.urlArchivo(this.qrGerencia?.url)
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    },

    cerrarSheetRenovacion() {
      if (this.enviandoComprobante || this.creandoRenovacion) return
      this.sheetRenovacion = false
    },

    abrirDialogoPago(item) {
      this.membresiaSeleccionada = item
      this.dialogoPago = true
    },

    abrirDetalle(item) {
      this.membresiaDetalle = item
      this.dialogoDetalle = true
    },
  },
}
</script>

<style lang="scss" scoped>
.membresia-page {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 16px 36px;
  color: #101a3a;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 2px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 16px;
  color: #008f95;
  background: linear-gradient(135deg, #e0fbf6, #f4fdfa);
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-text h1 {
  font-size: 23px;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 1px;
  margin-bottom: 1px;
  letter-spacing: -0.6px;
}

.header-text p {
  margin-top: 3px;
  color: #72809b;
  font-size: 13px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 1px;
}

.section-heading h2 {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.section-heading>div p {
  margin-top: 4px;
  color: #7b88a0;
  font-size: 12px;
}

.section-caption {
  color: #77859c;
  font-size: 12px;
}

.membership-section {
  margin-bottom: 18px;
}

.membership-card {
  overflow: hidden;
  padding: 20px;
  border: 1px solid #e5edf4;
  border-radius: 23px;
  background: linear-gradient(150deg, #fffefa 0%, #ffffff 48%, #f1fffb 100%);
  box-shadow: 0 8px 25px rgba(34, 76, 110, 0.06);
}

.membership-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crown-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(145deg, #fff2ce, #fffaf0);
}

.membership-info {
  flex: 1;
  min-width: 0;
}

.eyebrow {
  display: block;
  margin-bottom: 4px;
  color: #078e92;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.membership-info h3 {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}

.membership-info p {
  margin-top: 5px;
  color: #71809b;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.status-chip {
  flex-shrink: 0;
  font-weight: 700;
}

.membership-price {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin: 22px 20px;
  color: #101a3a;
}

.membership-price .currency {
  font-size: 18px;
  font-weight: 700;
}

.membership-price strong {
  font-size: 31px;
  font-weight: 900;
  letter-spacing: -1px;
}

.membership-price .period {
  color: #7b88a0;
  font-size: 13px;
}

.period-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px;
  padding-left: 1px;
  padding-right: 1px;
  border: 1px solid #edf2f6;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
}

.period-icon,
.expiration-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.period-icon {
  width: 37px;
  height: 37px;
}

.period-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.period-label {
  color: #0789a3;
  font-size: 12px;
  font-weight: 700;
}

.period-info strong {
  font-size: 14px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.expiration-row {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 17px;
}

.expiration-icon {
  width: 34px;
  height: 34px;
}

.expiration-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.expiration-info span {
  color: #78869e;
  font-size: 12px;
}

.expiration-info strong {
  font-size: 14px;
}

.days-box {
  max-width: 125px;
  padding: 8px 10px;
  border-radius: 12px;
  background: #e0faf0;
  color: #078858;
  font-size: 11px;
  text-align: center;
}

.days-warning {
  background: #fff3d7;
  color: #a76500;
}

.days-expired {
  background: #ffe6e6;
  color: #c62828;
}

.progress-section {
  margin-top: 20px;
}

.progress-track {
  width: 100%;
  height: 10px;
  overflow: hidden;
  border-radius: 20px;
  background: #e4edf3;
}

.progress-value {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #079ba0, #12b8a6);
  transition: width 0.25s ease;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  color: #657795;
  font-size: 11px;
}

.payment-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 16px;
  padding: 13px;
  border-radius: 13px;
  background: #fff5e6;
  color: #a46100;
}

.payment-notice strong {
  font-size: 13px;
}

.payment-notice p {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
}

.pay-button {
  min-height: 52px;
  margin-top: 20px;
  border-radius: 14px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  box-shadow: 0 6px 14px rgba(0, 150, 145, 0.18);
}

.renew-button {
  min-height: 48px;
  margin-top: 10px;
  border-radius: 14px;
  font-weight: 800;
  letter-spacing: 0;
}

.renew-sheet {
  max-height: 92dvh;
  overflow: hidden;
}

.renew-sheet-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 20px 16px;
}

.renew-sheet-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
}

.renew-sheet-top-row :deep(.v-btn) {
  flex-shrink: 0;
  margin-right: -8px;
}

.renew-sheet-title-row {
  min-width: 0;
}

.renew-sheet-title-row h2 {
  margin: 0;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.renew-sheet-title-row p {
  max-width: 34rem;
  margin-bottom: 0;
  line-height: 1.5;
}

.renew-sheet-content {
  padding: 18px 20px calc(20px + env(safe-area-inset-bottom));
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.renew-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px;
  margin-bottom: 18px;
  border-radius: 16px;
  background: #effbf8;
}

.renew-amount span {
  color: #657795;
  font-size: 13px;
}

.renew-amount strong {
  color: #008f87;
  font-size: 30px;
  font-weight: 900;
}

.renew-amount small {
  color: #657795;
  text-align: center;
}

.qr-panel {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #e5edf4;
  border-radius: 16px;
  background: #fff;
}

.qr-renovacion {
  max-width: 320px;
  margin: 0 auto;
}

.reminder-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 18px 0 30px;
  padding: 16px;
  border: 1px solid #d8eaff;
  border-radius: 17px;
  background: linear-gradient(120deg, #edf7ff, #f8fbff);
}

.reminder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

.reminder-card strong {
  color: #165da9;
  font-size: 13px;
}

.reminder-card p {
  margin-top: 5px;
  color: #4278af;
  font-size: 12px;
  line-height: 1.55;
}

.history-section {
  margin-top: 10px;
}

.history-section .section-heading {
  margin-bottom: 16px;
}

.history-card {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 12px;
  padding: 13px;
  border: 1px solid #e6edf5;
  border-radius: 17px;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.history-card:hover {
  border-color: #9cdbd6;
  box-shadow: 0 4px 14px rgba(27, 106, 121, 0.06);
}

.history-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 59px;
  min-width: 59px;
  min-height: 80px;
  padding: 8px 3px;
  border: 1px solid #e2edf7;
  border-radius: 12px;
  background: #f7fbff;
}

.history-date strong {
  font-size: 20px;
  font-weight: 900;
}

.history-date span {
  margin-top: 2px;
  font-size: 11px;
  font-weight: 800;
}

.history-date small {
  margin-top: 3px;
  color: #74839b;
  font-size: 10px;
}

.history-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  min-width: 0;
}

.history-price {
  font-size: 17px;
  font-weight: 900;
}

.history-business {
  color: #637692;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.history-period {
  color: #607696;
  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.receipt-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
}

.status-accepted {
  background: #e0f8ee;
  color: #078858;
}

.status-pending {
  background: #fff3d8;
  color: #a66300;
}

.status-rejected {
  background: #ffe7e7;
  color: #c62828;
}

.status-no-receipt {
  background: #edf2f7;
  color: #607086;
}

.loading-state,
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 42px 22px;
  text-align: center;
}

.loading-state p {
  color: #6c7c94;
  font-size: 13px;
}

.empty-card {
  border: 1px solid #e5edf4;
  border-radius: 22px;
}

.empty-card h2 {
  font-size: 18px;
  font-weight: 800;
}

.empty-card p {
  max-width: 310px;
  color: #77859c;
  font-size: 13px;
  line-height: 1.6;
}

.payment-dialog {
  overflow: hidden;
  border-radius: 22px !important;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 18px 0;
}

.dialog-crown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background: #fff4d9;
}

.dialog-title {
  padding: 14px 22px 4px;
  font-size: 20px;
  font-weight: 800;
  white-space: normal;
}

.dialog-business {
  margin: 0 0 17px;
  color: #71809a;
  font-size: 13px;
}

.dialog-amount {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 15px;
  background: #effbf8;
}

.dialog-amount span,
.dialog-detail span {
  color: #75839b;
  font-size: 12px;
}

.dialog-amount strong {
  color: #008f87;
  font-size: 26px;
  font-weight: 900;
}

.dialog-detail {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #edf1f5;
}

.dialog-detail strong {
  max-width: 62%;
  font-size: 12px;
  text-align: right;
  overflow-wrap: anywhere;
}

.dialog-actions {
  padding: 12px 20px 20px;
}

.observation-box {
  margin-top: 15px;
  padding: 13px;
  border-radius: 12px;
  background: #fff5e6;
}

.observation-box strong {
  font-size: 13px;
}

.observation-box p {
  margin-top: 6px;
  color: #75562d;
  font-size: 12px;
  line-height: 1.5;
}

@media (min-width: 700px) {
  .membresia-page {
    padding: 28px 28px 45px;
  }

  .membership-card {
    padding: 26px;
  }

  .membership-info h3 {
    font-size: 19px;
  }

  .membership-price strong {
    font-size: 35px;
  }
}

@media (max-width: 380px) {
  .membresia-page {
    padding: 16px 5px 28px;
  }

  .membership-card {
    padding: 15px;
  }

  .membership-card-top {
    gap: 9px;
  }

  .crown-circle {
    width: 49px;
    height: 49px;
  }

  .membership-info h3 {
    font-size: 14px;
  }

  .membership-info p {
    font-size: 11px;
  }

  .status-chip {
    font-size: 10px;
  }

  .membership-price strong {
    font-size: 27px;
  }

  .history-card {
    gap: 9px;
    padding: 10px;
  }

  .history-date {
    width: 51px;
    min-width: 51px;
  }

  .history-period {
    font-size: 10px;
  }
}

.payment-dialog {
  display: flex;
  flex-direction: column;
  max-height: 85dvh;
  overflow: hidden;
  border-radius: 22px !important;
}

.payment-dialog :deep(.v-card-text) {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.dialog-header,
.dialog-actions {
  flex-shrink: 0;
}

.renew-sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90dvh;
  overflow: hidden;
}

.renew-sheet-header {
  flex: 0 0 auto;
  padding: 12px 20px 16px;
}

.renew-sheet-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
}

.renew-sheet-title-row {
  margin-top: 12px;
}

.renew-sheet-title-row h2 {
  margin: 0;
  line-height: 1.4;
}

.renew-sheet-title-row p {
  margin: 6px 0 0;
  line-height: 1.5;
}

.renew-sheet-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px 20px 20px;
}

.renew-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 12px;
  margin-bottom: 16px;
  border-radius: 16px;
  background: #effbf8;
  text-align: center;
}

.renew-amount strong {
  color: #008f87;
  font-size: 28px;
  font-weight: 800;
}

.renew-amount small {
  color: #718096;
  line-height: 1.5;
}

.qr-panel {
  padding: 14px;
  margin-bottom: 20px;
  border: 1px solid #dce7f0;
  border-radius: 16px;
}

.qr-renovacion {
  width: 100%;
}

.renew-sheet-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.renew-sheet-actions .v-btn {
  flex: 1 1 0;
  min-width: 0;
  white-space: normal;
}

@media (max-width: 400px) {
  .renew-sheet-header {
    padding: 10px 16px 14px;
  }

  .renew-sheet-content {
    padding: 14px 16px 18px;
  }

  .renew-sheet-actions .v-btn {
    font-size: 12px;
    letter-spacing: 0;
  }
}
</style>
