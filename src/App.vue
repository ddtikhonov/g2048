<template>
  <div class="app-container">
    <Header></Header>
    <PlayingField></PlayingField>
    <Footer></Footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    Header: () => import("./components/Header"),
    PlayingField: () => import("./components/PlayingField"),
    Footer: () => import("./components/Footer")
  }
}
</script>

<style lang="scss">
@import "./src/assets/css/template";
</style>
