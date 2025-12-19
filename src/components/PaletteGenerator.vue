<!-- src/components/PaletteGenerator.vue (обновленный) -->
<template>
  <div class="demo-container">
    <h2>🎨 Генератор цветовых палитр</h2>

    <!-- Управление -->
    <div class="controls">
      <div>
        <label>Количество цветов:</label>
        <select v-model.number="colorCount">
          <option :value="3">3</option>
          <option :value="5">5</option>
          <option :value="7">7</option>
        </select>
      </div>

      <div>
        <label>Формат:</label>
        <select v-model="displayFormat">
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>
      </div>

      <button @click="generatePalette" class="generate-btn">Случайная палитра</button>

      <label>
        <input type="checkbox" v-model="isDarkMode"> Тёмный фон
      </label>
    </div>

    <!-- Палитра -->
    <div class="palette" :class="{ dark: isDarkMode }">
      <div
        v-for="(color, index) in palette"
        :key="index"
        class="color-item"
        :style="{ backgroundColor: color.hex }"
        @click="copyColor(color.hex, index)"
      >
        <span class="color-value">{{ displayFormat === 'hex' ? color.hex : color.rgb }}</span>
        <button @click.stop="toggleLock(index)" class="lock-btn" :class="{ locked: color.locked }">
          {{ color.locked ? '🔒' : '🔓' }}
        </button>
        <div v-if="copiedIndex === index" class="toast">Скопировано!</div>
      </div>
    </div>

    <!-- Динамическое превью (использует текущую палитру) -->
    <PreviewSection :palette="palette" :is-dark-mode="isDarkMode" />

    <!-- Блок сохранения -->
    <div class="save-section">
      <h3>📌 Сохранение палитры</h3>
      <div class="save-controls">
        <CustomInput v-model="paletteName" label="Название палитры:" placeholder="Например: Мои осенние тона" />
        <button @click="savePalette" class="save-btn" :disabled="!paletteName">Сохранить в библиотеку</button>
      </div>
    </div>

    <!-- Библиотека палитр -->
    <div class="library-section">
      <h3>📚 Библиотека палитр</h3>
      <div v-if="savedPalettes.length === 0" class="empty-state">
        <p>Пока нет сохраненных палитр. Сгенерируйте и сохраните первую!</p>
      </div>
      <div v-else class="palettes-list">
        <div
          v-for="savedPalette in savedPalettes"
          :key="savedPalette.id"
          class="saved-palette-item"
          :class="{ dark: isDarkMode }"
        >
          <div class="palette-header">
            <h4>{{ savedPalette.name || 'Без названия' }}</h4>
            <div class="palette-actions">
              <button @click="loadSavedPalette(savedPalette.colors)" class="load-btn">Загрузить</button>
              <button @click="deleteSavedPalette(savedPalette.id)" class="delete-btn">Удалить</button>
            </div>
          </div>
          <div class="palette-colors">
            <div
              v-for="(color, index) in savedPalette.colors"
              :key="index"
              class="saved-color-strip"
              :style="{ backgroundColor: color.hex }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о сохранении -->
    <div class="save-info">
      <p>Текущая палитра сохраняется автоматически.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import CustomInput from './CustomInput.vue';
import PreviewSection from './PreviewSection.vue'; // Импортируем новый компонент

const colorCount = ref(5);
const displayFormat = ref('hex');
const isDarkMode = ref(false);
const copiedIndex = ref(null);
const paletteName = ref('');

const palette = ref([]);

// Состояние для библиотеки
const savedPalettes = ref([]);

// --- Функции ---

const getRandomHex = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

const generatePalette = () => {
  const newPalette = [];
  for (let i = 0; i < colorCount.value; i++) {
    const existing = palette.value[i];
    if (existing && existing.locked) {
      newPalette.push({ ...existing });
    } else {
      const hex = getRandomHex();
      newPalette.push({
        hex,
        rgb: hexToRgb(hex),
        locked: false
      });
    }
  }
  palette.value = newPalette;
};

const copyColor = async (hex, index) => {
  try {
    await navigator.clipboard.writeText(hex);
    copiedIndex.value = index;
    setTimeout(() => { copiedIndex.value = null; }, 1000);
  } catch (err) {
    console.error("Ошибка копирования:", err);
  }
};

const toggleLock = (index) => {
  palette.value[index].locked = !palette.value[index].locked;
};

const loadPalette = () => {
  const saved = localStorage.getItem('palette');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      palette.value = parsed.map(c => ({
        ...c,
        rgb: c.rgb || hexToRgb(c.hex)
      }));
    } catch (e) {
      console.error("Ошибка при загрузке палитры:", e);
      generatePalette();
    }
  } else {
    generatePalette();
  }
};

// Сохранение в localStorage при изменениях
watchEffect(() => {
  localStorage.setItem('palette', JSON.stringify(palette.value));
});

// Загрузка библиотеки палитр
const loadSavedPalettes = () => {
  const stored = localStorage.getItem('saved-palettes');
  if (stored) {
    try {
      savedPalettes.value = JSON.parse(stored);
    } catch (e) {
      console.error("Ошибка загрузки библиотеки палитр:", e);
      savedPalettes.value = [];
    }
  }
};

// Сохранение текущей палитры в библиотеку
const savePalette = () => {
  if (!paletteName.value.trim() || palette.value.length === 0) return;

  const newPaletteEntry = {
    id: Date.now(),
    name: paletteName.value.trim(),
    colors: palette.value,
    createdAt: new Date().toISOString()
  };

  savedPalettes.value.push(newPaletteEntry);
  localStorage.setItem('saved-palettes', JSON.stringify(savedPalettes.value));

  paletteName.value = '';
  alert(`Палитра "${newPaletteEntry.name}" сохранена!`);
};

// Загрузка сохранённой палитры
const loadSavedPalette = (colors) => {
  palette.value = colors.map(c => ({ ...c, rgb: c.rgb || hexToRgb(c.hex) }));
};

// Удаление сохранённой палитры
const deleteSavedPalette = (id) => {
  savedPalettes.value = savedPalettes.value.filter(p => p.id !== id);
  localStorage.setItem('saved-palettes', JSON.stringify(savedPalettes.value));
};

onMounted(() => {
  loadPalette();
  loadSavedPalettes();
});
</script>

<style scoped>
/* (стили остаются прежними, но добавим стили для нового блока превью) */

.demo-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.controls {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.palette {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f0f0f0;
}

.palette.dark {
  background-color: #333;
}

.color-item {
  position: relative;
  flex: 1;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.color-item:hover {
  transform: scale(1.03);
  box-shadow: inset 0 0 10px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.2);
}

.color-value {
  font-size: 12px;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 2;
}

.lock-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  z-index: 2;
  transition: background 0.2s ease;
}

.lock-btn:hover {
  background: rgba(255,255,255,1);
}

.lock-btn.locked {
  background: gold;
}

.toast {
  position: absolute;
  top: -25px;
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 3;
  animation: fadeOut 1s forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; top: -25px; }
  100% { opacity: 0; top: -35px; }
}

.save-section {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.save-controls {
  display: flex;
  gap: 10px;
  align-items: end;
}

.save-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  background-color: #218838;
}

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.library-section {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #333;
}

.library-section h3 {
  margin-bottom: 15px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.palettes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.saved-palette-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.saved-palette-item.dark {
  background-color: #333;
  border-color: #555;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.palette-header h4 {
  margin: 0;
  font-size: 1rem;
}

.palette-actions {
  display: flex;
  gap: 5px;
}

.load-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.load-btn {
  background-color: #007bff;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.palette-colors {
  display: flex;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
}

.saved-color-strip {
  flex: 1;
}

.save-info {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>