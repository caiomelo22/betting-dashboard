<template>
  <v-app>
    <NavBar />
    <Nuxt class="main" />
    <Footer />
  </v-app>
</template>
<script>
import Footer from "@/components/core/Footer.vue";
import NavBar from "@/components/core/NavBar.vue";
export default {
  components: {
    Footer,
    NavBar
  }
};
</script>
<style scoped>
.main {
  padding-bottom: 45px;
}
</style>
