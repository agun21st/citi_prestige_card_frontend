<template></template>

<script>
export default {
  name: "index",
  layout: "custom",
  data: () => ({}),
  mounted() {
    // if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    if (this.$auth.loggedIn) {
      if (this.$auth.user.auth_id == 2) {
        this.$router.push("/super-admin/dashboard");
      }else {
        this.$router.push("/admin/dashboard");
      }
    }else {
      console.log("index/login else");
      this.$router.push("/login");
    }
  },
  methods: {},
};
</script>