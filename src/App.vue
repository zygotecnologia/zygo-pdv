<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    console.log(process.env.GH_TOKEN);
  }
};
</script>

<style>
</style>
