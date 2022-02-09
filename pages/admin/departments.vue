<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="departments"
          :search="search"
          sort-by="id"
          sort-desc
          item-key="id"
          class="elevation-10"
          :loading="tableLoading"
          loading-text="Departments are loading..."
          style="font-weight: 500"
        >
          <template v-slot:item.deptThumbnail="{ item }">
            <span v-if="item.deptThumbnail">
              <v-img
                :src="item.deptThumbnail"
                lazy-src="https://picsum.photos/10/6"
                :alt="item.name"
                style="width: 50px; height: 50px; cursor: pointer"
                @click.stop="showImage(item.deptThumbnail)"
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
          </template>
          <template v-slot:item.heroBackground="{ item }">
            <span v-if="item.heroBackground">
              <v-img
                :src="item.heroBackground"
                lazy-src="https://picsum.photos/10/6"
                :alt="item.name"
                style="width: 50px; height: 50px; cursor: pointer"
                @click.stop="showImage(item.heroBackground)"
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
          <!-- <template v-slot:header.name="{ header }">
          {{ header.text.toUpperCase() }}
        </template> -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="hidden-sm-and-down"
                >Departments</v-toolbar-title
              >
              <v-divider
                class="mx-4 hidden-sm-and-down"
                inset
                vertical
              ></v-divider>
              <v-spacer class="d-none d-md-block"></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                @focus="$event.target.select()"
                class="d-print-none mr-10"
              ></v-text-field>
              <v-btn
                :loading="tableLoading"
                :disabled="tableLoading"
                color="error"
                class="ma-1 white--text"
                fab
                @click="initialize"
                x-small
              >
                <v-icon dark> mdi-reload </v-icon>
              </v-btn>
              <v-dialog v-model="dialog" max-width="800px" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="error"
                    dark
                    class="ma-1 hidden-sm-and-down"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add New
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
                        ><v-icon dark> mdi-close </v-icon></v-btn
                      >
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Dept. Name?"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[
                                (v) => !!v || 'Department name is required',
                              ]"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-file-input
                              v-model="editedItem.deptThumbnail"
                              :rules="imageRules"
                              accept="image/png, image/jpeg, image/bmp, image/webp"
                              prepend-icon="mdi-camera"
                              label="Dept. Thumb. (224 x 150)"
                              chips
                              show-size
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12">
                            <v-file-input
                              v-model="editedItem.heroBackground"
                              :rules="imageRules"
                              accept="image/png, image/jpeg, image/bmp, image/webp"
                              prepend-icon="mdi-camera"
                              label="Hero Background (960 x 640)"
                              chips
                              show-size
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.heroOne"
                              label="Hero Heading One"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'Heading one is required']"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.heroTwo"
                              label="Hero Heading Two"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'Heading two is required']"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-textarea
                              v-model="editedItem.heroDescription"
                              clearable
                              counter
                              clear-icon="mdi-close-circle"
                              label="Hero Descriptions"
                              rows="1"
                              auto-grow
                              :rules="[
                                (v) => !!v || 'Hero Description is required',
                              ]"
                              required
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.heroVideo"
                              label="Hero Video Link"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[
                                (v) => !!v || 'Hero Video Link is required',
                              ]"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.descriptionHeader"
                              label="Description Header"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[
                                (v) => !!v || 'Description Header is required',
                              ]"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-textarea
                              v-model="editedItem.descriptions"
                              clearable
                              counter
                              clear-icon="mdi-close-circle"
                              label="Department Descriptions"
                              rows="1"
                              auto-grow
                              :rules="[(v) => !!v || 'Description is required']"
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
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
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
  </div>
</template>

<script>
export default {
  name: "admin-departments",
  layout: "admin",
  data: () => ({
    isShowImage: false,
    deptThumbLink: "",
    tableLoading: false,
    search: "",
    btnLoading: false,
    dialog: false,
    dialogDelete: false,
    valid: true,
    imageRules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Department Thumbnail size should be less than 2 MB!",
    ],
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "Course_Name", value: "name" },
      { text: "Thumbnail", value: "deptThumbnail" },
      { text: "Background", value: "heroBackground" },
      { text: "Hero_One", value: "heroOne" },
      { text: "Hero_Two", value: "heroTwo" },
      // { text: "Status", value: "status" },
      { text: "Created", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    departments: [],
    editeItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      name: "",
      deptThumbnail: null,
      heroBackground: null,
      heroOne: "",
      heroTwo: "",
      heroDescription: "",
      heroVideo: "",
      descriptionHeader: "",
      descriptions: "",
    },
    defaultItem: {
      name: "",
      deptThumbnail: null,
      heroBackground: null,
      heroOne: "",
      heroTwo: "",
      heroDescription: "",
      heroVideo: "",
      descriptionHeader: "",
      descriptions: "",
    },
  }),
  // async fetch() {
  //   // this.$nuxt.refresh()
  //   try {
  //     // Add a request interceptor
  //     this.$axios.interceptors.request.use(
  //       (config) => {
  //         this.tableLoading = true;
  //         return config;
  //       },
  //       (error) => {
  //         this.tableLoading = false;
  //         return Promise.reject(error);
  //       }
  //     );
  //     // Add a response interceptor
  //     this.$axios.interceptors.response.use(
  //       (response) => {
  //         this.tableLoading = false;
  //         return response;
  //       },
  //       (error) => {
  //         this.tableLoading = false;
  //         return Promise.reject(error);
  //       }
  //     );
  //     this.$axios
  //       .$get(this.$cit.citBaseUrl + "/api/departments", {
  //         withCredentials: true,
  //         headers: {
  //           "X-Requested-With": "XMLHttpRequest",
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       })
  //       .then((res) => {
  //         this.departments = res.departments;
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.warn("error from fetch try catch block");
  //     console.warn(error);
  //     console.warn("error from fetch try catch block");
  //   }
  // },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Department" : "Edit Department";
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

  created() {
    // this.initialize();
  },
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    if (this.$store.state.departments.length != 0) {
      this.departments = this.$store.state.departments;
      this.initialize();
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
      this.$axios
        .$get(this.$cit.citBaseUrl + "/api/departments", {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.departments = res.departments;
          this.$store.dispatch("fireDepartments", this.departments);
          this.tableLoading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.tableLoading = false;
        });
    },

    editItem(item) {
      this.editeItemId = item.id;
      this.editedIndex = this.departments.indexOf(item);
      (item.deptThumbnail = null),
        (item.heroBackground = null),
        (this.editedItem = Object.assign({}, item));
      this.dialog = true;
    },

    // deleteItem(item) {
    //   this.deleteItemId = item.id;
    //   this.editedIndex = this.departments.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },

    // deleteItemConfirm() {
    //   this.btnLoading = true;
    //   this.$axios
    //     .$delete(
    //       this.$cit.citBaseUrl + "/api/departments/" + this.deleteItemId,
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
    //       this.btnLoading = false;
    //       this.closeDelete();
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
      this.$nuxt.refresh();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$nuxt.refresh();
    },

    save() {
      if (this.editedIndex > -1) {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("deptThumbnail", this.editedItem.deptThumbnail);
        formData.append("heroBackground", this.editedItem.heroBackground);
        formData.append("heroOne", this.editedItem.heroOne);
        formData.append("heroTwo", this.editedItem.heroTwo);
        formData.append("heroDescription", this.editedItem.heroDescription);
        formData.append("heroVideo", this.editedItem.heroVideo);
        formData.append("descriptionHeader", this.editedItem.descriptionHeader);
        formData.append("descriptions", this.editedItem.descriptions);
        // formData.append("created_by", this.$auth.user.id);
        formData.append("_method", "PATCH");
        this.$axios
          .$post(
            this.$cit.citBaseUrl + "/api/departments/" + this.editeItemId,
            formData,
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
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.editedItem = Object.assign({}, this.defaultItem);
            this.btnLoading = false;
            this.close();
            this.initialize();
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
            this.btnLoading = false;
            this.close();
          });
      } else {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("deptThumbnail", this.editedItem.deptThumbnail);
        formData.append("heroBackground", this.editedItem.heroBackground);
        formData.append("heroOne", this.editedItem.heroOne);
        formData.append("heroTwo", this.editedItem.heroTwo);
        formData.append("heroDescription", this.editedItem.heroDescription);
        formData.append("heroVideo", this.editedItem.heroVideo);
        formData.append("descriptionHeader", this.editedItem.descriptionHeader);
        formData.append("descriptions", this.editedItem.descriptions);
        formData.append("created_by", this.$auth.user.id);
        this.$axios
          .$post(this.$cit.citBaseUrl + "/api/departments", formData, {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.editedItem = Object.assign({}, this.defaultItem);
            this.btnLoading = false;
            this.close();
            this.initialize();
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
            this.btnLoading = false;
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