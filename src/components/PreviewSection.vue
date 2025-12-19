<template>
  <div class="preview-section" :class="{ dark: isDarkMode }">
    <h3>Превью использования</h3>

    <!-- Заголовок - использует первый цвет из палитры -->
    <h4 :style="{ color: palette[0]?.hex || '#000' }">Заголовок</h4>

    <!-- Обычный текст - использует второй цвет из палитры -->
    <p :style="{ color: palette[1]?.hex || '#666' }">
      Обычный текст.
      <strong :style="{ color: palette[2]?.hex || '#007bff' }">А это — акцентный текст.</strong>
    </p>

    <!-- Кнопка - использует третий цвет из палитры -->
    <button
      class="preview-btn"
      :style="{
        backgroundColor: palette[3]?.hex || '#007bff',
        color: getContrastColor(palette[3]?.hex || '#007bff')
      }"
    >
      Кнопка
    </button>

    <!-- Карточка с фоном - использует четвертый цвет из палитры -->
    <div
      class="preview-card"
      :style="{
        backgroundColor: palette[4]?.hex || '#e9ecef',
        color: getContrastColor(palette[4]?.hex || '#e9ecef')
      }"
    >
      Карточка с фоном
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

// Принимаем палитру и тему как пропсы
const props = defineProps({
  palette: {
    type: Array,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
});

// Функция для определения контрастного цвета (черный или белый) для текста
const getContrastColor = (hexColor) => {
  // Преобразуем HEX в RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Вычисляем относительную яркость (Luminance)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Если яркость выше 0.5, то текст черный, иначе белый
  return luminance > 0.5 ? '#000' : '#fff';
};
</script>

<style scoped>
.preview-section {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #333;
}

.preview-section.dark {
  background-color: #222;
  color: #f0f0f0;
}

.preview-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.preview-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.preview-card {
  margin-top: 10px;
  padding: 15px;
  border-radius: 6px;
  transition: all 0.2s ease;
}
</style>