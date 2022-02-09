<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="students"
          :search="search"
          sort-by="id"
          sort-desc
          item-key="id"
          class="elevation-10"
          :loading="tableLoading"
          loading-text="Students are loading..."
          style="font-weight: 600"
        >
          <!-- <template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ header }"> -->

          <template v-slot:item.courses="{ item }">
            <!-- {{ item.courses }} -->
            <span v-if="item.courses != null">
              <span
                v-for="(course, index) in item.courses.split(',')"
                :key="index"
                class="d-flex align-center justify-center flex-column"
              >
                <v-chip
                  x-small
                  class="ma-1"
                  v-if="course != '' && course != null"
                >
                  {{ course }}
                </v-chip>
              </span>
            </span>
          </template>
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
              <v-toolbar-title>Students</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
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
              <v-dialog v-model="dialog" max-width="800px" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="error"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    fab
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
                        ><v-icon dark> mdi-close </v-icon></v-btn
                      >
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Student Name"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[
                                (v) => !!v || 'Student name is required',
                              ]"
                              required
                              autofocus="autofocus"
                              prepend-icon="mdi-account"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              name="email"
                              v-model="editedItem.email"
                              :rules="emailRules"
                              label="E-mail"
                              required
                              color="error"
                              @focus="$event.target.select()"
                              prepend-icon="mdi-gmail"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.login_id"
                              label="Student ID"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'User ID is required']"
                              required
                              @blur="checkLogin_id(editedItem.login_id)"
                              prepend-icon="mdi-account-key"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="
                                !isEdit
                                  ? [passwordRules.required, passwordRules.min]
                                  : []
                              "
                              :type="show3 ? 'text' : 'password'"
                              label="Password"
                              hint="At least 8 characters"
                              v-model="editedItem.password"
                              @click:append="show3 = !show3"
                              color="error"
                              @focus="$event.target.select()"
                              prepend-icon="mdi-lock"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-dialog
                              ref="admissionDateDialog"
                              v-model="admissionModal"
                              :return-value.sync="editedItem.admissionDate"
                              persistent
                              width="290px"
                              :rules="[(v) => !!v || 'Admission date is required']"
                              required
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.admissionDate"
                                  label="Admission Date"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.admissionDate"
                                scrollable
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="admissionModal = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.admissionDateDialog.save(editedItem.admissionDate)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-dialog>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.mobile"
                              label="Mobile Number"
                              @focus="$event.target.select()"
                              clearable
                              prepend-inner-icon="mdi-cellphone-basic"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-file-input
                              v-model="editedItem.image"
                              :rules="imageRules"
                              accept="image/png, image/jpeg, image/bmp, image/webp"
                              prepend-icon="mdi-camera"
                              label="Photo (300 x 300)"
                              chips
                              show-size
                            ></v-file-input>
                          </v-col>
                          <!-- <v-col cols="12" sm="6">
                            <v-combobox
                              v-model="editedItem.enrollments"
                              :items="courses"
                              label="Select Courses"
                              multiple
                              clearable
                              small-chips
                            >
                              <template v-slot:selection="data">
                                <v-chip
                                  :key="JSON.stringify(data.item)"
                                  v-bind="data.attrs"
                                  :input-value="data.selected"
                                  :disabled="data.disabled"
                                  @click:close="
                                    data.parent.selectItem(data.item)
                                  "
                                >
                                  <v-avatar
                                    class="accent white--text"
                                    left
                                    v-text="data.item.slice(0, 1).toUpperCase()"
                                  ></v-avatar>
                                  {{ data.item }}
                                </v-chip>
                              </template>
                            </v-combobox>
                          </v-col> -->
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
  name: "admin-student-list",
  layout: "admin",
  data: () => ({
    isShowImage: false,
    tableLoading: false,
    search: "",
    btnLoading: false,
    dialog: false,
    dialogDelete: false,
    valid: true,
    isEdit: false,
    oldLogin_id: 0,
    show3: false,
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
        "Department Thumbnail size should be less than 2 MB!",
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
      { text: "Email", value: "email" },
      { text: "Courses", value: "courses" },
      { text: "Photo", value: "image" },
      { text: "Status", value: "status" },
      { text: "Admission", value: "admissionDate" },
      // { text: "Created", value: "created_at" },
      // { text: "Updated", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    students: [],
    courses: [],
    editeItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    admissionModal: false,
    editedItem: {
      name: "",
      login_id: "",
      password: "",
      email: "",
      mobile: "",
      image: null,
      enrollments: [],
      admissionDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    defaultItem: {
      name: "",
      login_id: "",
      password: "",
      email: "",
      mobile: "",
      image: null,
      enrollments: [],
      admissionDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Student" : "Edit Student";
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
  },
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    if (this.$store.state.students.length != 0) {
      this.students = this.$store.state.students;
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
      this.$axios.$get(this.$cit.citBaseUrl + "/api/get-students", {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          // console.log(res);
          this.students = res.success;
          this.courses = res.courses;
          this.$store.dispatch("fireStudents", this.students);
          this.tableLoading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.tableLoading = false;
        });
    },

    editItem(item) {
      this.oldLogin_id = item.login_id;
      this.editeItemId = item.id;
      this.editedIndex = this.students.indexOf(item);
      item.image = null;
      item.password = "";
      this.isEdit = true;
      this.editedItem = Object.assign({}, item);
      if (item.courses == null || item.courses == "") {
      } else {
        this.editedItem.enrollments = item.courses.split(",");
      }
      this.dialog = true;
    },

    // deleteItem(item) {
    //   console.log('log-1');
    //   this.deleteItemId = item.id;
    //   console.log('log-2');
    //   this.editedIndex = this.students.indexOf(item);
    //   console.log('log-3');
    //   this.editedItem = Object.assign({}, item);
    //   console.log('log-4');
    //   this.isEdit = false;
    //   console.log('log-5');
    //   this.dialogDelete = true;
    //   console.log('log-6');
    // },

    // deleteItemConfirm() {
    //   this.btnLoading = true;
    //   this.$axios
    //     .$delete(
    //       this.$cit.citBaseUrl + "/api/delete-student/" + this.deleteItemId,
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
    //       this.initialize();
    //       this.closeDelete();
    //     })
    //     .catch((error) => {
    //       if(error.message=="Request failed with status code 401")this.$auth.logout();
    //       console.log(error);
    //       this.btnLoading = false;
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
      // this.$nuxt.refresh();
      this.initialize();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.isEdit = false;
      this.$nuxt.refresh();
    },
    checkLogin_id(studentLogin_id) {
      if (this.editedIndex > -1) {
        if (studentLogin_id != "") {
          this.$axios.$get(this.$cit.citBaseUrl + "/api/check-student-Login_id/" + studentLogin_id,
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
              if (res.userFound) {
                this.editedItem.login_id = this.oldLogin_id;
                this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.userFound,
                  color: "error",
                });
              }
            })
            .catch((error) => {
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              console.log(error);
            });
        }
      } else {
        if (studentLogin_id != "") {
          this.$axios.$get(this.$cit.citBaseUrl + "/api/check-student-Login_id/" + studentLogin_id,
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
              if (res.userFound) {
                this.editedItem.login_id = "";
                this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.userFound,
                  color: "error",
                });
              }
            })
            .catch((error) => {
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              console.log(error);
            });
        }
      }
    },
    save() {
      if (this.editedIndex > -1) {
        if (this.$auth.user.auth_id == 1) {
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: "Only Admin can create Students",
            color: "error",
          });
          this.isEdit = false;
          return;
        }
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("login_id", this.editedItem.login_id);
        formData.append("password", this.editedItem.password);
        formData.append("email", this.editedItem.email);
        formData.append("mobile", this.editedItem.mobile);
        formData.append("image", this.editedItem.image);
        formData.append("admissionDate", this.editedItem.admissionDate);
        for (var i = 0; i < this.editedItem.enrollments.length; i++) {
          let file = this.editedItem.enrollments[i];
          formData.append("enrollments[" + i + "]", file);
        }
        formData.append("_method", "PATCH");
        this.$axios
          .$post(
            this.$cit.citBaseUrl + "/api/update-student/" + this.editeItemId,
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
            // console.log(res);
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.editedItem = Object.assign({}, this.defaultItem);
            this.btnLoading = false;
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
            this.btnLoading = false;
            this.close();
          });
      } else {
        if (this.$auth.user.auth_id == 1) {
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: "Only Admin can create Students",
            color: "error",
          });
          this.isEdit = false;
          return;
        }
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("login_id", this.editedItem.login_id);
        formData.append("password", this.editedItem.password);
        formData.append("email", this.editedItem.email);
        formData.append("mobile", this.editedItem.mobile);
        formData.append("image", this.editedItem.image);
        formData.append("admissionDate", this.editedItem.admissionDate);
        for (var i = 0; i < this.editedItem.enrollments.length; i++) {
          let file = this.editedItem.enrollments[i];
          formData.append("enrollments[" + i + "]", file);
        }
        formData.append("auth_id", 1);
        this.$axios
          .$post(this.$cit.citBaseUrl + "/api/create-student", formData, {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            // console.log("resThen");
            // console.log(res);
            // console.log("resThen");
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.error ? res.error : res.success,
              color: res.error ? "error" : "primary",
            });
            this.editedItem = Object.assign({}, this.defaultItem);
            this.isEdit = false;
            this.btnLoading = false;
            this.initialize();
            this.close();
          })
          .catch((error) => {
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log("errorCatch");
            console.log(error);
            console.log("errorCatch");
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: error,
              color: "error",
            });
            this.editedItem = Object.assign({}, this.defaultItem);
            this.isEdit = false;
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