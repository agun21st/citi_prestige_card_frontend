<template>
  <div>
    <v-container>
      <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="courses"
            :search="search"
            sort-by="id"
            item-key="id"
            sort-desc
            class="elevation-15"
            :loading="tableLoading"
            loading-text="Courses are loading..."
            style="font-weight: 600"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
          >
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-row justify="space-between">
                  <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center align-center">
                    <span v-if="item.courseThumbnail">
                      <v-img
                        :src="item.courseThumbnail"
                        lazy-src="https://picsum.photos/10/6"
                        :alt="item.name"
                        style="width: 50px; height: 50px; cursor: pointer"
                        @click.stop="showImage(item.courseThumbnail)"
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
                </v-row>
              </td>
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
            <template v-slot:header.name="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.created_at="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.actions="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:top>
              <v-toolbar
                flat
                :style="
                  $vuetify.theme.dark
                    ? ''
                    : { background: $vuetify.theme.themes.light.background }
                "
              >
                <v-toolbar-title>Courses</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <!-- <v-select
                  v-model="search"
                  :items="departmentName"
                  label="Filter by Department"
                  dense
                  solo
                  hide-details
                  class="mr-5 hidden-sm-and-down"
                ></v-select> -->
                <v-spacer class=""></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  @focus="$event.target.select()"
                  class="d-print-none mr-10 hidden-sm-and-down"
                  clearable
                ></v-text-field>
                <v-dialog
                  v-model="dialog"
                  :width="$vuetify.breakpoint.mobile?'100%':'50vw'"
                  persistent>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="error"
                      dark
                      class="mb-2 hidden-sm-and-down"
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
                      class="hidden-md-and-up"
                      v-bind="attrs"
                      v-on="on"
                      fab
                      small
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
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
                          v-if="$vuetify.breakpoint.mobile"><v-icon dark> mdi-close </v-icon></v-btn
                        >
                      </v-card-title>
                      <v-card-text>
                         <v-container>
                            <v-row>
                              <!-- <v-col cols="12" sm="6">
                                <v-autocomplete
                                  color="error"
                                  :items="departments"
                                  v-model="editedItem.department_id"
                                  item-text="name"
                                  item-value="id"
                                  clearable
                                  label="Select Department"
                                  :rules="[(v) => !!v || 'Department is required']"
                                  required
                                ></v-autocomplete>
                              </v-col> -->
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="editedItem.name"
                                  label="Course Name?"
                                  @focus="$event.target.select()"
                                  clearable
                                  :rules="[
                                    (v) => !!v || 'Course name is required',
                                  ]"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6">
                                <v-file-input
                                  v-model="editedItem.courseThumbnail"
                                  accept="image/png, image/jpeg, image/bmp, image/webp"
                                  prepend-icon="mdi-camera"
                                  label="Course Thumbnail (626 x 417)"
                                  chips
                                  show-size
                                  color="error"
                                ></v-file-input>
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
              <!-- <v-toolbar
                flat
                :style="
                  $vuetify.theme.dark
                    ? ''
                    : { background: $vuetify.theme.themes.light.background }
                "
                class="hidden-md-and-up"
              >
                <v-select
                  v-model="search"
                  :items="departmentName"
                  label="Filter by Department"
                  dense
                  solo
                  hide-details
                ></v-select>
              </v-toolbar> -->
              <v-toolbar
                flat
                :style="
                  $vuetify.theme.dark
                    ? ''
                    : { background: $vuetify.theme.themes.light.background }
                "
                class="hidden-md-and-up"
              >
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  @focus="$event.target.select()"
                  class="d-print-none"
                  clearable
                ></v-text-field>
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
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="isShowImage"
    >
      <template v-slot:default="dialog">
        <v-card>
          <a :href="deptThumbLink" title="Click to download" download>
            <v-img :src="deptThumbLink" contain></v-img>
          </a>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false" color="error"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "admin-course",
  layout: "admin",
  data: () => ({
    isShowImage: false,
    deptThumbLink: "",
    tableLoading: false,
    search: "",
    departmentName: [],
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
      { text: "Course_Name", value: "name" },
      // { text: "Image", value: "courseThumbnail" },
      // { text: "Department", value: "departments.name" },
      // { text: "Status", value: "status" },
      { text: "Created_at", value: "created_at" },
      // { text: "Actions", value: "actions", sortable: false },
      { text: 'Actions', value: 'data-table-expand', sortable: false,},
    ],
    departments: [],
    courses: [],
    editeItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      department_id: "",
      name: "",
      courseThumbnail:null,
    },
    defaultItem: {
      department_id: "",
      name: "",
      courseThumbnail:null,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create course" : "Edit course";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    if (this.$store.state.courses.length != 0) {
      this.courses = this.$store.state.courses;
      this.initializeWithoutLoader();
    } else {
      this.initialize();
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    initialize() {
      this.tableLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + `/api/courses`, {
        withCredentials: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        this.courses = res.courses;
        this.$store.dispatch("fireCourses", this.courses);
        this.tableLoading = false;
      })
      .catch((error) => {
        if(error.message=="Request failed with status code 401")this.$auth.logout();
        console.log(error);
        this.tableLoading = false;
      });
    },
    initializeWithoutLoader() {
      this.$axios.$get(this.$cit.citBaseUrl + `/api/courses`, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.courses = res.courses;
          this.$store.dispatch("fireCourses", this.courses);
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
        });
    },
    editItem(item) {
      this.editeItemId = item.id;
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.courseThumbnail = null;
      this.dialog = true;
    },
    // deleteItem(item) {
    //   this.deleteItemId = item.id;
    //   this.editedIndex = this.courses.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },
    // deleteItemConfirm() {
    //   this.btnLoading = true;
    //   this.$axios
    //     .$delete(
    //       this.$cit.citBaseUrl + "/api/courses/" + this.deleteItemId,
    //       {
    //         withCredentials: true,
    //         headers: {
    //           "X-Requested-With": "XMLHttpRequest",
    //           "Content-Type": "application/json",
    //           Accept: "application/json",
    //         },
    //       }
    //     )
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
        this.editedIndex = -1;
      });
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
        // console.log(this.editedItem.courseThumbnail);
        // return;
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("department_id", this.$auth.user.department_id);
        formData.append("courseThumbnail", this.editedItem.courseThumbnail);
        formData.append("_method", "PATCH");
        this.$axios.$post(this.$cit.citBaseUrl + "/api/courses/" + this.editeItemId,formData,
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
            // console.log(res);
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.courses = res.getAllCourses;
            this.$store.dispatch("fireCourses", this.courses);
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
            this.btnLoading = false;
            this.close();
          });
      } else {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("department_id", this.$auth.user.department_id);
        formData.append("courseThumbnail", this.editedItem.courseThumbnail);
        formData.append("created_by", this.$auth.user.id);
        this.$axios.$post(this.$cit.citBaseUrl + "/api/courses", formData, {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          })
          .then((res) => {
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.courses = res.getAllCourses;
            this.$store.dispatch("fireCourses", this.courses);
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
            this.btnLoading = true;
            this.close();
          });
      }
    },
    showImage(link) {
      this.deptThumbLink = link;
      this.isShowImage = true;
    },
  },
};
</script>

<style scoped>
</style>