<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <!-- <v-data-table
          :headers="headers"
          :items="tools"
          :items-per-page="per_page"
          :loading="tableLoading"
          hide-default-footer
          :search="search"
          sort-by="id"
          sort-desc
          item-key="id"
          class="elevation-15"
          :loading="tableLoading"
          loading-text="Tools are loading..."
        > -->
        <v-data-table
          :headers="headers"
          :items="tools"
          :options.sync="options"
          :server-items-length="totalTools"
          sort-by="id"
          sort-desc
          item-key="id"
          class="elevation-10 mb-16"
          loading-text="Tools are loading..."
          style="font-weight: 600"
          :loading="tableLoading"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          :footer-props="{
            'items-per-page-options':[10,20,30,40,50,100,200,500,1000]
          }"
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-row justify="space-between">
                <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center align-center">
                  <span v-if="item.toolThumbnail">
                    <v-img
                      :src="item.toolThumbnail"
                      lazy-src="https://picsum.photos/10/6"
                      :alt="item.name"
                      style="width: 50px; height: 50px; cursor: pointer"
                      @click.stop="showImage(item.toolThumbnail)"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary lighten-1"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center align-center">
                  <span v-if="item.sliderImages">
                    <span class="d-flex justify-center align-center wrap">
                      <v-img
                        v-for="image in item.sliderImages.split(',')"
                        :key="image"
                        :src="image"
                        lazy-src="https://picsum.photos/10/6"
                        style="width: 50px; height: 50px; cursor: pointer"
                        @click.stop="showImage(image)"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="primary lighten-1"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </span>
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center align-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="mr-2"
                        @click="editItem(item)"
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                      >
                        mdi-square-edit-outline
                      </v-icon>
                    </template>
                    <span>edit</span>
                </v-tooltip>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center align-center">
                  For {{item.forTheMonth}} days
                </v-col>
              </v-row>
            </td>
          </template>
          <template v-slot:item.downloadLink="{ item }">
            <div v-if="item.downloadLink !== null">
              <div v-if="item.downloadLink !== 'null'">
                <v-btn
                  color="blue-grey"
                  class="white--text"
                  x-small
                  link
                  :href="item.downloadLink"
                  download
                >
                  Download
                  <v-icon right dark> mdi-cloud-download </v-icon>
                </v-btn>
              </div>
            </div>
            <div v-else>
              <v-btn
                color="blue-grey"
                class="white--text"
                x-small
                link
                :href="item.downloadLink"
                download
              >
                Download
                <v-icon right dark> mdi-cloud-download </v-icon>
              </v-btn>
            </div>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{
              new Date(item.created_at).toLocaleDateString(undefined, {
                weekend: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }}
          </template>
          <template v-slot:item.sub_category="{ item }">
            {{item.sub_category.name}}
          </template>
          <!-- <template v-slot:header.name="{ header }">
          {{ header.text.toUpperCase() }}
          </template> -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="">Tools</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <!-- <v-select
                v-model="searchFromServer"
                :items="departmentName"
                label="Filter by Department"
                dense
                solo
                hide-details
                class="mr-5 hidden-sm-and-down"
              ></v-select> -->
              <v-spacer class=""></v-spacer>
              <!-- <v-form ref="form" v-model="valid" @submit.prevent="initialize"> -->
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search by tool name..."
                  single-line
                  hide-details
                  clearable
                  @click:clear="clearSearchInitialize"
                  class="d-print-none mr-md-10 hidden-sm-and-down d-print-none"
                  required
                  @keyup="myDebounce"
                ></v-text-field>
              <!-- </v-form> -->
              <!-- <v-btn
                :loading="tableLoading"
                :disabled="tableLoading"
                color="error"
                class="ma-1 white--text"
                fab
                @click="initialize"
                small
              >
                <v-icon dark> mdi-reload </v-icon>
              </v-btn> -->
              <v-dialog v-model="dialog" max-width="1000px" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="error"
                    dark
                    class="ma-1 hidden-sm-and-down"
                    v-bind="attrs"
                    v-on="on"
                    fab
                    small
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    dark
                    class="ma-1 hidden-md-and-up"
                    v-bind="attrs"
                    v-on="on"
                    fab
                    x-small
                  >
                    <v-icon dark> mdi-plus </v-icon>
                  </v-btn>
                </template>
                <v-card :loading="cardLoading">
                  <template slot="progress">
                    <v-progress-linear
                      color="error"
                      height="5"
                      indeterminate
                    ></v-progress-linear>
                  </template>
                  <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="save"
                    enctype="multipart/form-data"
                  >
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }} </span>
                      <v-spacer />
                      <v-btn color="error" @click="close" text
                        ><v-icon dark> mdi-close </v-icon></v-btn
                      >
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <!-- <v-col cols="12" md="4">
                            <v-autocomplete
                              color="error"
                              :items="courses"
                              v-model="editedItem.department_id"
                              item-text="name"
                              item-value="id"
                              clearable
                              label="Select Department"
                              :rules="[(v) => !!v || 'Department is required']"
                              required
                              @change="getCategories(editedItem.department_id)"
                            ></v-autocomplete>
                          </v-col> -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              color="error"
                              :items="courses"
                              v-model="editedItem.course_id"
                              item-text="name"
                              item-value="id"
                              label="Select Course*"
                              :rules="[(v) => !!v || 'Course is required']"
                              required
                              @change="getCourseCategories(editedItem.course_id)"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              color="error"
                              :items="categories"
                              v-model="editedItem.category_id"
                              item-text="name"
                              item-value="id"
                              label="Select Category*"
                              :rules="[
                                (v) => !!v || 'Category is required',
                              ]"
                              required
                              @change="getCourseSubCategories(editedItem.category_id,'')"
                              :disabled="isCourseSelected"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              color="error"
                              :items="subCategories"
                              v-model="editedItem.subCategory_id"
                              item-text="name"
                              item-value="id"
                              label="Select Sub-Category*"
                              :rules="[
                                (v) => !!v || 'Sub-Category is required',
                              ]"
                              required
                              :disabled="isCategorySelected"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Tool Name*"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'Tool name is required']"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-file-input
                              v-model="editedItem.toolThumbnail"
                              accept="image/png, image/jpeg, image/bmp, image/webp"
                              prepend-icon="mdi-camera"
                              label="Tool Thumbnail (360x270)"
                              chips
                              show-size
                              color="error"
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-file-input
                              v-model="editedItem.sliderImages"
                              color="error"
                              counter
                              multiple
                              accept="image/png, image/jpeg, image/bmp, image/webp"
                              prepend-icon="mdi-camera"
                              label="Slider Images (1065 x 645)"
                              placeholder="Select slider images"
                              :show-size="1000"
                            >
                              <template v-slot:selection="{ index, text }">
                                <v-chip
                                  v-if="index < 2"
                                  color="primary"
                                  dark
                                  small
                                >
                                  {{ text }}
                                </v-chip>

                                <span
                                  v-else-if="index === 2"
                                  class="
                                    text-overline
                                    grey--text
                                    text--darken-3
                                    mx-2
                                  "
                                >
                                  +{{ editedItem.sliderImages.length - 2 }}
                                  File(s)
                                </span>
                              </template>
                            </v-file-input>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.downloadLink"
                              label="Download Link*"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'This field is required']"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-autocomplete
                              color="error"
                              :items="selectForTheMonth"
                              v-model="editedItem.forTheMonth"
                              item-text="text"
                              item-value="value"
                              label="Tool for the*"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-textarea
                              v-model="editedItem.descriptions"
                              clearable
                              counter
                              clear-icon="mdi-close-circle"
                              label="Descriptions*"
                              rows="1"
                              auto-grow
                              :rules="[(v) => !!v || 'Description is required']"
                              required
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-textarea
                              v-model="editedItem.features"
                              clearable
                              counter
                              clear-icon="mdi-close-circle"
                              label="Features (one each line)*"
                              rows="1"
                              auto-grow
                              :rules="[(v) => !!v || 'Features is required']"
                              required
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error" @click="close">close</v-btn>
                      <v-btn
                        :disabled="!valid"
                        color="primary"
                        type="submit"
                        @click="validate"
                        :loading="btnLoading"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
              <!-- <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5 error--text"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="error"
                      text
                      @click="deleteItemConfirm"
                      :loading="btnLoading"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog> -->
            </v-toolbar>
            <!-- <v-toolbar flat class="hidden-md-and-up">
              <v-select
                v-model="searchFromServer"
                :items="departmentName"
                label="Filter by"
                dense
                solo
                hide-details
                class=""
              ></v-select>
            </v-toolbar> -->
            <v-toolbar flat class="hidden-md-and-up">
              <!-- <v-form ref="form" v-model="valid" @submit.prevent="initialize"> -->
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search by tool name..."
                  single-line
                  hide-details
                  clearable
                  @click:clear="clearSearchInitialize"
                  class="d-print-none"
                  required
                  @keyup="myDebounce"
                ></v-text-field>
              <!-- </v-form> -->
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="mr-2"
                    @click="editItem(item)"
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                   >
                    mdi-square-edit-outline
                  </v-icon>
                </template>
                <span>edit</span>
            </v-tooltip>
            <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small @click="deleteItem(item)" v-bind="attrs" v-on="on" color="error"> mdi-delete </v-icon>
                </template>
                <span>delete</span>
              </v-tooltip> -->
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
          <!-- <template v-if="true" v-slot:footer>
            <v-divider></v-divider>
            <div class="py-5">
              <v-pagination
                v-model="toolsPagination"
                :length="toolsTotal"
                :total-visible="7"
                circle
                @input="initialize"
                color="error"
              ></v-pagination>
            </div>
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="isShowImage"
    >
      <template v-slot:default="dialog">
        <v-card>
          <a :href="deptThumbLink" title="Click to download" download>
            <v-img
              :src="deptThumbLink"
              lazy-src="https://picsum.photos/10/6"
              contain
            ></v-img>
          </a>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false" color="error"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog
      v-model="modalCardLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Categories are loading...
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
  name: "admin-tools",
  layout: "admin",
  data: () => ({
    modalCardLoading: false,
    cardLoading: false,
    isShowImage: false,
    isCourseSelected: true,
    isCategorySelected: true,
    deptThumbLink: "",
    tableLoading: false,
    search: "",
    valid: true,
    btnLoading: false,
    dialog: false,
    dialogDelete: false,
    valid: true,
    expanded: [],
    singleExpand: false,
    headers: [
      // {
      //   text: "ID",
      //   align: "start",
      //   sortable: true,
      //   value: "id",
      // },
      { text: "Name", value: "name",width: "400px" },
      { text: "Sub_Category", value: "sub_category"},
      { text: "Category", value: "category.name"},
      { text: "Course", value: "course.name"},
      // { text: "Thumbnail", value: "toolThumbnail" },
      // { text: "Slides", value: "sliderImages" },
      // { text: "Download_Link", value: "downloadLink" },
      // { text: "Month", value: "forTheMonth" },
      // { text: "Status", value: "status" },
      { text: "Created", value: "created_at", width: "180px" },
      // { text: "Actions", value: "actions", sortable: false, width: "80px" },
      { text: 'Actions', value: 'data-table-expand', sortable: false,},
    ],
    selectForTheMonth: [
      {text: "1st_month",value:0},
      {text: "2nd_month",value:30},
      {text: "3rd_month",value:60},
      {text: "4th_month",value:90},
      {text: "5th_month",value:120},
      {text: "6th_month",value:150},
      {text: "7th_month",value:180},
      {text: "8th_month",value:210},
      {text: "9th_month",value:240},
      {text: "10th_month",value:270},
      {text: "11th_month",value:300},
      {text: "12th_month",value:330},
      ],
    departmentName: [],
    courses: [],
    categories: [],
    subCategories: [],
    // For Server Side Pagination
    tools: [],
    totalTools: 0,
    options: {},

    per_page: 0,
    toolsPagination: 1,
    // searchFromServer: "",
    editItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      course_id: 0,
      category_id: 0,
      subCategory_id: 0,
      name: "",
      toolThumbnail: null,
      sliderImages: null,
      downloadLink: "",
      forTheMonth: 0,
      descriptions: "",
      features: "",
    },
    defaultItem: {
      course_id: 0,
      category_id: 0,
      subCategory_id: 0,
      name: "",
      toolThumbnail: null,
      sliderImages: null,
      downloadLink: "",
      forTheMonth: 0,
      descriptions: "",
      features: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Tool" : "Edit Tool";
    },
  },

  watch: {
    // Server side Pagination
    options: {
      handler () {
        this.initialize()
      },
      deep: true,
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    // searchFromServer() {
    //   this.initialize();
    // },
  },

  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    this.initialize();
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    clearSearchInitialize(){
      this.search = "";
      // console.log("search cleared");
      this.initialize();
    },
    initialize() {
      this.tableLoading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      // console.log(sortBy);
      if(this.search!="" && this.search!=null)
      {
        // console.log('I am a search');
        let self = this;
        this.$axios.$get(this.$cit.citBaseUrl + `/api/tools`,
          {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            params: {
              sortBy: sortBy[0],
              sortDesc: sortDesc[0],
              page: page,
              itemsPerPage: itemsPerPage,
              searchBy: self.search
            },
          }
        )
        .then((res) => {
          // console.log(res);
          // return;
          this.tools = res.getAllTools.data
          this.totalTools = res.getAllTools.total
          this.courses = res.getAllCourses
          // this.$store.dispatch("fireTools", this.tools);
          this.tableLoading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.tableLoading = false;
        });
      }else{
        // console.log('I am Not');
        this.$axios.$get(this.$cit.citBaseUrl + `/api/tools`,
          {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            params: {
              sortBy: sortBy[0],
              sortDesc: sortDesc[0],
              page: page,
              itemsPerPage: itemsPerPage,
            },
          }
        )
        .then((res) => {
          // console.log(res);
          // return;
          this.tools = res.getAllTools.data
          this.totalTools = res.getAllTools.total
          this.courses = res.getAllCourses
          // this.$store.dispatch("fireTools", this.tools);
          this.tableLoading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.tableLoading = false;
        });

      }
    },
    getCategories(id) {
      this.modalCardLoading = true;
      this.$axios
        .$get(this.$cit.citBaseUrl + "/api/tools/" + id, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.categories = res.categories;
          if (!(this.categories.length === 0)) {
            this.departmentIsSelected = false;
          } else {
            this.departmentIsSelected = true;
          }
          this.modalCardLoading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: error,
            color: "error",
          });
          this.editedItem = Object.assign({}, this.defaultItem);
          this.modalCardLoading = false;
        });
    },
    getCourseCategories(course_id) {
      this.cardLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + `/api/categories/`+course_id,
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
        this.categories = res.categories;
        this.cardLoading = false;
        this.isCourseSelected = false;
        this.isCategorySelected = true;
        this.editedItem.subCategory_id = 0;
      })
      .catch((error) => {
        if(error.message=="Request failed with status code 401")this.$auth.logout();
        console.log(error);
        this.cardLoading = false;
      });
    },
    getCourseSubCategories(category_id,subCategory_id) {
      this.cardLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + `/api/sub-categories/`+category_id,
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
        this.subCategories = res.subCategories;
        if(subCategory_id!=""){
          this.editedItem.subCategory_id = subCategory_id;
        }
        this.cardLoading = false;
        this.isCategorySelected = false;
      })
      .catch((error) => {
        if(error.message=="Request failed with status code 401")this.$auth.logout();
        console.log(error);
        this.cardLoading = false;
      });
    },
    editItem(item) {
      // console.log(item);
      this.editItemId = item.id;
      this.editedIndex = this.tools.indexOf(item);
      item.toolThumbnail = null;
      item.sliderImages = null;
      this.editedItem = Object.assign({}, item);
      if (this.editedItem.downloadLink === "null") {
        this.editedItem.downloadLink = "";
      }
      this.getCourseCategories(item.course_id);
      this.getCourseSubCategories(item.category_id,item.subCategory_id);
      this.isCourseSelected = false;
      this.isCategorySelected = false;
      this.dialog = true;
    },

    // deleteItem(item) {
    //   this.deleteItemId = item.id;
    //   this.editedIndex = this.tools.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },

    // deleteItemConfirm() {
    //   this.btnLoading = true;
    //   this.$axios
    //     .$delete(this.$cit.citBaseUrl + "/api/tools/" + this.deleteItemId, {
    //       withCredentials: true,
    //       headers: {
    //         "X-Requested-With": "XMLHttpRequest",
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //       },
    //     })
    //     .then((res) => {
    //       this.$store.dispatch("fireSnackbarAction", {
    //         show: true,
    //         message: res.success,
    //         color: "primary",
    //       });
    //       this.closeDelete();
    //       this.btnLoading = false;
    //       this.initialize();
    //     })
    //     .catch((error) => {
    //       if(error.message=="Request failed with status code 401")this.$auth.logout();
    //       console.log(error);
    //       this.closeDelete();
    //       this.btnLoading = false;
    //     });
    // },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.course_object=[];
        this.category_object=[];
        this.isCourseSelected = true;
        this.isCategorySelected = true;
        this.editedIndex = -1;
      });
      this.initialize();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("course_id", this.editedItem.course_id);
        formData.append("category_id", this.editedItem.category_id);
        formData.append("subCategory_id", this.editedItem.subCategory_id);
        formData.append("name", this.editedItem.name);
        formData.append("toolThumbnail", this.editedItem.toolThumbnail);
        if (this.editedItem.sliderImages != null) {
          for (var i = 0; i < this.editedItem.sliderImages.length; i++) {
            let file = this.editedItem.sliderImages[i];
            formData.append("sliderImages[" + i + "]", file);
          }
        }
        formData.append("descriptions", this.editedItem.descriptions);
        formData.append("downloadLink", this.editedItem.downloadLink);
        formData.append("forTheMonth", this.editedItem.forTheMonth);
        formData.append("features", this.editedItem.features);
        formData.append("_method", "PATCH");
        this.$axios.$post(this.$cit.citBaseUrl + "/api/tools/" + this.editItemId,
            formData,
            {
              withCredentials: true,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.tools = res.getAllTools;
            this.$store.dispatch("fireTools", this.tools);
            this.btnLoading = false;
            this.close();
          })
          .catch((error) => {
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log(error);
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: error,
              color: "error",
            });
            this.close();
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("course_id", this.editedItem.course_id);
        formData.append("category_id", this.editedItem.category_id);
        formData.append("subCategory_id", this.editedItem.subCategory_id);
        formData.append("name", this.editedItem.name);
        formData.append("toolThumbnail", this.editedItem.toolThumbnail);
        if(this.editedItem.sliderImages != null){
          for (var i = 0; i < this.editedItem.sliderImages.length; i++) {
            let file = this.editedItem.sliderImages[i];
            formData.append("sliderImages[" + i + "]", file);
          }
        }
        formData.append("descriptions", this.editedItem.descriptions);
        formData.append("downloadLink", this.editedItem.downloadLink);
        formData.append("forTheMonth", this.editedItem.forTheMonth);
        formData.append("features", this.editedItem.features);
        this.$axios.$post(this.$cit.citBaseUrl + "/api/tools", formData, {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          })
          .then((res) => {
            // console.log(res);
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.tools = res.getAllTools;
            this.$store.dispatch("fireTools", this.tools);
            this.btnLoading = false;
            this.close();
          })
          .catch((error) => {
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log(error);
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: error,
              color: "error",
            });
            this.editedItem = Object.assign({}, this.defaultItem);
            this.close();
            this.btnLoading = false;
          });
      }
    },
    showImage(link) {
      this.deptThumbLink = link;
      this.isShowImage = true;
    },
    myDebounce: _.debounce(function() {
      this.initialize();
    }, 1000)
  },
};
</script>

<style scoped>
</style>