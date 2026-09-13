<script setup>
import { ref, computed } from 'vue'
import { RotateCcw, Coins, Banknote, Sparkles } from 'lucide-vue-next'

// Definición de las denominaciones del Sol Peruano (PEN)
const denominations = [
  { value: 200, label: 'S/ 200', type: 'bill', color: 'from-amber-500/20 to-orange-500/10' },
  { value: 100, label: 'S/ 100', type: 'bill', color: 'from-blue-500/20 to-cyan-500/10' },
  { value: 50, label: 'S/ 50', type: 'bill', color: 'from-violet-500/20 to-purple-500/10' },
  { value: 20, label: 'S/ 20', type: 'bill', color: 'from-amber-600/20 to-yellow-500/10' },
  { value: 10, label: 'S/ 10', type: 'bill', color: 'from-emerald-500/20 to-teal-500/10' },
  { value: 5, label: 'S/ 5', type: 'coin', color: 'from-amber-400/20 to-yellow-600/10' },
  { value: 2, label: 'S/ 2', type: 'coin', color: 'from-slate-400/20 to-gray-500/10' },
  { value: 1, label: 'S/ 1', type: 'coin', color: 'from-amber-500/20 to-yellow-500/10' },
  { value: 0.5, label: 'S/ 0.50', type: 'coin', color: 'from-yellow-400/20 to-amber-600/10' },
  { value: 0.2, label: 'S/ 0.20', type: 'coin', color: 'from-amber-500/20 to-yellow-600/10' },
  { value: 0.1, label: 'S/ 0.10', type: 'coin', color: 'from-amber-500/20 to-yellow-600/10' },
]

// Estado reactivo para almacenar las cantidades
const counts = ref({
  200: 0, 100: 0, 50: 0, 20: 0, 10: 0,
  5: 0, 2: 0, 1: 0, 0.5: 0, 0.2: 0, 0.1: 0
})

// Modificar cantidades de forma segura
const updateCount = (val, delta) => {
  const current = counts.value[val] || 0
  const updated = current + delta
  if (updated >= 0) {
    counts.value[val] = updated
  }
}

const handleInput = (val, event) => {
  const parsed = parseInt(event.target.value, 10)
  counts.value[val] = isNaN(parsed) || parsed < 0 ? 0 : parsed
}

// Limpiar todos los campos
const resetAll = () => {
  Object.keys(counts.value).forEach(key => {
    counts.value[key] = 0
  })
}

// Cálculos acumulados
const totalAmount = computed(() => {
  return Object.entries(counts.value).reduce((acc, [denom, qty]) => {
    return acc + (parseFloat(denom) * qty)
  }, 0)
})

const totalBills = computed(() => {
  return denominations
    .filter(d => d.type === 'bill')
    .reduce((acc, d) => acc + (counts.value[d.value] || 0), 0)
})

const totalCoins = computed(() => {
  return denominations
    .filter(d => d.type === 'coin')
    .reduce((acc, d) => acc + (counts.value[d.value] || 0), 0)
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(val)
}
</script>

<template>
  <div class="apple-container">
    <!-- Header principal -->
    <header class="header">
      <div class="header-content">
        <span class="badge">Soles Peruanos (PEN)</span>
        <h1>Contador de Divisas</h1>
      </div>
      <button @click="resetAll" class="btn-reset" title="Reiniciar todo">
        <RotateCcw :size="18" />
        <span>Limpiar</span>
      </button>
    </header>

    <!-- Card Totalizador (Apple Banner Glassmorphism) -->
    <section class="total-card">
      <div class="total-label">Total Arqueado</div>
      <div class="total-amount">{{ formatCurrency(totalAmount) }}</div>
      
      <div class="stats-row">
        <div class="stat-item">
          <Banknote :size="16" class="stat-icon" />
          <span>Billetes: <strong>{{ totalBills }}</strong></span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <Coins :size="16" class="stat-icon" />
          <span>Monedas: <strong>{{ totalCoins }}</strong></span>
        </div>
      </div>
    </section>

    <!-- Grilla de Denominaciones -->
    <main class="grid-container">
      <div 
        v-for="item in denominations" 
        :key="item.value" 
        class="denom-card"
      >
        <div class="denom-info">
          <div class="denom-icon" :class="item.type">
            <Banknote v-if="item.type === 'bill'" :size="20" />
            <Coins v-else :size="20" />
          </div>
          <div>
            <div class="denom-title">{{ item.label }}</div>
            <div class="denom-subtotal">
              Subtotal: {{ formatCurrency((counts[item.value] || 0) * item.value) }}
            </div>
          </div>
        </div>

        <!-- Controles de incremento/decremento -->
        <div class="controls">
          <button @click="updateCount(item.value, -1)" class="btn-step" :disabled="!counts[item.value]">-</button>
          <input 
            type="number" 
            min="0" 
            :value="counts[item.value]" 
            @input="e => handleInput(item.value, e)"
            class="count-input" 
          />
          <button @click="updateCount(item.value, 1)" class="btn-step">+</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Reset global e importación de fuente estilo San Francisco */
@import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');

:root {
  --bg-main: #f5f5f7;
  --card-bg: rgba(255, 255, 255, 0.75);
  --card-border: rgba(255, 255, 255, 0.6);
  --text-primary: #1d1d1f;
  --text-secondary: #86868b;
  --accent-color: #0071e3;
  --accent-hover: #0077ed;
  --radius-lg: 22px;
  --radius-md: 14px;
  --shadow-soft: 0 8px 30px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.03);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

/* Ocultar flechas de inputs numéricos */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}

.apple-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 20px 60px 20px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.badge {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-secondary);
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 2px 0 0 0;
  letter-spacing: -0.5px;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0,0,0,0.08);
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #e53e3e;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.btn-reset:hover {
  background: #fff;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.15);
}

/* Target Totalizador (Apple Glassmorphism Card) */
.total-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 244, 255, 0.8) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  text-align: center;
  box-shadow: var(--shadow-soft);
  margin-bottom: 28px;
}

.total-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-amount {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -1px;
  margin: 6px 0 16px 0;
  color: var(--text-primary);
}

.stats-row {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.03);
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 13px;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-item strong {
  color: var(--text-primary);
}

.stat-divider {
  width: 1px;
  height: 12px;
  background: rgba(0, 0, 0, 0.12);
}

/* Grilla */
.grid-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.denom-card {
  background: var(--card-bg);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-card);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.denom-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
}

.denom-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.denom-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.denom-icon.bill {
  background: rgba(0, 113, 227, 0.1);
  color: var(--accent-color);
}

.denom-icon.coin {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

.denom-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.denom-subtotal {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Controles estilo Apple Segmented Control */
.controls {
  display: flex;
  align-items: center;
  background: rgba(118, 118, 128, 0.12);
  padding: 3px;
  border-radius: 10px;
}

.btn-step {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.1s ease;
}

.btn-step:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.btn-step:active:not(:disabled) {
  transform: scale(0.92);
}

.btn-step:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.count-input {
  width: 50px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
}
</style>