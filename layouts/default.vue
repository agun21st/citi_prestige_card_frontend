<template>
  <v-app dark>
    <v-container>
      <v-toolbar flat tile dense color="transparent">
        <v-toolbar-title
          ><v-img
            src="/logo.png"
            max-width="150"
            contain
            style="cursor: pointer"
            @click="$router.push('/student/courses')"
          ></v-img
        ></v-toolbar-title>
        <v-spacer />
        <!-- <v-combobox
          v-model="selectedSearchItems"
          :items="$store.state.searchItems"
          placeholder="Search by Tool Name..."
          outlined
          dense
          item-value="id"
          item-text="name"
          prepend-inner-icon="mdi-magnify"
          hide-details
          color="error"
          rounded
          clearable
          class="hidden-md-and-down"
          @change="getToolsByCourse(selectedSearchItems, 'category')"
        ></v-combobox>
        <v-spacer /> -->
        <AppBarUserMenu />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click.stop="darkMode" v-bind="attrs" v-on="on">
              <v-icon v-show="isDark">mdi-moon-waxing-crescent</v-icon>
              <v-icon color="error" v-show="!isDark">mdi-white-balance-sunny</v-icon>
            </v-btn>
          </template>
          <span>{{ isDark ? "Light Mode" : "Dark Mode" }}</span>
        </v-tooltip>
        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click.stop="darkMode" v-bind="attrs" v-on="on">
              <v-icon v-show="isDark">mdi-moon-waxing-crescent</v-icon>
              <v-icon v-show="!isDark">mdi-white-balance-sunny</v-icon>
            </v-btn>
          </template>
          <span>{{ isDark ? "Dark Mode" : "Light Mode" }}</span>
        </v-tooltip> -->
        <!-- <v-btn
          icon
          @click.stop="rightDrawer = !rightDrawer"
          class="hidden-lg-and-up"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn> -->
      </v-toolbar>
    </v-container>
    <v-main>
      <nuxt />
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-for="item in sideMenuItems"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in item.items" :key="child.title">
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app color="secondary" dark elevation="24">
      <span>&copy; CITI 2008-{{ new Date().getFullYear() }}</span>
      <v-spacer/>
      Developed by <v-btn text link href="https://dmarkcy.com/" target="_blank" class="text-lowercase">d<span class="text-uppercase">M</span>arkcy</v-btn>
    </v-footer>
    <v-dialog v-model="progressDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
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
    <v-snackbar
      v-model="$store.state.snackbar.show"
      :multi-line="multiLine"
      :timeout="6000"
      :color="$store.state.snackbar.color"
      shaped
    >
      {{ $store.state.snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="$store.dispatch('fireSnackbarAction', { show: false })"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "StudentLayout",
  data: () => ({
    multiLine: true,
    progressDialog: false,
    menu: false,
    isDark: false,
    clipped: false,
    drawer: false,
    fixed: false,
    myFirstCourse: "",
    mySecondCourse: "",
    totalCourses: 0,
    fixedCourses: [],
    selectedSearchItems: "",
    searchItems: [],
    fiveCategoryItems: [],
    moreCategories: [],
    per_page: 0,
    toolsPagination: 1,
    toolsTotal: 0,
    items: [
      {
        icon: "mdi-apps",
        title: "Welcome",
        to: "/",
      },
      {
        icon: "mdi-chart-bubble",
        title: "Inspire",
        to: "/inspire",
      },
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    siteLogo: "/logo.png",
    menus: [
      { title: "Print Templates", link: "/" },
      { title: "Services", link: "/services" },
      { title: "About", link: "/about" },
      { title: "Price", link: "/price" },
      { title: "Free Trial", link: "/free-trial" },
      { title: "Company", link: "/company" },
      { title: "Other Service", link: "/other-service" },
      { title: "Blog", link: "/blog" },
      { title: "Contact", link: "/contact" },
    ],
    basicImageEditing: [
      { text: "Clipping Path", icon: "mdi-arrow-right-bold" },
      { text: "Multi Path", icon: "mdi-arrow-right-bold" },
      { text: "Neck Joint", icon: "mdi-arrow-right-bold" },
      { text: "Shadow Service", icon: "mdi-arrow-right-bold" },
    ],
    imageEnhancement: [
      { text: "Image Path", icon: "mdi-arrow-right-bold" },
      { text: "Color Correction", icon: "mdi-arrow-right-bold" },
      { text: "Exposer Correction", icon: "mdi-arrow-right-bold" },
      { text: "Jewelry Retouching", icon: "mdi-arrow-right-bold" },
    ],
    imageManupulation: [
      { text: "Image Masking", icon: "mdi-arrow-right-bold" },
      { text: "Photo Restoration", icon: "mdi-arrow-right-bold" },
      { text: "Raster To Vector", icon: "mdi-arrow-right-bold" },
      { text: "Image Manupulation", icon: "mdi-arrow-right-bold" },
    ],
    advancedDesign: [
      { text: "Advertisement", icon: "mdi-arrow-right-bold" },
      { text: "Brochure", icon: "mdi-arrow-right-bold" },
      { text: "Ecommerce Image", icon: "mdi-arrow-right-bold" },
      { text: "Special Offer", icon: "mdi-arrow-right-bold" },
    ],
    sideMenuItems: [
      {
        action: "mdi-ticket",
        items: [{ title: "List Item" }],
        title: "Attractions",
      },
      {
        action: "mdi-silverware-fork-knife",
        active: false,
        items: [
          { title: "Breakfast & brunch" },
          { title: "New American" },
          { title: "Sushi" },
        ],
        title: "Dining",
      },
      {
        action: "mdi-school",
        items: [{ title: "List Item" }],
        title: "Education",
      },
      {
        action: "mdi-run",
        items: [{ title: "List Item" }],
        title: "Family",
      },
      {
        action: "mdi-bottle-tonic-plus",
        items: [{ title: "List Item" }],
        title: "Health",
      },
      {
        action: "mdi-content-cut",
        items: [{ title: "List Item" }],
        title: "Office",
      },
      {
        action: "mdi-tag",
        items: [{ title: "List Item" }],
        title: "Promotions",
      },
    ],
    fav: true,
    servicesMenu: false,
    message: false,
    hints: true,
  }),
  mounted() {
    const checkThemeMode = localStorage.getItem('theme-color-mode');
    if(checkThemeMode){
      if(checkThemeMode==="light"){
        this.$vuetify.theme.light = true;
        this.isDark = false;
      }
      if(checkThemeMode==="dark"){
        this.$vuetify.theme.dark = true;
        this.isDark = true;
      }
    }else{
      this.$vuetify.theme.light = true;
      localStorage.setItem("theme-color-mode","light");
    }
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    // this.initialize();
  },
  methods: {
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.isDark = this.$vuetify.theme.dark;
      if(this.$vuetify.theme.dark){
        localStorage.setItem("theme-color-mode","dark");
      }else{
        localStorage.setItem("theme-color-mode","light");
      }
    },
  },
};
</script>
