<template>
    <div id="nav">
        <nuxt-link :class="{ active: $route.path == '/dashboard' }" to="/dashboard">Dashboard</nuxt-link>
        <nuxt-link :class="{ active: $route.path == '/bets' }" to="/bets">Bets</nuxt-link>
        <nuxt-link :class="{ active: $route.path == '/parlays' }" to="/parlays">Parlays</nuxt-link>

        <font-awesome-icon v-if="$vuetify.theme.dark" :icon="['fa', 'sun']"
            style="color: #41b883; cursor: pointer; margin-left: 8px" @click="toggleTheme(false)" />
        <font-awesome-icon v-else :icon="['fa', 'moon']" style="color: #41b883; cursor: pointer; margin-left: 8px"
            @click="toggleTheme(true)" />
    </div>
</template>

<script>
export default {
    name: 'NavBar',
    mounted() {
        const isDark = localStorage.getItem('theme.dark') == "true"
        this.$vuetify.theme.dark = isDark
    },
    methods: {
        toggleTheme(isDark) {
            this.$vuetify.theme.dark = isDark;
            // Save the theme preference in localStorage
            localStorage.setItem('theme.dark', isDark);
        }
    }
}
</script>

<style scoped>
#nav {
    margin: 10px 0px 20px 0px;
    text-align: center;
}

#nav a {
    text-decoration: none;
    display: inline-block;
    padding: 5px 10px 5px 10px;
    font-size: 20px;
    line-height: 24px;
    color: #41b883;
}

#nav a:hover {
    background: #41b883;
    color: white;
    border-radius: 4px;
}
</style>
