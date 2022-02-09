<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="categories"
          :search="search"
          sort-by="id"
          item-key="id"
          sort-desc
          class="elevation-15"
          :loading="tableLoading"
          loading-text="Categories are loading..."
          :style="
            $vuetify.theme.dark
              ? ''
              : { background: $vuetify.theme.themes.light.background }
          "
        >
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
            <v-toolbar
              flat
              :style="
                $vuetify.theme.dark
                  ? ''
                  : { background: $vuetify.theme.themes.light.background }
              "
            >
              <v-toolbar-title>Tools Category</v-toolbar-title>
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
              <v-dialog v-model="dialog" max-width="600px" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="error"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add New
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
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Tools Category Name?"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[
                                (v) => !!v || 'Tools Category name is required',
                              ]"
                              required
                            ></v-text-field>
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
  name: "super-category",
  layout: "super_admin",
  data: () => ({
    isShowImage: false,
    deptThumbLink: "",
    tableLoading: false,
    search: "",
    btnLoading: false,
    dialog: false,
    dialogDelete: false,
    valid: true,
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "Category", value: "name" },
      { text: "Department", value: "departments.name" },
      // { text: "Status", value: "status" },
      { text: "Created", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    departments: [],
    categories: [],
    editeItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      department_id: "",
      name: "",
    },
    defaultItem: {
      department_id: "",
      name: "",
    },
  }),
  // async fetch() {
  //   this.tableLoading = true;
  //   this.$axios
  //     .$get(this.$cit.citBaseUrl + "/api/categories", {
  //       withCredentials: true,
  //       headers: {
  //         "X-Requested-With": "XMLHttpRequest",
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       this.departments = res.departments;
  //       this.categories = res.categories;
  //       this.tableLoading = false;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       this.tableLoading = false;
  //     });
  // },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Category" : "Edit Category";
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
    // console.log(this.$store.state.categories.length != 0);
    if (this.$store.state.categories.length != 0) {
      this.categories = this.$store.state.categories;
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
        .$get(this.$cit.citBaseUrl + "/api/categories", {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.departments = res.departments;
          this.categories = res.categories;
          this.$store.dispatch("fireCategories", this.categories);
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
      this.editedIndex = this.categories.indexOf(item);
      (item.deptThumbnail = null),
        (item.heroBackground = null),
        (this.editedItem = Object.assign({}, item));
      this.dialog = true;
    },

    // deleteItem(item) {
    //   this.deleteItemId = item.id;
    //   this.editedIndex = this.categories.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },

    // deleteItemConfirm() {
    //   this.btnLoading = true;
    //   this.$axios
    //     .$delete(
    //       this.$cit.citBaseUrl + "/api/categories/" + this.deleteItemId,
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
      this.$nuxt.refresh();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      sub_categories;
    },

    save() {
      if (this.editedIndex > -1) {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("department_id", this.editedItem.department_id);
        formData.append("_method", "PATCH");
        this.$axios
          .$post(
            this.$cit.citBaseUrl + "/api/categories/" + this.editeItemId,
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
            this.close();
            this.btnLoading = false;
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
            this.close();
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("name", this.editedItem.name);
        formData.append("department_id", this.editedItem.department_id);
        formData.append("created_by", this.$auth.user.id);
        this.$axios
          .$post(this.$cit.citBaseUrl + "/api/categories", formData, {
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
            this.close();
            this.btnLoading = false;
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
            this.close();
            this.btnLoading = false;
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