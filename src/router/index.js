import { createRouter, createWebHistory } from 'vue-router';

// Импортируем View-компоненты
import GeneratorView from '../views/GeneratorView.vue';
import LibraryView from '../views/LibraryView.vue';
import SettingsView from '../views/SettingsView.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    redirect: '/generator' // Перенаправляем на генератор по умолчанию
  },
  {
    path: '/generator',
    name: 'Generator',
    component: GeneratorView
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  },
  {
    path: '/:pathMatch(.*)*', // Ловушка для любых других путей
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;