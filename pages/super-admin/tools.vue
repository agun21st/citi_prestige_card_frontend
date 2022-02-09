<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <!-- <v-data-table
          :headers="headers"
          :items="tools"
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
          :items-per-page="per_page"
          :loading="tableLoading"
          hide-default-footer
          sort-by="id"
          sort-desc
          item-key="id"
          class="elevation-10 mb-16"
          loading-text="Tools are loading..."
          style="font-weight: 600"
        >
          <template v-slot:item.toolThumbnail="{ item }">
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
          </template>
          <template v-slot:item.sliderImages="{ item }">
            <span v-if="item.sliderImages">
              <span class="d-flex justify-center align-center wrap">
                <v-img
                  v-for="image in item.sliderImages.split(',')"
                  :key="image"
                  :src="image"
                  lazy-src="https://picsum.photos/10/6"
                  style="width: 50px; height: 50px; cursor: pointer"
                  @click.stop="showImage(image)"
                  class="mx-2"
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
          <!-- <template v-slot:header.name="{ header }">
          {{ header.text.toUpperCase() }}
          </template> -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="hidden-sm-and-down"
                >Tools</v-toolbar-title
              >
              <v-divider
                class="mx-4 hidden-sm-and-down"
                inset
                vertical
              ></v-divider>
              <v-select
                v-model="searchFromServer"
                :items="departmentName"
                label="Filter by Department"
                dense
                solo
                hide-details
                class="mr-5 hidden-sm-and-down"
              ></v-select>
              <v-spacer class="d-none d-md-block"></v-spacer>
              <v-text-field
                v-model="searchFromServer"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
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
              <v-dialog v-model="dialog" max-width="1000px" persistent>
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
                          <v-col cols="12" md="4">
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
                              @change="getCategories(editedItem.department_id)"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              color="error"
                              :items="categories"
                              v-model="editedItem.category_id"
                              item-text="name"
                              item-value="id"
                              clearable
                              label="Select Category"
                              :rules="[(v) => !!v || 'Category is required']"
                              required
                              :disabled="departmentIsSelected"
                              @change="getSubCategories(editedItem.category_id)"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              color="error"
                              :items="subCategories"
                              v-model="editedItem.subCategory_id"
                              item-text="name"
                              item-value="id"
                              clearable
                              label="Select Sub-Category"
                              :rules="[
                                (v) => !!v || 'Sub-Category is required',
                              ]"
                              required
                              :disabled="categoryIsSelected"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Tool Name?"
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
                              label="Tool Thumbnail (300 x 170)"
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
                              label="Download Link?"
                              @focus="$event.target.select()"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-textarea
                              v-model="editedItem.descriptions"
                              clearable
                              counter
                              clear-icon="mdi-close-circle"
                              label="Descriptions"
                              rows="1"
                              auto-grow
                              :rules="[(v) => !!v || 'Description is required']"
                              required
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-textarea
                              v-model="editedItem.features"
                              clearable
                              counter
                              clear-icon="mdi-close-circle"
                              label="Features (one each line)"
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
          <template v-if="true" v-slot:footer>
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
  name: "super-tools",
  layout: "super_admin",
  data: () => ({
    modalCardLoading: false,
    isShowImage: false,
    departmentIsSelected: true,
    categoryIsSelected: true,
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
      { text: "Name", value: "name" },
      { text: "Department", value: "department.name" },
      { text: "Category", value: "category.name" },
      { text: "Sub-Category", value: "sub_category.name" },
      { text: "Thumbnail", value: "toolThumbnail" },
      { text: "Slides", value: "sliderImages" },
      { text: "Download_Link", value: "downloadLink" },
      // { text: "Status", value: "status" },
      { text: "Created", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    departmentName: [],
    departments: [],
    categories: [],
    subCategories: [],
    tools: [],
    per_page: 0,
    toolsPagination: 1,
    toolsTotal: 0,
    searchFromServer: "",
    editeItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      department_id: 0,
      category_id: 0,
      subCategory_id: 0,
      name: "",
      toolThumbnail: null,
      sliderImages: [],
      downloadLink: "",
      descriptions: "",
      features: "",
    },
    defaultItem: {
      department_id: 0,
      category_id: 0,
      subCategory_id: 0,
      name: "",
      toolThumbnail: null,
      sliderImages: null,
      downloadLink: "",
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
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    searchFromServer() {
      this.initialize();
    },
  },
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    if (this.$store.state.tools.length != 0) {
      // console.log(this.$store.state.tools.length);
      this.tools = this.$store.state.tools;
      this.initialize();
    } else {
      // console.log("else");
      this.initialize();
    }
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    initialize() {
      this.tableLoading = true;

      if (this.searchFromServer) {
        this.$axios
          .$get(
            this.$cit.citBaseUrl +
              `/api/tools?searchBy=${this.searchFromServer}&page=${this.toolsPagination}`,
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
            this.tools = res.allTools.data;
            this.toolsPagination = res.allTools.current_page;
            this.toolsTotal = res.allTools.last_page;
            this.per_page = res.allTools.per_page;
            this.departments = res.departments;
            this.$store.dispatch("fireTools", this.tools);
            this.tableLoading = false;
          })
          .catch((error) => {
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log(error);
            this.tableLoading = false;
          });
      } else {
        this.$axios
          .$get(
            this.$cit.citBaseUrl + `/api/tools?page=${this.toolsPagination}`,
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
            // return;
            this.tools = res.allTools.data;
            this.toolsPagination = res.allTools.current_page;
            this.toolsTotal = res.allTools.last_page;
            this.per_page = res.allTools.per_page;
            this.departments = res.departments;
            res.departmentNames.forEach((element) => {
              this.departmentName.push(element.name);
            });
            this.$store.dispatch("fireTools", this.tools);
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
    getSubCategories(id) {
      this.modalCardLoading = true;
      this.$axios
        .$get(this.$cit.citBaseUrl + "/api/tools-subCategories/" + id, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          this.subCategories = res.subCategories;
          if (!(this.subCategories.length === 0)) {
            this.categoryIsSelected = false;
          } else {
            this.categoryIsSelected = true;
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
    editItem(item) {
      // console.log(item);
      this.editeItemId = item.id;
      this.editedIndex = this.tools.indexOf(item);
      item.toolThumbnail = null;
      item.sliderImages = null;
      this.editedItem = Object.assign({}, item);
      if (this.editedItem.downloadLink === "null") {
        this.editedItem.downloadLink = "";
      }
      this.getCategories(this.editedItem.department_id);
      this.getSubCategories(this.editedItem.category_id);
      this.departmentIsSelected = false;
      this.categoryIsSelected = false;
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
    //     })
    //     .catch((error) => {
    //       if(error.message=="Request failed with status code 401")this.$auth.logout();
    //       console.log(error);
    //       this.closeDelete();
    //       this.btnLoading = false;
    //     });

    //   this.initialize();
    // },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
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
        formData.append("department_id", this.editedItem.department_id);
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
        formData.append("downloadLink", this.editedItem.downloadLink);
        formData.append("descriptions", this.editedItem.descriptions);
        formData.append("features", this.editedItem.features);
        formData.append("_method", "PATCH");
        this.$axios
          .$post(
            this.$cit.citBaseUrl + "/api/tools/" + this.editeItemId,
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
        formData.append("department_id", this.editedItem.department_id);
        formData.append("category_id", this.editedItem.category_id);
        formData.append("subCategory_id", this.editedItem.subCategory_id);
        formData.append("name", this.editedItem.name);
        formData.append("toolThumbnail", this.editedItem.toolThumbnail);
        for (var i = 0; i < this.editedItem.sliderImages.length; i++) {
          let file = this.editedItem.sliderImages[i];
          formData.append("sliderImages[" + i + "]", file);
        }
        formData.append("descriptions", this.editedItem.descriptions);
        formData.append("downloadLink", this.editedItem.downloadLink);
        formData.append("features", this.editedItem.features);
        formData.append("created_by", this.$auth.user.id);
        this.$axios
          .$post(this.$cit.citBaseUrl + "/api/tools", formData, {
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