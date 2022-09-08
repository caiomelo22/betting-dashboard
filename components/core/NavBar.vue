<template>
    <div id="nav">
        <nuxt-link :class="{ active: $route.path == '/dashboard' }" to="/dashboard">Dashboard</nuxt-link>
        <nuxt-link :class="{ active: $route.path == '/bets' }" to="/bets">Bets</nuxt-link>
        <nuxt-link :class="{ active: $route.path == '/matches' }" to="/matches" style="margin-right: 8px">Matches</nuxt-link>

        <font-awesome-icon v-if="$vuetify.theme.dark" @click="$vuetify.theme.dark = false"
            :icon="['fa', 'sun']" style="color: #41b883" />
        <font-awesome-icon v-else @click="$vuetify.theme.dark = true" :icon="['fa', 'moon']" style="color: #41b883" />
    </div>
</template>

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