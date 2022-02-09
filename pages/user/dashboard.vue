<template>
  <v-row>
    <v-col class="text-center my-10">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <!-- <v-btn @click="fetchApi">Click Me</v-btn> -->
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "user-dashboard",
  layout: "userLayout",
  methods: {
    async fetchApi() {
      try {
        const result = await fetch(this.$cit.citBaseUrl + "/api/apiCall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // credentials: "include", //! for cookie accept
        });
        if (result.ok) {
          console.log(result.success);
        } else {
          alert("Something goes worng from logout page in try section");
        }
      } catch (e) {
        alert("something goes wrong from logout component catch section: " + e);
      }
    },
  },
};
</script>

<style scoped>
</style>
