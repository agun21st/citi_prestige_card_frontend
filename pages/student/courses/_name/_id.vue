<template>
<div>
  <v-toolbar dark class="d-none d-lg-flex d-md-flex justify-center">
        <v-toolbar-items
          v-for="(item, index) in $store.state.fiveCategoryItems"
          :key="index"
          class="ml-5"
        >
          <v-menu open-on-hover bottom offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                v-bind="attrs"
                v-on="on"
                text
                @click="getToolsByCourse(item, 'category', 'fromCategory')"
              >
                <span class="pa-2 text-capitalize">
                  {{ item.name }}
                  <!-- <v-icon right> -->
                  <v-icon right v-if="item.sub_categories.length !== 0">
                    mdi-menu-down
                  </v-icon>
                  </span>
              </v-btn>
            </template>

            <!-- <v-list> -->
            <v-list v-if="item.sub_categories.length !== 0" style="max-height:300px; overflow-y: scroll;">
              <v-list-item
                v-for="(item, index) in item.sub_categories"
                :key="index"
                link
                @click="getToolsByCourse(item, 'subCategory', 'fromSubCategory')"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-toolbar-items v-if="$store.state.moreCategories.length !== 0">
          <v-menu open-on-hover bottom offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark v-bind="attrs" v-on="on" text>
                <span class="pa-2 text-capitalize"
                  >More <v-icon right>mdi-menu-down</v-icon></span
                >
              </v-btn>
            </template>
            <v-list style="max-height:300px; overflow-y: scroll;">
              <v-list-item
                v-for="(item, index) in $store.state.moreCategories"
                :key="index"
                link
                @click="getToolsByCourse(item, 'category', 'fromCategory')"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-spacer />
        <v-toolbar-items v-if="$store.state.myFirstCourse">
          <v-btn
            dark
            text
            @click="getToolsByCourse($store.state.myFirstCourse, 'department','fromDepartment')"
          >
            <span
              style="border: 2px solid gray; border-radius: 35px"
              class="pa-2 text-capitalize"
              >{{ $store.state.myFirstCourse }}</span
            >
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-if="$store.state.mySecondCourse">
          <v-btn
            dark
            text
            @click="getToolsByCourse($store.state.mySecondCourse, 'department','fromDepartment')"
          >
            <span
              style="border: 2px solid gray; border-radius: 35px"
              class="pa-2 text-capitalize"
              >{{ $store.state.mySecondCourse }}</span
            >
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-if="$store.state.totalCourses != 0" class="mr-md-13">
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark v-bind="attrs" v-on="on" text>
                <span
                  style="border: 2px solid gray; border-radius: 35px"
                  class="pa-2 text-capitalize"
                  >More {{ $store.state.totalCourses }}</span
                >
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in $store.state.fixedCourses"
                :key="index"
                link
                @click="getToolsByCourse(item, 'department','fromDepartment')"
              >
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
    </v-toolbar>
    <v-container>
      <v-btn nuxt to="/student/courses/my-courses" color="red" class="mt-5 white--text"><v-icon left>mdi-keyboard-backspace</v-icon> My Courses</v-btn>
      <v-toolbar flat class="mt-8">
        <v-toolbar-title class="font-weight-bold ml-n5" :style="$vuetify.breakpoint.mobile ?'font-size:16px':'font-size:30px'">
          {{ this.name.replace(/-/g, " ").toUpperCase() }}
      </v-toolbar-title>
      <v-spacer/>
      <v-text-field
        v-model="searchByToolName"
        label="Search..."
        append-icon="mdi-magnify"
        rounded
        clearable
        dense
        hide-details
        filled
        single-line
        class="shrink"
        color="error"
        v-show="$vuetify.breakpoint.mobile ?false:true"
        :loading="searchBoxLoader"
        @click:clear="clearSearchInitialize"
        @keyup="myDebounce"
      >
      </v-text-field>
      </v-toolbar>
      <v-text-field
        v-model="searchByToolName"
        label="Search..."
        append-icon="mdi-magnify"
        rounded
        dense
        hide-details
        filled
        single-line
        class="shrink"
        color="error"
        clearable
        v-show="$vuetify.breakpoint.mobile ?true:false"
        @keyup="myDebounce"
        @click:clear="clearSearchInitialize"
      >
      </v-text-field>
      <!-- <h1>{{ this.name.replace(/-/g, " ").toUpperCase() }} / {{ this.id }}</h1> -->
      <v-row v-if="activeTools.length != 0" class="my-2">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="tool in activeTools"
          :key="tool.id"
        >
          <ToolCard :tool="tool" />
        </v-col>
      </v-row>
      <v-row v-if="activeTools.length == 0" class="my-2">
        <v-col cols="12">
          <div class="text-center">
            <h2>No tools found</h2>
          </div>
        </v-col>
      </v-row>
      <div class="py-5">
        <v-pagination
          v-if="activeTools.length != 0"
          v-model="toolsPagination"
          :length="toolsTotal"
          :total-visible="7"
          @input="getToolsByPagination(toolsPagination,'fromActiveTools')"
          color="black"
          >
        </v-pagination>
      </div>
      <v-toolbar flat class="mt-8">
        <v-toolbar-title class="font-weight-bold ml-n5" :style="$vuetify.breakpoint.mobile ?'font-size:16px':'font-size:30px'" v-if="inactiveTools.length != 0">WILL BE UNLOCKED
        </v-toolbar-title>
      </v-toolbar>
      <v-row v-if="inactiveTools.length != 0" class="mb-16 mt-8">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="tool in inactiveTools"
          :key="tool.id"
        >
          <ToolCard :tool="tool" />
        </v-col>
      </v-row>
      <!-- <v-row v-if="inactiveTools.length == 0" class="my-2">
        <v-col cols="12">
          <div class="text-center">
            <h2>No tools found</h2>
          </div>
        </v-col>
      </v-row> -->
      <div class="py-5">
        <v-pagination
          v-if="inactiveTools.length != 0"
          v-model="inactiveToolsPagination"
          :length="inactiveToolsTotal"
          :total-visible="7"
          @input="getToolsByPagination(inactiveToolsPagination,'fromInactiveTools')"
          color="black">
        </v-pagination>
      </div>
    </v-container>
    <v-dialog
      v-model="paginationLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="error"
        dark
      >
        <v-card-text>
          Tools are Loading...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
  export default {
    name: "student-dashboard",
    layout: "default",
    // async asyncData({params,$axios,$auth,$cit,store}) {
    //   // console.log(store)
    //   const name = params.name;
    //   const course_id = params.id;
    //   let activeTools = [];
    //   let inactiveTools = [];
    //   let toolsPagination = 1;
    //   let per_page = 8;
    //   let toolsTotal = 1;
    //   let inactiveToolsPagination = 1;
    //   let inactiveToolsTotal = 1;
    //   await $axios.$get($cit.citBaseUrl + `/api/get-tools-by-course/${course_id}?page=1`,{withCredentials: true,headers:{"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json",},})
    //   .then((res)=>{
    //     // console.log(res);
    //     activeTools = res.activeTools.data;
    //     toolsPagination = res.activeTools.current_page;
    //     per_page = res.activeTools.per_page;
    //     toolsTotal = res.activeTools.last_page;
    //     // store.dispatch("fireToolsPagination", {
    //       //   toolsPagination: res.activeTools.current_page,
    //     //   per_page: res.activeTools.per_page,
    //     //   toolsTotal: res.activeTools.last_page,

    //     // });
    //     inactiveTools = res.inactiveTools.data;
    //     inactiveToolsPagination = res.inactiveTools.current_page;
    //     inactiveToolsTotal = res.inactiveTools.last_page;
    //     // console.log("------------------")
    //     // console.log(res.getCourseCategories)
    //     // console.log("------------------")
    //     if (res.getCourseCategories.length != 0) {
    //       store.dispatch("fireFiveCategoryItems", res.getCourseCategories.slice(0, 5));
    //       store.dispatch("fireMoreCategories", res.getCourseCategories.slice(5, res.getCourseCategories.length));
    //       // console.log("I am getCourseCategories if Function");
    //     }
    //   })
    //   .catch((error)=>{
    //     if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
    //   });
    //   // console.log(context)
    //   return { name, course_id, activeTools, inactiveTools, toolsPagination, per_page, toolsTotal, inactiveToolsTotal, inactiveToolsPagination}
    // },
    data: () => ({
      activeToolsVisibility: true,
      inactiveToolsVisibility: true,
      paginationLoading: false,
      searchBoxLoader: false,
      searchByToolName: "",
      course_id: 0,
      toolsPagination: 1,
      inactiveToolsPagination: 1,
      per_page: 0,
      toolsTotal: 0,
      inactiveToolsTotal: 0,
      name: "",
      activeTools: [],
      inactiveTools: [],
    }),
    watch: {
      // searchByToolName() {
      //   this.getToolsByCourse('', '', 'fromSearchBox');
      // },
    },
    mounted() {
      this.course_id = this.$route.params.id;
      if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
      this.initialize();
    },
    methods: {
      initialize() {
        this.paginationLoading = true;
        this.$axios.$get(this.$cit.citBaseUrl + `/api/get-tools-by-course/${this.course_id}?page=1`,{
          withCredentials: true,
          headers:{
            "X-Requested-With":"XMLHttpRequest",
            "Content-Type":"application/json",
            Accept:"application/json",
          },
        })
        .then((res)=>{
          this.activeTools = res.activeTools.data;
          this.toolsPagination = res.activeTools.current_page;
          this.per_page = res.activeTools.per_page;
          this.toolsTotal = res.activeTools.last_page;
          this.inactiveTools = res.inactiveTools.data;
          this.inactiveToolsPagination = res.inactiveTools.current_page;
          this.inactiveToolsTotal = res.inactiveTools.last_page;
          if (res.getCourseCategories.length != 0) {
            this.$store.dispatch("fireFiveCategoryItems", res.getCourseCategories.slice(0, 5));
            this.$store.dispatch("fireMoreCategories", res.getCourseCategories.slice(5, res.getCourseCategories.length));
          }
          this.paginationLoading = false;
        })
        .catch((error)=>{
          if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
        this.paginationLoading = false;
        });
      },

      getToolsByCourse(item, origin, from) {
        if(from=="fromCategory"){
          console.log(from);
          this.paginationLoading = true;
          this.$axios.$get(this.$cit.citBaseUrl + `/api/get-tools-by-course/${this.course_id}?fromCategory=${item.id}&page=1`,{withCredentials: true,headers:{"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json",},})
          .then((res)=>{
            if(res.activeTools.data.length!=0){
              this.activeTools = res.activeTools.data;
              this.toolsPagination = res.activeTools.current_page;
              this.per_page = res.activeTools.per_page;
              this.toolsTotal = res.activeTools.last_page;
              this.activeToolsVisibility = true;
            }else{
              this.activeToolsVisibility = false;
              this.activeTools = res.activeTools.data;
              this.toolsPagination = res.activeTools.current_page;
              this.per_page = res.activeTools.per_page;
              this.toolsTotal = res.activeTools.last_page;
            }
            this.inactiveTools = res.inactiveTools.data;
            this.inactiveToolsPagination = res.inactiveTools.current_page;
            this.inactiveToolsTotal = res.inactiveTools.last_page;
            this.paginationLoading = false;
          })
          .catch((error)=>{
            if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
          });
        }else if(from=="fromSubCategory"){
          this.paginationLoading = true;
          this.$axios.$get(this.$cit.citBaseUrl + `/api/get-tools-by-course/${this.course_id}?fromSubCategory=${item.id}&page=1`,{withCredentials: true,headers:{"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json",},})
          .then((res)=>{
            if(res.activeTools.data.length!=0){
              this.activeTools = res.activeTools.data;
              this.toolsPagination = res.activeTools.current_page;
              this.per_page = res.activeTools.per_page;
              this.toolsTotal = res.activeTools.last_page;
              this.activeToolsVisibility = true;
            }else{
              this.activeToolsVisibility = false;
              this.activeTools = res.activeTools.data;
              this.toolsPagination = res.activeTools.current_page;
              this.per_page = res.activeTools.per_page;
              this.toolsTotal = res.activeTools.last_page;
            }
            this.inactiveTools = res.inactiveTools.data;
            this.inactiveToolsPagination = res.inactiveTools.current_page;
            this.inactiveToolsTotal = res.inactiveTools.last_page;
            this.paginationLoading = false;
          })
          .catch((error)=>{
            if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
          });
        }else if(from=="fromSearchBox"){
          if(this.searchByToolName !== null &&  this.searchByToolName.match(/^ *$/) === null){
            this.$axios.$get(this.$cit.citBaseUrl + `/api/get-tools-by-course/${this.course_id}?fromSearchBox=${this.searchByToolName}&page=1`,
            {
              withCredentials: true,
              headers:{
                "X-Requested-With":"XMLHttpRequest",
                "Content-Type":"application/json",
                Accept:"application/json",
              }
            })
            .then((res)=>{
              if(res.activeTools.data.length!=0){
                this.activeTools = res.activeTools.data;
                this.toolsPagination = res.activeTools.current_page;
                this.per_page = res.activeTools.per_page;
                this.toolsTotal = res.activeTools.last_page;
                this.activeToolsVisibility = true;
              }else{
                this.activeToolsVisibility = false;
                this.activeTools = res.activeTools.data;
                this.toolsPagination = res.activeTools.current_page;
                this.per_page = res.activeTools.per_page;
                this.toolsTotal = res.activeTools.last_page;
              }
              this.inactiveTools = res.inactiveTools.data;
              this.inactiveToolsPagination = res.inactiveTools.current_page;
              this.inactiveToolsTotal = res.inactiveTools.last_page;
              this.paginationLoading = false;
            })
            .catch((error)=>{
              if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
            });
          }else{
            this.$axios.$get(this.$cit.citBaseUrl + `/api/get-tools-by-course/${this.course_id}?page=1`,{withCredentials: true,headers:{"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json",},})
            .then((res)=>{
              this.activeTools = res.activeTools.data;
              this.toolsPagination = res.activeTools.current_page;
              this.per_page = res.activeTools.per_page;
              this.toolsTotal = res.activeTools.last_page;
              this.inactiveTools = res.inactiveTools.data;
              this.inactiveToolsPagination = res.inactiveTools.current_page;
              this.inactiveToolsTotal = res.inactiveTools.last_page;
            })
            .catch((error)=>{
              if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
            });
          }
        }else{
        }
      },

      getToolsByPagination(page_number,from) {
        if(from=='fromActiveTools'){
          this.paginationLoading = true;
          this.$axios.$get(this.$cit.citBaseUrl + `/api/get-tools-by-course/${this.course_id}?page=${page_number}`,{withCredentials: true,headers:{"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json",},})
          .then((res)=>{
            this.activeTools = res.activeTools.data;
            this.toolsPagination = res.activeTools.current_page;
            this.per_page = res.activeTools.per_page;
            this.toolsTotal = res.activeTools.last_page;
            if (res.getCourseCategories.length != 0) {
              this.$store.dispatch("fireFiveCategoryItems", res.getCourseCategories.slice(0, 5));
              this.$store.dispatch("fireMoreCategories", res.getCourseCategories.slice(5, res.getCourseCategories.length));
            }
            this.paginationLoading = false;
          })
          .catch((error)=>{
            if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
          });
        }else{
          this.paginationLoading = true;
          this.$axios.$get(this.$cit.citBaseUrl + `/api/get-tools-by-course/${this.course_id}?page=${page_number}`,{withCredentials: true,headers:{"X-Requested-With":"XMLHttpRequest","Content-Type":"application/json",Accept:"application/json",},})
          .then((res)=>{
            this.inactiveTools = res.inactiveTools.data;
            this.inactiveToolsPagination = res.inactiveTools.current_page;
            this.inactiveToolsTotal = res.inactiveTools.last_page;
            if (res.getCourseCategories.length != 0) {
              this.$store.dispatch("fireFiveCategoryItems", res.getCourseCategories.slice(0, 5));
              this.$store.dispatch("fireMoreCategories", res.getCourseCategories.slice(5, res.getCourseCategories.length));
            }
            this.paginationLoading = false;
          })
          .catch((error)=>{
            if(error.message=="Request failed with status code 401")$auth.logout();console.log(error);
          });

        }
      },
      clearSearchInitialize(){
        this.$nuxt.$loading.start();
      this.searchByToolName = "";
        // console.log("search cleared");
        this.getToolsByCourse('', '', 'fromSearchBox');
      },
      myDebounce: _.debounce(function() {
        this.$nuxt.$loading.start();
        this.getToolsByCourse('', '', 'fromSearchBox');
      }, 1000)
    }
  }
</script>

<style scoped>
</style>