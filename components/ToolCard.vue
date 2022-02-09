<template>
  <!-- <v-card class="mx-auto" link :href="tool.downloadLink" download> -->
    <v-hover>
      <template v-slot:default="{ hover }">
      <v-card class="mx-auto" :elevation="hover?0:10">
        <div class="overflowHidden">
          <v-img :class="hover?'white--text zoom-class':'white--text'" :src="tool.toolThumbnail" height="270">
          </v-img>
        </div>
        <!-- <nuxt-img :src="`${tool.toolThumbnail}`" /> -->
        <v-fade-transition>
            <v-overlay
              v-if="hover"
              absolute
              color="#000"
            >
              <v-btn color="error" link :href="tool.downloadLink" download v-if="tool.downloadLink">Download <v-icon right>mdi-tray-arrow-down</v-icon></v-btn>
            </v-overlay>
          </v-fade-transition>
        <v-card-actions class="error">
          <p
            :class="[$vuetify.breakpoint.mobile?'mb-0 pa-2 white--text':'mb-0 pa-2 font-weight-bold white--text', hover?'':'my-smart-text-line']" style="letter-spacing: 1px;"
            >{{ tool.name }}</p>
          <!-- <v-card-subtitle
            :class="[
              $vuetify.breakpoint.mobile ? 'py-0 px-0' : 'py-0 font-weight-bold', hover?'':'my-smart-text-line']
            "
            :style="$vuetify.breakpoint.mobile ? 'font-size: 13px' : ''"
            >{{ tool.name }}</v-card-subtitle
          > -->
          <v-spacer />
          <v-btn color="white" icon v-if="tool.downloadLink"><v-icon left>mdi-tray-arrow-down</v-icon></v-btn>
          <v-btn color="white" v-else text>after {{tool.forTheMonth}} days</v-btn>
        </v-card-actions>
      </v-card>
      </template>
    </v-hover>
</template>
<script>
export default {
  name: "student-dashboard",
  layout: "default",
  props: {
    tool: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
  }),
  mounted() {
  },
};
</script>

<style scoped>
.v-image{
 transition: 0.5s;
}
.v-image__image{
 background-size:100% 100%;
}
.overflowHidden
{
  overflow:hidden !important;
}
.zoom-class.v-image
{
  -webkit-transform: scale(1.05);
  transform: scale(1.05);
}
</style>