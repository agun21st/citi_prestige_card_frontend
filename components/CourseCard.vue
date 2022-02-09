<template>
  <!-- <v-card class="mx-auto" link :href="tool.downloadLink" download> -->
    <div>
      <NuxtLink :to="courseName+'/'+course.course.id" style="text-decoration: none;">
        <v-hover>
          <template v-slot:default="{ hover }">
          <v-card class="mx-auto" :elevation="hover?10:5" :title="`Show ${course.course.name.toUpperCase()} Tools`">
            <div class="overflowHidden">
              <v-img :class="hover?'white--text zoom-class':'white--text'" :src="course.course.courseThumbnail" height="270"></v-img>
            </div>
            <v-card-actions class="error d-flex justify-center align-center">
              <p
                :class="[$vuetify.breakpoint.mobile?'mb-0 pa-2 white--text text-h6':'mb-0 pa-2 font-weight-bold white--text', hover?'':'my-smart-text-line']"
                style="letter-spacing: 2px !important;">{{ course.course.name.toUpperCase() }}</p>
            </v-card-actions>
          </v-card>
          </template>
        </v-hover>
      </NuxtLink>
    </div>
</template>
<script>
export default {
  name: "student-dashboard",
  layout: "default",
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    overlay: false,
    courseName: "",
  }),
  mounted() {
    // console.log(this.course);
    this.courseName = this.makeSlug(this.course.course.name);
  },
  methods: {
    makeSlug(slug)
    {
      return slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
  }
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