<template>
  <v-container>
    <h1 class="secondary--text mb-5">Super-Admin Dashboard</h1>
  </v-container>
</template>

<script>
export default {
  name: "admin-dashboard",
  layout: "super_admin",
  data: () => ({
  }),
  mounted() {
    console.log("index/login super admin dashboard");
    // if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
  }
};
</script>

<style scoped>
</style>