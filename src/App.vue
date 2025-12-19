<template>
  <div id="app">
    <header class="app-header">
      <h1>🎨 Генератор цветовых палитр</h1>
    </header>
    <!-- Навигация -->
    <nav class="main-nav">
      <router-link to="/generator" class="nav-link">Генератор</router-link>
      <router-link to="/library" class="nav-link">Библиотека</router-link>
      <router-link to="/settings" class="nav-link">Настройки</router-link>
    </nav>
    <!-- Содержимое текущего маршрута -->
    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer class="app-footer">
      <p>Vue 3 • Практика 27-28 • Контрольная работа №5</p>
    </footer>
  </div>
</template>

<script>
// Если нужно, можно импортировать глобальные стили или хелперы
export default {
  name: 'App',
  // Можно добавить setup() если понадобятся глобальные состояния или методы
}
</script>

<style>
/* (стили из предыдущего App.vue или новые) */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}
.main-nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.nav-link {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
}
.nav-link:hover {
  background-color: #f0f0f0;
}
.nav-link.router-link-active {
  background-color: #007bff;
  color: white;
}
.main-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>