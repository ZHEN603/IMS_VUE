<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  .app-container{
    padding: 20px 30px;
  }
@media (max-width: 800px) {
  .app-container {
    padding: 20px 0px;
  }
}
</style>
