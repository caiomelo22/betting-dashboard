<template>
  <div></div>
</template>

<script>
export default {
  name: "DashboardPage",
  created() {
    this.$router.push('/dashboard');
  }
};
</script>

<style scoped>
.under-maintenance-text {
  padding: 24px;
  text-align: center;
}
</style>