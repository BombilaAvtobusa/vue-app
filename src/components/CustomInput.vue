<template>
  <div class="custom-input-wrapper">
    <label v-if="label">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="custom-input"
      type="text"
    />
    <button v-if="modelValue" @click="$emit('update:modelValue', '')" class="clear-btn">×</button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  placeholder: String
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.custom-input-wrapper {
  position: relative;
  margin: 10px 0;
}
.custom-input {
  width: 100%;
  padding: 8px 30px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
}
</style>