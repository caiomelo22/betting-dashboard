<template>
    <v-app>
        <NavBar />
        <Footer />
        <Nuxt class="main" />
    </v-app>
</template>

<script>
import Footer from "@/components/core/Footer.vue";
import NavBar from "@/components/core/NavBar.vue";

export default {
    components: {
        Footer,
        NavBar
    },
    created() {
        const accessToken = this.$cookies.get('accessToken');
        const refreshToken = this.$cookies.get('refreshToken');

        this.$store.commit('setTokens', { accessToken, refreshToken });

        return { accessToken, refreshToken };
    }
};
</script>

<style scoped>
.main {
    padding-bottom: 45px;
}
</style>
