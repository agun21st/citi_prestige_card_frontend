<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="brands"
          :search="search"
          sort-by="id"
          item-key="id"
          sort-desc
          class="elevation-10"
          :loading="tableLoading"
          loading-text="Sub-Categories are loading..."
          style="font-weight: 600"
        >
          <template v-slot:header.name="{ header }">
            <strong>{{ header.text.toUpperCase() }}</strong>
          </template>
          <template v-slot:header.categories.name="{ header }">
            <strong>{{ header.text.toUpperCase() }}</strong>
          </template>
          <template v-slot:header.created_at="{ header }">
            <strong>{{ header.text.toUpperCase() }}</strong>
          </template>
          <template v-slot:header.actions="{ header }">
            <strong>{{ header.text.toUpperCase() }}</strong>
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
          <template v-slot:top>
            <v-toolbar
              flat
              :style="$vuetify.theme.dark?'': { background: $vuetify.theme.themes.light.background}"
            >
              <v-toolbar-title>Brands</v-toolbar-title>
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
                    fab
                    small
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <v-card :loading="modalCardLoading">
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
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              color="error"
                              :items="categories"
                              v-model="editedItem.category_id"
                              item-text="name"
                              item-value="id"
                              label="Select Category"
                              :rules="[(v) => !!v || 'Category is required']"
                              required
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Brand Name..."
                              @focus="$event.target.select()"
                              clearable
                              :rules="[
                                (v) => !!v || 'Brand name is required',
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
  name: "admin-category",
  layout: "admin",
  data: () => ({
    modalCardLoading: false,
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
      { text: "Brand", value: "name" },
      { text: "Category", value: "category.name" },
      // { text: "Status", value: "status" },
      { text: "Created_at", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    categories: [],
    brands: [],
    editedItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      category_id: 0,
      name: "",
    },
    defaultItem: {
      category_id: 0,
      name: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Create Brand"
        : "Edit Brand";
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
    // if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    if (this.$store.state.brands) {
      this.brands = this.$store.state.brands;
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
      this.$axios.$get(this.$cit.citBaseUrl + `/api/brands`, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          this.categories = res.categories;
          this.brands = res.brands;
          this.$store.dispatch("fireBrands", this.brands);
          this.tableLoading = false;
        })
        .catch((error) => {
          // if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.tableLoading = false;
        });
    },
    initializeWithoutLoader() {
      this.$axios.$get(this.$cit.citBaseUrl + `/api/brands`, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          this.categories = res.categories;
          this.brands = res.brands;
          this.$store.dispatch("fireBrands", this.brands);
        })
        .catch((error) => {
          // if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
        });
    },
    getCategories(id) {
      this.modalCardLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + "/api/categories/" + id, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          // console.log(res);
          this.categories = res.categories;
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
          this.modalCardLoading = false;
        });
    },
    editItem(item) {
      // console.log(item);
      // this.getCategories(item.course_id);
      this.editedItemId = item.id;
      this.editedIndex = this.brands.indexOf(item);
      this.editedItem = Object.assign({}, item);
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
    //       this.$cit.citBaseUrl + "/api/sub-categories/" + this.deleteItemId,
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
      this.$nuxt.refresh();
    },
    save() {
      if (this.editedIndex > -1) {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("category_id", this.editedItem.category_id);
        formData.append("name", this.editedItem.name);
        formData.append("_method", "PATCH");
        this.$axios.$post(this.$cit.citBaseUrl + "/api/brands/" + this.editedItemId,formData,{
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res)
          if(res.name)
          {
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.name,
              color: "error",
            });
            this.btnLoading = false;
            return;
          }
          if(res.category_id)
          {
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.category_id,
              color: "error",
            });
            this.btnLoading = false;
            return;
          }
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: res.success,
            color: "primary",
          });
          this.brands = res.brands;
          this.$store.dispatch("fireBrands", this.brands);
          this.btnLoading = false;
          this.close();
        })
        .catch((error) => {
          // if(error.message=="Request failed with status code 401")this.$auth.logout();
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
        formData.append("category_id", this.editedItem.category_id);
        formData.append("name", this.editedItem.name);
        this.$axios.$post(this.$cit.citBaseUrl + "/api/brands", formData, {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            if(res.name)
            {
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res.name,
                color: "error",
              });
              this.btnLoading = false;
              return;
            }
            if(res.category_id)
            {
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res.category_id,
                color: "error",
              });
              this.btnLoading = false;
              return;
            }
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            this.brands = res.brands;
            this.$store.dispatch("fireBrands", this.brands);
            this.btnLoading = false;
            this.close();
          })
          .catch((error) => {
            // if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log(error);
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: error,
              color: "error",
            });
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