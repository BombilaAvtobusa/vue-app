<template>
  <div class="palette-item">
    <h3>{{ paletteData.name || 'Без названия' }}</h3>
    <div class="color-strips">
      <div
        v-for="(color, index) in paletteData.colors"
        :key="index"
        class="color-strip"
        :style="{ backgroundColor: color.hex }"
      ></div>
    </div>
    <div class="item-actions">
      <button @click="loadPalette" class="load-btn">Загрузить</button>
      <button @click="deletePalette" class="delete-btn">Удалить</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  paletteData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete']);

const loadPalette = () => {
  // Сохраняем палитру в localStorage как "текущую" и переходим на генератор
  localStorage.setItem('palette', JSON.stringify(props.paletteData.colors));
  router.push('/generator');
};

const deletePalette = () => {
  emit('delete', props.paletteData.id);
};
</script>

<style scoped>
.palette-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.color-strips {
  display: flex;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}
.color-strip {
  flex: 1;
}
.item-actions {
  display: flex;
  gap: 10px;
}
.load-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.load-btn {
  background-color: #007bff;
  color: white;
}
.delete-btn {
  background-color: #dc3545;
  color: white;
}
</style>