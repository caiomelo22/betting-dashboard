<template>
    <div class="footer">by Caio Graça Melo @{{ currentYear }}</div>
</template>
<script>
export default {
    name: 'Footer',
    data: () => ({
        currentYear: null,
    }),
    mounted() {
        this.currentYear = this.$moment().year()
    },
}
</script>
<style scoped></style>