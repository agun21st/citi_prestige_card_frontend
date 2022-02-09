<template>
  <v-container>
    <h1 class="secondary--text mb-5">Admin Dashboard</h1>
  </v-container>
</template>

<script>
export default {
  name: "admin-dashboard",
  layout: "admin",
  data: () => ({
  }),
  mounted() {
    console.log("index/login admin dashboard");
    // if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
  }
};
</script>

<style scoped>
</style>