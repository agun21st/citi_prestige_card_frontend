<template>
  <div>
    <h1>My Courses</h1>
  </div>
</template>

<script>
export default {
  name: "student-my-courses",
  layout: "default",
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
  }
};
</script>

<style scoped>
</style>