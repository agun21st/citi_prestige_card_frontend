<template>
<div>
  <v-toolbar dark class="hidden-md-and-down">
        <v-toolbar-items
          v-for="(item, index) in $store.state.fiveCategoryItems"
          :key="index"
          class="ml-5"
        >
          <v-menu open-on-hover offset-y>
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
            <v-list v-if="item.sub_categories.length !== 0">
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
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark v-bind="attrs" v-on="on" text>
                <span class="pa-2 text-capitalize"
                  >More <v-icon right>mdi-menu-down</v-icon></span
                >
              </v-btn>
            </template>
            <v-list>
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
    <v-toolbar flat>
      <v-toolbar-title class="font-weight-bold my-5" :style="$vuetify.breakpoint.mobile ?'font-size:13px':''">
      {{ toolsNameByType }}
    </v-toolbar-title>
    <v-spacer/>
    <v-text-field
      v-model="searchByToolName"
      label="Search"
      append-icon="mdi-magnify"
      rounded
      dense
      hide-details
      filled
      single-line
      class="shrink"
      color="error"
      v-show="$vuetify.breakpoint.mobile ?false:true"
      :loading="searchBoxLoader"
      clearable
    >
    </v-text-field>
    </v-toolbar>
    <v-text-field
      label="Search..."
      append-icon="mdi-magnify"
      rounded
      dense
      hide-details
      filled
      single-line
      class="shrink"
      color="error"
      v-show="$vuetify.breakpoint.mobile ?true:false"
    >
    </v-text-field>
    <v-row v-if="$store.state.tools.length !== 0" class="my-2">
      <v-col
        cols="6"
        md="4"
        lg="3"
        v-for="tool in $store.state.tools"
        :key="tool.id"
      >
        <ToolsCard :tool="tool" />
      </v-col>
    </v-row>
    <v-row v-else-if="noDataFound" align="center" justify="center">
      <v-col cols="12" class="d-flex justify-center">
        <v-card class="ma-16" max-width="350px">
          <h2 class="pa-16">Tools not Found</h2>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else class="my-10">
      <v-col
        cols="6"
        md="4"
        lg="3"
        >
        <v-skeleton-loader
          v-bind="attrs"
          type="card"
          :width="$vuetify.breakpoint.mobile?150:400"
      ></v-skeleton-loader>
      </v-col>
      <v-col
        cols="6"
        md="4"
        lg="3"
        >
        <v-skeleton-loader
          v-bind="attrs"
          type="card"
          :width="$vuetify.breakpoint.mobile?150:400"
      ></v-skeleton-loader>
      </v-col>
      <v-col
        cols="6"
        md="4"
        lg="3"
        >
        <v-skeleton-loader
          v-bind="attrs"
          type="card"
          :width="$vuetify.breakpoint.mobile?150:400"
      ></v-skeleton-loader>
      </v-col>
      <v-col
        cols="6"
        md="4"
        lg="3"
        >
        <v-skeleton-loader
          v-bind="attrs"
          type="card"
          :width="$vuetify.breakpoint.mobile?150:400"
      ></v-skeleton-loader>
      </v-col>
    </v-row>
    <div class="py-5">
      <v-pagination
        v-if="!noDataFound && functionOrigin=='default' && !selectedPagination && !searchToolBoxPagination"
        v-model="toolsPagination"
        :length="toolsTotal"
        :total-visible="7"
        @input="initialize"
        color="black">
      </v-pagination>
      <v-pagination
        v-if="!noDataFound && functionOrigin !='default' && selectedPagination && !searchToolBoxPagination"
        v-model="selectedToolsPagination"
        :length="selectedToolsTotal"
        :total-visible="7"
        @input="getToolsByCourse(functionOrigin,toolsOrigin,'fromPagination')"
        color="error">
      </v-pagination>
      <v-pagination
        v-if="!noDataFound && functionOrigin !='default' && !selectedPagination && subCatPagination && !searchToolBoxPagination"
        v-model="subCatToolsPagination"
        :length="subCatToolsTotal"
        :total-visible="7"
        @input="getToolsByCourse(functionOrigin,toolsOrigin,'fromPagination')"
        color="error">
      </v-pagination>
      <v-pagination
        v-if="!noDataFound && functionOrigin =='fromSearchBox' && searchToolBoxPagination"
        v-model="searchBoxPagination"
        :length="searchBoxToolsTotal"
        :total-visible="7"
        @input="getToolsByCourse('','','fromSearchBoxPagination')"
        color="primary">
      </v-pagination>
    </div>
  </v-container>
  <v-dialog v-model="progressDialog" hide-overlay persistent width="300">
      <v-card color="error" dark>
        <v-card-text>
          In Prograssing...
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
export default {
  name: "student-dashboard",
  layout: "default",
  data: () => ({
    deptName: "",
    afterMounted: "",
    searchToolBoxPagination: false,
    searchBoxLoader: false,
    progressDialog: false,
    selectedPagination: false,
    subCatPagination: false,
    noDataFound: false,
    searchByToolName: "",
    categoryText: "",
    holdDepartmentText: "",
    holdCategoryText: "",
    holdSubCategoryText: "",
    subCategoryText: "",
    categoryItems: [],
    subCategoryItems: [],
    toolsNameByType: "",
    toolsOrigin: "",
    functionOrigin: "default",
    attrs: {
      class: 'max-auto',
      // boilerplate: true,
      elevation: 10,
    },
    toolsPagination: 1,
    per_page: 0,
    toolsTotal: 0,
    selectedToolsPagination: 1,
    selectedPer_page: 0,
    selectedToolsTotal: 0,
    subCategoryToolsPagination: 1,
    subCatPer_page: 0,
    subCatToolsTotal: 0,
    searchBoxPagination: 1,
    searchBoxToolsTotal: 0,
    myFirstCourse: "",
    mySecondCourse: "",
    totalCourses: 0,
    fixedCourses: [],
  }),
  computed: {
    isCheck() {
      return this.$store.state.moreCategories.length!==0;
    },
    isCheck2() {
      return this.$store.state.tools.length!==0;
    },
  },
  watch: {
    searchByToolName() {
      this.getToolsByCourse('', '', 'fromSearchBox');
    },
  },
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    this.initialize();
    this.afterMounted = "mounted";
  },
  methods: {
    initialize() {
      // this.$nuxt.$loading.start();
      if(this.afterMounted=="mounted")
      {
        this.progressDialog = true;
      }
      this.$axios
        .$get(this.$cit.citBaseUrl + `/api/students/${this.$auth.user.id}?page=${this.toolsPagination}`, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.courses.length != 0) {
            // console.log("-----------------------------");
            // console.log("res.joinDate");
            // console.log(res.joinDate);
            // console.log("res.monthAfterJoin");
            // console.log(res.monthAfterJoin);
            // this.myFirstCourse = res.courses[0];
            this.$store.dispatch("fireMyFirstCourse", res.courses[0]);
            // this.mySecondCourse = res.courses[1];
            if(res.courses.length > 1){
              this.$store.dispatch("fireMySecondCourse", res.courses[1]);
            }
            if(res.courses.length > 2){
              // this.fixedCourses = res.courses.slice(2, res.courses.length);
              this.$store.dispatch("fireFixedCourses", res.courses.slice(2, res.courses.length));
            }
            // this.totalCourses = this.fixedCourses.length;
            this.$store.dispatch("fireTotalCourses", (res.courses.slice(2, res.courses.length)).length);
          }
          if (res.categories.length != 0) {
            this.$store.dispatch("fireFiveCategoryItems", res.categories.slice(0, 5));
            this.$store.dispatch("fireMoreCategories", res.categories.slice(5, res.categories.length));
          }
          this.$store.dispatch("fireTools", res.tools.data);
          this.toolsOrigin = "department";
          this.toolsPagination = res.tools.current_page;
          this.toolsTotal = res.tools.last_page;
          this.per_page =  res.tools.per_page;

          this.toolsNameByType = this.$store.state.myFirstCourse
          this.holdDepartmentText = this.$store.state.myFirstCourse
          // this.$nuxt.$loading.finish();
          this.noDataFound = false;
          this.searchToolBoxPagination = false;
          this.categoryText = "";
          this.deptName = this.$store.state.myFirstCourse;

          this.progressDialog = false;
        })
        .catch((error) => {
          console.log(error);
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          this.progressDialog = false;
        });
    },
    getToolsByCourse(item, origin, from) {
      if(from == 'fromDepartment'){
        this.selectedToolsPagination = 1;
        this.categoryText = "";
      }
      if(item==null)this.initialize();
      if (this.$route.path == "/student/ProfileSettings") {
        this.$router.push("/student/dashboard");
      }
      if (origin === "department") {
        this.searchToolBoxPagination = false;
        this.toolsOrigin = origin;
        this.searchByToolName = "";
        this.toolsPagination = 1;
        this.deptName = item;
        this.holdDepartmentText = this.deptName;
        item = item.replace("&", "and");
        this.progressDialog = true;

        this.$axios.$get(
            this.$cit.citBaseUrl + `/api/students?getByDepartment=${item}&page=${this.selectedToolsPagination}`,
            {
              withCredentials: true,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            if (res.getDepartment.categories.length != 0) {
              this.$store.dispatch("fireFiveCategoryItems", res.getDepartment.categories.slice(0, 5));
              if(((res.getDepartment.categories.slice(5, res.getDepartment.categories.length)).length)>0){
                this.$store.dispatch("fireMoreCategories", res.getDepartment.categories.slice(5, res.getDepartment.categories.length));
              }else{
                this.$store.dispatch("fireMoreCategories", []);
              }
            }
            this.$store.dispatch("fireTools", res.getToolsbyDepartment.data);
            this.selectedToolsPagination = res.getToolsbyDepartment.current_page;
            this.selectedToolsTotal = res.getToolsbyDepartment.last_page;
            this.selectedPer_page =  res.getToolsbyDepartment.per_page;
            this.functionOrigin = item;
            this.selectedPagination = true;
            this.progressDialog = false;
            this.noDataFound = false;
            this.toolsNameByType = this.deptName;
          })
          .catch((error) => {
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            this.toolsNameByType = this.deptName;
            this.progressDialog = false;
        });
      } else if (origin === "category" && item != null) {
        this.searchToolBoxPagination = false;
        this.toolsOrigin = origin;
        this.searchByToolName = "";
        this.progressDialog = true;
        if(from === "fromCategory"){
          this.categoryItems = item;
          this.selectedToolsPagination = 1;
        }
        this.holdCategoryText = this.categoryItems.name;
        this.toolsNameByType = this.holdDepartmentText + " / "+ this.holdCategoryText;
        this.holdCategoryText = this.categoryItems.name;
        let itemName = (this.categoryItems.name).replace("&", "and");
        this.$axios
          .$get(
            this.$cit.citBaseUrl +
              `/api/students?getByCategory=${itemName}&department_id=${this.categoryItems.department_id}&category_id=${this.categoryItems.id}&page=${this.selectedToolsPagination}`,
            {
              withCredentials: true,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            // console.log(res);
            if(res.getToolsByCategory.data.length==0){
              this.$store.dispatch("fireTools", []);
              this.noDataFound = true;
            }else{
              this.$store.dispatch("fireTools", res.getToolsByCategory.data);
              // this.$store.dispatch("fireToolsOrigin", origin);
              this.noDataFound = false;
              this.functionOrigin = this.categoryItems.name;
              this.selectedPagination = true;
              this.selectedToolsPagination = res.getToolsByCategory.current_page;
              this.selectedToolsTotal = res.getToolsByCategory.last_page;
              this.selectedPer_page =  res.getToolsByCategory.per_page;
            }
            this.progressDialog = false;
            // this.toolsNameByType = item.name
          })
          .catch((error) => {
            console.log(error);
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            this.progressDialog = false;
          });
      } else if (origin === "subCategory") {
        this.searchToolBoxPagination = false;
        this.toolsOrigin = origin;
        this.searchByToolName = "";
        this.progressDialog = true;
        if(from === "fromSubCategory"){
          this.subCategoryItems = item;
          this.selectedToolsPagination = 1;
        }
        if(item.name!=undefined) this.subCategoryText = item.name;
        let itemName = (this.subCategoryItems.name).replace("&", "and");
        this.$axios
          .$get(
            this.$cit.citBaseUrl +
              `/api/students?getBySubCategory=${itemName}&department_id=${this.subCategoryItems.department_id}&category_id=${this.subCategoryItems.category_id}&subCategory_id=${this.subCategoryItems.id}&page=${this.selectedToolsPagination}`,
            {
              withCredentials: true,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            // console.log(res);
            if(res.getBySubCategory.data.length==0){
              this.$store.dispatch("fireTools", []);
              this.noDataFound = true;
            }else{
              this.$store.dispatch("fireTools", res.getBySubCategory.data);
              this.$store.dispatch("fireToolsOrigin", origin);
              this.noDataFound = false;
              this.functionOrigin = this.subCategoryItems.name;
              this.selectedPagination = true;
              this.selectedToolsPagination = res.getBySubCategory.current_page;
              this.selectedToolsTotal = res.getBySubCategory.last_page;
              this.selectedPer_page =  res.getBySubCategory.per_page;
              this.toolsNameByType = this.deptName +" / "+  res.getBySubCategory.data[0].category.name +" / "+ this.subCategoryText;
            }
            this.progressDialog = false;
          })
          .catch((error) => {
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log(error);
            this.progressDialog = false;
          });

      }
      else if(from == 'fromSearchBox'){
        this.functionOrigin = 'fromSearchBox';
        if(this.searchByToolName !== null &&  this.searchByToolName.match(/^ *$/) === null){
          this.searchBoxLoader = true;
          let itemName = (this.holdDepartmentText).replace("&", "and");
          this.$axios
            .$get(
              this.$cit.citBaseUrl + `/api/students?searchWithDepartment=${itemName}&searchByToolName=${this.searchByToolName}&page=${this.searchBoxPagination}`,
              {
                withCredentials: true,
                headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            )
            .then((res) => {
              // console.log(res);
            if (res.getToolsBySearchKey.data.length != 0) {
              this.$store.dispatch("fireTools", res.getToolsBySearchKey.data);
              this.selectedPagination = false;
              this.searchToolBoxPagination = true;
              this.searchBoxPagination = res.getToolsBySearchKey.current_page;
              this.searchBoxToolsTotal = res.getToolsBySearchKey.last_page;
              this.selectedPer_page =  res.getToolsBySearchKey.per_page;
              this.noDataFound = false;
            }else{
              this.$store.dispatch("fireTools", []);
              this.noDataFound = true;
            }
            this.searchBoxLoader = false;
          })
          .catch((error) => {
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log(error);
            this.searchBoxLoader = false;
          });
        }else if(this.searchByToolName === null ||  this.searchByToolName.match(/^ *$/) !== null){
          this.searchByToolName = "";
          this.toolsOrigin = "department";
          this.getToolsByCourse(this.holdDepartmentText,'department','');
        }else{

        }

      } else if(from == 'fromSearchBoxPagination'){
        this.selectedPagination = false;
        this.searchToolBoxPagination = true;
        if(this.searchByToolName !== null &&  this.searchByToolName.match(/^ *$/) === null){
          this.progressDialog = true;
          let itemName = (this.holdDepartmentText).replace("&", "and");
          this.$axios
            .$get(
              this.$cit.citBaseUrl + `/api/students?searchWithDepartment=${itemName}&searchByToolName=${this.searchByToolName}&page=${this.searchBoxPagination}`,
              {
                withCredentials: true,
                headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            )
            .then((res) => {
              // console.log(res);
            if (res.getToolsBySearchKey.data.length != 0) {
              this.$store.dispatch("fireTools", res.getToolsBySearchKey.data);
              this.selectedPagination = false;
              this.searchToolBoxPagination = true;
              this.searchBoxPagination = res.getToolsBySearchKey.current_page;
              this.searchBoxToolsTotal = res.getToolsBySearchKey.last_page;
              this.selectedPer_page =  res.getToolsBySearchKey.per_page;
              this.noDataFound = false;
            }else{
              this.$store.dispatch("fireTools", []);
              this.noDataFound = true;
            }
            this.progressDialog = false;
          })
          .catch((error) => {
            console.log(error);
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            this.progressDialog = false;
            // this.toolsNameByType = deptName;
          });
        }else if(this.searchByToolName === null ||  this.searchByToolName.match(/^ *$/) !== null){
          this.searchByToolName = "";
          this.toolsOrigin = "department";
          this.getToolsByCourse(this.holdDepartmentText,'department','');
        }else{

        }
      }else {
        this.progressDialog = false;
      }
    },
  },
};
</script>

<style scoped>
</style>