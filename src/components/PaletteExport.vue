<template>
  <div class="export-section">
    <h3>Экспорт палитры</h3>
    <p>Скопируйте CSS переменные для использования в проекте.</p>
    <pre class="css-vars-code">{{ cssVariablesCode }}</pre>
    <button @click="copyCssCode" class="copy-css-btn">Копировать CSS</button>
    <div v-if="showCopyMessage" class="copy-success">Скопировано в буфер!</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const showCopyMessage = ref(false);

const currentPalette = ref([]);

const loadCurrentPalette = () => {
  const stored = localStorage.getItem('palette');
  if (stored) {
    try {
      currentPalette.value = JSON.parse(stored);
    } catch (e) {
      console.error("Ошибка загрузки текущей палитры для экспорта:", e);
      currentPalette.value = [];
    }
  }
};

const cssVariablesCode = computed(() => {
  if (!currentPalette.value || currentPalette.value.length === 0) return '';
  return currentPalette.value.map((color, index) => `--color-${index + 1}: ${color.hex};`).join('\n');
});

const copyCssCode = async () => {
  try {
    await navigator.clipboard.writeText(cssVariablesCode.value);
    showCopyMessage.value = true;
    setTimeout(() => { showCopyMessage.value = false; }, 2000);
  } catch (err) {
    console.error('Ошибка копирования CSS:', err);
  }
};

onMounted(() => {
  loadCurrentPalette();
});
</script>

<style scoped>
.export-section {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}
.css-vars-code {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
}
.copy-css-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.copy-success {
  margin-top: 10px;
  color: #28a745;
  font-weight: bold;
}
</style>