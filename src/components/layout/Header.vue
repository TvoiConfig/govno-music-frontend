<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <header>
    <div class="navbar container-fluid d-flex justify-content-center align-items-center fixed-top">
      <router-link class="p-2" to="/">Главная</router-link>
      <router-link class="p-2" to="/favorite">Любимые треки</router-link>
      <router-link class="p-2" to="/upload">Публикация треков</router-link>

      <div class="ms-auto">
        <RouterLink class="p-2" to="/login">Войти</RouterLink>
        <a class="p-2" href="#">Регистрация</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: #1E1E1E;
}

.navbar a{
  color: #E0E0E0;
  text-decoration: none;
}

.navbar a:hover {
  transform: translate(0px, 1px);
  color: #FF4081;
  transition: all ease .4s;
}

.active-link {
  color: #FF4081;
}
</style>