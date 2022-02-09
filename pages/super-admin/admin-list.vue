<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="admins"
          :search="search"
          sort-by="id"
          sort-desc
          item-key="id"
          class="elevation-10"
          :loading="tableLoading"
          loading-text="Admins are loading..."
          style="font-weight: 600"
        >
          <template v-slot:item.image="{ item }">
            <span v-if="item.image">
              <v-img
                :src="item.image"
                lazy-src="https://picsum.photos/10/6"
                :alt="item.name"
                style="width: 50px; height: 50px; cursor: pointer"
                @click.stop="showImage(item.image)"
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
          <template v-slot:item.updated_at="{ item }">
            {{
              new Date(item.updated_at).toLocaleDateString(undefined, {
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
                >Admins</v-toolbar-title
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
                    New Admin
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
                              label="Admin Name*"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'Admin name is required']"
                              required
                              autofocus="autofocus"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-select
                              v-model="editedItem.department_id"
                              :items="departments"
                              label="Select Department*"
                              item-text="name"
                              item-value="id"
                              :rules="[(v) => !!v || 'Department is required']"
                              required
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.login_id"
                              label="Admin User ID*"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'User ID is required']"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              :append-icon="show3 ? 'mdi-eye-off':'mdi-eye'"
                              :rules="!isEdit? [passwordRules.required, passwordRules.min]: []
                              "
                              :type="show3 ?'password':'text'"
                              label="Admin Password*"
                              hint="At least 8 characters"
                              v-model="editedItem.password"
                              @click:append="show3 = !show3"
                              color="error"
                              @focus="$event.target.select()"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              name="email"
                              v-model="editedItem.email"
                              :rules="emailRules"
                              label="Admin E-mail*"
                              required
                              color="error"
                              @focus="$event.target.select()"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.mobile"
                              label="Mobile Number"
                              @focus="$event.target.select()"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-file-input
                              v-model="editedItem.image"
                              :rules="imageRules"
                              accept="image/png, image/jpeg, image/bmp, image/webp"
                              prepend-icon="mdi-camera"
                              label="Admin Photo (300 x 300)"
                              chips
                              show-size
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
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="primary" class="mr-2" @click="editItem(item)">
              mdi-square-edit-outline
            </v-icon>
            <v-icon small @click="deleteItem(item)" v-if="$auth.user.login_id==10082"> mdi-delete </v-icon>
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
  name: "super-admin-list",
  layout: "super_admin",
  data: () => ({
    isShowImage: false,
    tableLoading: false,
    search: "",
    btnLoading: false,
    dialog: false,
    dialogDelete: false,
    valid: true,
    isEdit: false,
    show3: false,
    departments: [],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    imageRules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Image size should be less than 2 MB!",
    ],
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "Name", value: "name" },
      { text: "User_ID", value: "login_id" },
      { text: "Department", value: "department.name" },
      { text: "Email", value: "email" },
      { text: "Photo", value: "image" },
      { text: "Status", value: "status" },
      { text: "Created", value: "created_at" },
      // { text: "Updated", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    admins: [],
    editeItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      name: "",
      department_id: "",
      login_id: "",
      password: (Math.random().toString(36).slice(2).substr(2,8)).toUpperCase(),
      email: "",
      mobile: "",
      image: null,
    },
    defaultItem: {
      name: "",
      department_id: "",
      login_id: "",
      password: (Math.random().toString(36).slice(2).substr(2,8)).toUpperCase(),
      email: "",
      mobile: "",
      image: null,
    },
  }),
  // async fetch() {
  //   // this.$nuxt.refresh()
  //   try {
  //     this.tableLoading = true;
  //     this.$axios
  //       .$get(
  //         this.$cit.citBaseUrl + "/api/get-admins/" + this.$auth.user.auth_id,
  //         {
  //           withCredentials: true,
  //           headers: {
  //             "X-Requested-With": "XMLHttpRequest",
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         this.admins = res.success;
  //         // console.log(res);
  //         this.tableLoading = false;
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         this.tableLoading = false;
  //       });
  //   } catch (error) {
  //     console.warn("error from fetch try catch block");
  //     console.warn(error);
  //     console.warn("error from fetch try catch block");
  //   }
  // },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Admin" : "Edit Admin";
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
  beforeCreate()
  {
    // console.log("beforeCreate");
  },
  created() {
    // this.initialize();
    // console.log("created");
  },
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    if (this.$store.state.admins.length != 0) {
      this.admins = this.$store.state.admins;
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
        .$get(
          this.$cit.citBaseUrl + "/api/get-admins/" + this.$auth.user.auth_id,
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
          this.admins = res.success;
          this.departments = res.getDepartments;
          // console.log(res);
          this.$store.dispatch("fireAdmins", this.admins);
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
      this.editedIndex = this.admins.indexOf(item);
      item.image = null;
      item.password = "";
      this.isEdit = true;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    // deleteItem(item) {
    //   this.deleteItemId = item.id;
    //   this.editedIndex = this.admins.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.isEdit = false;
    //   this.dialogDelete = true;
    // },

    // deleteItemConfirm() {
    //   // Add a request interceptor
    //   this.$axios.interceptors.request.use(
    //     (config) => {
    //       this.btnLoading = true;
    //       return config;
    //     },
    //     (error) => {
    //       this.btnLoading = false;
    //       return Promise.reject(error);
    //     }
    //   );
    //   // Add a response interceptor
    //   this.$axios.interceptors.response.use(
    //     (response) => {
    //       this.btnLoading = false;
    //       return response;
    //     },
    //     (error) => {
    //       this.btnLoading = false;
    //       return Promise.reject(error);
    //     }
    //   );
    //   this.$axios
    //     .$delete(
    //       this.$cit.citBaseUrl + "/api/delete-admin/" + this.deleteItemId,
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
    //     })
    //     .catch((error) => {
    //       if(error.message=="Request failed with status code 401")this.$auth.logout();
    //       console.log(error);
    //       this.closeDelete();
    //     });
    // },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.isEdit = false;
      this.initialize();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.isEdit = false;
      this.initialize();
    },

    save() {
      if (this.editedIndex > -1) {
        // console.log(this.editedItem);
        // return;
        if (this.$auth.user.auth_id !== 3) {
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: "Only Super Admin can Edit Admin",
            color: "error",
          });
          this.isEdit = false;
          return;
        }
        // Add a request interceptor
        this.$axios.interceptors.request.use(
          (config) => {
            this.btnLoading = true;
            return config;
          },
          (error) => {
            this.btnLoading = false;
            return Promise.reject(error);
          }
        );
        // Add a response interceptor
        this.$axios.interceptors.response.use(
          (response) => {
            this.btnLoading = false;
            return response;
          },
          (error) => {
            this.btnLoading = false;
            return Promise.reject(error);
          }
        );
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("department_id", this.editedItem.department_id);
        formData.append("login_id", this.editedItem.login_id);
        formData.append("password", this.editedItem.password);
        formData.append("email", this.editedItem.email);
        formData.append("mobile", this.editedItem.mobile);
        formData.append("image", this.editedItem.image);
        formData.append("_method", "PATCH");
        this.$axios
          .$post(
            this.$cit.citBaseUrl + "/api/update-admin/" + this.editeItemId,
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
            console.log(res);
            // this.initialize();
            if(res.email||res.name||res.login_id){
                this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res,
                color: "error",
              });
              return;
            }
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.admins = res.getAdmins
            this.$store.dispatch("fireAdmins", this.admins);
            this.isEdit = false;
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
            this.isEdit = false;
            this.close();
          });
      } else {
        if (this.$auth.user.auth_id !== 3) {
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: "Only Super Admin can create Admin",
            color: "error",
          });
          this.isEdit = false;
          return;
        }
        // Add a request interceptor
        this.$axios.interceptors.request.use(
          (config) => {
            this.btnLoading = true;
            return config;
          },
          (error) => {
            this.btnLoading = false;
            return Promise.reject(error);
          }
        );
        // Add a response interceptor
        this.$axios.interceptors.response.use(
          (response) => {
            this.btnLoading = false;
            return response;
          },
          (error) => {
            this.btnLoading = false;
            return Promise.reject(error);
          }
        );
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("department_id", this.editedItem.department_id);
        formData.append("login_id", this.editedItem.login_id);
        formData.append("password", this.editedItem.password);
        formData.append("email", this.editedItem.email);
        formData.append("mobile", this.editedItem.mobile);
        formData.append("image", this.editedItem.image);
        formData.append("auth_id", 2);
        this.$axios.$post(this.$cit.citBaseUrl + "/api/create-admin", formData, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          // this.initialize();
          console.log(res);
          if(res.email||res.name||res.login_id||res.password||res.auth_id||res.department_id){
              this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res,
              color: "error",
            });
            return;
          }
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: res.error ? res.error : res.success,
            color: res.error ? "error" : "primary",
          });
          this.admins = res.getAdmins
          this.$store.dispatch("fireAdmins", this.admins);
          this.isEdit = false;
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
          this.isEdit = false;
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