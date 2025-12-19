<template>
  <div class="library-view">
    <h2>📚 Библиотека палитр</h2>
    <div v-if="savedPalettes.length === 0" class="empty-state">
      <p>Пока нет сохраненных палитр. Сгенерируйте и сохраните первую!</p>
    </div>
    <div v-else class="palettes-grid">
      <PaletteItem
        v-for="palette in savedPalettes"
        :key="palette.id"
        :palette-data="palette"
        @delete="removePalette"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PaletteItem from '../components/PaletteItem.vue';

const savedPalettes = ref([]);

const loadPalettes = () => {
  const stored = localStorage.getItem('saved-palettes');
  if (stored) {
    try {
      savedPalettes.value = JSON.parse(stored);
    } catch (e) {
      console.error("Ошибка загрузки палитр:", e);
      savedPalettes.value = [];
    }
  }
};

const removePalette = (id) => {
  savedPalettes.value = savedPalettes.value.filter(p => p.id !== id);
  localStorage.setItem('saved-palettes', JSON.stringify(savedPalettes.value));
};

onMounted(() => {
  loadPalettes();
});
</script>

<style scoped>
.library-view {
  padding: 20px;
}
.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>