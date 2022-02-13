<template>
  <div>
    <v-container>
      <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="offers"
            :search="search"
            sort-by="id"
            item-key="id"
            sort-desc
            class="elevation-10"
            :loading="tableLoading"
            loading-text="offers are loading..."
            style="font-weight: 600"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
          >
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-row justify="space-between">
                  <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center align-center">
                    <span v-if="item.logo" class="pa-5">
                      <v-img
                        :src="item.logo"
                        lazy-src="https://picsum.photos/10/6"
                        :alt="item.name"
                        style="width: 100px; height: 100px; cursor: pointer"
                        @click.stop="showImage(item.logo)"
                        class="elevation-5"
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
                  <v-col cols="12">
                    <div v-html="item.description"></div>
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
            <template v-slot:item.discount="{ item }">
              {{
                item.discount + "%"
              }}
            </template>
            <template v-slot:header.title="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.discount="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.location.name="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.brand.name="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.category.name="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.actions="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.created_at="{ header }">
              <strong>{{ header.text.toUpperCase() }}</strong>
            </template>
            <template v-slot:header.data-table-expand="{ header }">
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
                <v-toolbar-title>Offers</v-toolbar-title>
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
                          v-if="$vuetify.breakpoint.mobile"><v-icon dark> mdi-close </v-icon></v-btn
                        >
                      </v-card-title>
                      <v-card-text>
                         <v-container>
                            <v-row>
                              <v-col cols="12" sm="4">
                                <v-autocomplete
                                  color="error"
                                  :items="categories"
                                  v-model="editedItem.category_id"
                                  item-text="name"
                                  item-value="id"
                                  label="Select Category"
                                  :rules="[(v) => !!v || 'Category is required']"
                                  required
                                  @change="getBrandsByCategory(editedItem.category_id)"
                                ></v-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-autocomplete
                                  color="error"
                                  :items="brands"
                                  v-model="editedItem.brand_id"
                                  item-text="name"
                                  item-value="id"
                                  label="Select Brand"
                                  :rules="[(v) => !!v || 'Brand is required']"
                                  required
                                  :disabled="!isCategorySelected"
                                  @change="getLocationsByBrand(editedItem.brand_id)"
                                ></v-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-autocomplete
                                  color="error"
                                  :items="locations"
                                  v-model="editedItem.location_id"
                                  item-text="name"
                                  item-value="id"
                                  label="Select Location"
                                  :disabled="!isBrandSelected"
                                ></v-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-text-field
                                  v-model="editedItem.title"
                                  label="Offer Title..."
                                  @focus="$event.target.select()"
                                  clearable
                                  :rules="[
                                    (v) => !!v || 'Offer Title is required',
                                  ]"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-file-input
                                v-model="editedItem.logo"
                                accept="image/png, image/jpeg, image/bmp, image/webp"
                                prepend-icon="mdi-camera"
                                label="Upload Logo..."
                                small-chips
                                show-size
                                color="error"
                              ></v-file-input>
                              </v-col>
                              <v-col cols="12" sm="4">
                                <v-text-field
                                  v-model="editedItem.discount"
                                  label="Discount in %"
                                  @focus="$event.target.select()"
                                  type="number"
                                  min="0"
                                  :rules="[
                                    (v) => !!v || 'Offer Title is required',
                                  ]"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-btn color="secondary" @click="detailsDialog=true" block>{{editedItem.description!=""?'Update Details':'Enter Details'}}</v-btn>
                              </v-col>
                              <v-col cols="12">
                                <div v-html="editedItem.description"></div>
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
    <v-row justify="center">
      <v-dialog
        v-model="detailsDialog"
        max-width="1920px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Use Text Editor for Offer Details</span>
          </v-card-title>
          <v-card-text>
            <client-only placeholder="loading...">
              <editor
                v-model="editedItem.description"
                id="myMceEditor"
                api-key="1gxb79cgcti0v9z7bay8607qp7zvakb5q97dt36gyesbd4u9"
                :init="{
                  height: 300,
                  plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                  imagetools_cors_hosts: ['picsum.photos'],
                  menubar: 'file edit view insert format tools table help',
                  toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl code',
                  toolbar_sticky: true,
                  autosave_ask_before_unload: true,
                  autosave_interval: '30s',
                  autosave_prefix: '{path}{query}-{id}-',
                  autosave_restore_when_empty: false,
                  autosave_retention: '2m',
                  image_advtab: true,
                  link_list: [
                    { title: 'My page 1', value: 'https://www.tiny.cloud' },
                    { title: 'My page 2', value: 'http://www.moxiecode.com' }
                  ],
                  image_list: [
                    { title: 'My page 1', value: 'https://www.tiny.cloud' },
                    { title: 'My page 2', value: 'http://www.moxiecode.com' }
                  ],
                  image_class_list: [
                    { title: 'None', value: '' },
                    { title: 'Some class', value: 'class-name' }
                  ],
                  importcss_append: true,
                  file_picker_callback: function (callback, value, meta) {
                    /* Provide file and text for the link dialog */
                    if (meta.filetype === 'file') {
                      callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                    }

                    /* Provide image and alt text for the image dialog */
                    if (meta.filetype === 'image') {
                      callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
                    }

                    /* Provide alternative source and posted for the media dialog */
                    if (meta.filetype === 'media') {
                      callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
                    }
                  },
                  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                  height: 350,
                  image_caption: true,
                  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                  noneditable_noneditable_class: 'mceNonEditable',
                  toolbar_mode: 'sliding',
                  contextmenu: 'link image imagetools table',
                  skin: useDarkMode ? 'oxide-dark' : 'oxide',
                  content_css: useDarkMode ? 'dark' : 'default',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }"
              />
            </client-only>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn
              color="green darken-1"
              text
              @click="detailsDialog = false"
            >
              Disagree
            </v-btn> -->
            <v-btn
              color="primary darken-1"
              @click="detailsDialog = false"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {
    'editor': () => { if (process.client) { return import('@tinymce/tinymce-vue') } },
  },
  name: "admin-course",
  layout: "admin",
  data: () => ({
    useDarkMode: false,
    cardLoading: false,
    isCategorySelected: false,
    isBrandSelected: false,
    detailsDialog: false,
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
    singleExpand: true,
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "Title", value: "title" },
      { text: "Discount", value: "discount" },
      { text: "Location", value: "location.name" },
      { text: "Brand", value: "brand.name" },
      { text: "Category", value: "category.name" },
      // { text: "Status", value: "status" },
      { text: "Created_at", value: "created_at" },
      // { text: "Actions", value: "actions", sortable: false },
      { text: 'Actions', value: 'data-table-expand', sortable: false,},
    ],
    categories: [],
    brands: [],
    locations: [],
    offers: [],
    editedItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    editedItem: {
      category_id: 0,
      brand_id: 0,
      location_id: 0,
      title: "",
      logo: null,
      discount: 0,
      description: "",
    },
    defaultItem: {
      category_id: 0,
      brand_id: 0,
      location_id: 0,
      title: "",
      logo: null,
      discount: 0,
      description: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Offer" : "Edit Offer";
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
    if (this.$store.state.offers.length != 0) {
      this.offers = this.$store.state.offers;
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
      this.$axios.$get(this.$cit.citBaseUrl + `/api/offers`, {
        withCredentials: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res)
        this.categories = res.categories;
        this.offers = res.offers;
        this.$store.dispatch("fireOffers", this.offers);
        this.tableLoading = false;
      })
      .catch((error) => {
        // if(error.message=="Request failed with status code 401")this.$auth.logout();
        console.log(error);
        this.tableLoading = false;
      });
    },
    initializeWithoutLoader() {
      this.$axios.$get(this.$cit.citBaseUrl + `/api/offers`, {
        withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("res")
          console.log(res)
          console.log("res")
          this.categories = res.categories;
          this.offers = res.offers;
          this.$store.dispatch("fireOffers", this.offers);
        })
        .catch((error) => {
          // if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
        });
    },
    getBrandsByCategory(category_id) {
      this.cardLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + `/api/brands/`+category_id, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if(res.brands[0]){
            this.brands = res.brands;
            this.isCategorySelected = true;
            this.isBrandSelected = false;
            this.editedItem.location_id="";
          }else{
            this.isCategorySelected = false;
            this.isBrandSelected = false;
            this.editedItem.brand_id="";
            this.editedItem.location_id="";
          }
          this.cardLoading = false;
        })
        .catch((error) => {
          // if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.cardLoading = false;
        });
    },
    getLocationsByBrand(brand_id) {
      console.log(brand_id);
      this.cardLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + `/api/offers/`+brand_id, {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log(res)
          if(res.locations[0]){
            this.locations = res.locations;
            this.isBrandSelected = true;
          }else{
            this.isBrandSelected = false;
            this.editedItem.location_id="";
          }
          this.cardLoading = false;
        })
        .catch((error) => {
          // if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.cardLoading = false;
        });
    },
    editItem(item) {
      console.log(item)
      item.logo = null;
      this.getBrandsByCategory(item.category_id);
      this.editedItemId = item.id;
      this.editedIndex = this.offers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    // deleteItem(item) {
    //   this.deleteItemId = item.id;
    //   this.editedIndex = this.offers.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },
    // deleteItemConfirm() {
    //   this.btnLoading = true;
    //   this.$axios
    //     .$delete(
    //       this.$cit.citBaseUrl + "/api/offers/" + this.deleteItemId,
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
        // console.log(this.editedItem.courseThumbnail);
        // return;
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("category_id", this.editedItem.category_id);
        formData.append("brand_id", this.editedItem.brand_id);
        formData.append("location_id", this.editedItem.location_id);
        formData.append("title", this.editedItem.title);
        formData.append("logo", this.editedItem.logo);
        formData.append("discount", this.editedItem.discount);
        formData.append("description", this.editedItem.description);
        formData.append("_method", "PATCH");
        this.$axios.$post(this.$cit.citBaseUrl + "/api/offers/" + this.editedItemId,formData,
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
            console.log(res)
            // this.btnLoading = false;
            // return;
            if(res.title||res.category_id||res.brand_id||res.location_id){
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res,
                color: "error",
              });
            }
            if(res.success){
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res.success,
                color: "primary",
              });
              this.offers = res.offers;
              this.$store.dispatch("fireOffers", this.offers);
              this.close();
            }
            this.btnLoading = false;
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
          });
      } else {
        this.btnLoading = true;
        let formData = new FormData();
        formData.append("category_id", this.editedItem.category_id);
        formData.append("brand_id", this.editedItem.brand_id);
        formData.append("location_id", this.editedItem.location_id);
        formData.append("title", this.editedItem.title);
        formData.append("logo", this.editedItem.logo);
        formData.append("discount", this.editedItem.discount);
        formData.append("description", this.editedItem.description);
        this.$axios.$post(this.$cit.citBaseUrl + "/api/offers", formData, {
            withCredentials: true,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          })
          .then((res) => {
            console.log(res)
            // this.btnLoading = false;
            // return;
            if(res.title||res.category_id||res.brand_id||res.location_id){
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res,
                color: "error",
              });
            }
            if(res.success){
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res.success,
                color: "primary",
              });
              this.offers = res.offers;
              this.$store.dispatch("fireOffers", this.offers);
              this.close();
            }
            this.btnLoading = false;
          })
          .catch((error) => {
            // if(error.message=="Request failed with status code 401")this.$auth.logout();
            console.log(error);
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: error,
              color: "error",
            });
            this.btnLoading = true;
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