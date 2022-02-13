<template>
  <v-app dark :style="$vuetify.theme.dark ? '' : ''">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="elevation-5"
    >
      <div class="mt-2 d-flex justify-center align-center flex-column">
        <v-img src="/CreativeITLogo.png" :width="miniVariant ? 40 : 150" contain class="my-4" alt="cit.tools"></v-img>
        <v-avatar :size="miniVariant ? 40 : 80">
          <img
            :src="$auth.user.image? $auth.user.image:require('@/assets/images/avatars/1.png')"
            :alt="$auth.user.name" style="border: 3px solid gray"
          />
        </v-avatar>
        <p class="mb-0 text-uppercase font-weight-bold text--secondary">
          <span :style="miniVariant ? 'font-size:10px' : 'font-size:13px'">{{
            $store.state.user_department.name
          }}</span>
        </p>
      </div>
      <v-list>
        <v-list-item link nuxt to="/admin/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-group
          :value="
            $route.path == '/admin/offers' ||
            $route.path == '/admin/categories' ||
            $route.path == '/admin/brands' ||
            $route.path == '/admin/locations' ||
            $route.path == '/admin/courses'
              ? true
              : false
          "
          prepend-icon="mdi-cog-outline"
        >
          <template v-slot:activator>
            <v-list-item-title>Settings</v-list-item-title>
          </template>

          <v-list-item
            v-for="(dpartment, i) in departments"
            :key="i"
            nuxt
            link
            :to="dpartment.to"
          >
            <v-list-item-title v-text="dpartment.title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="dpartment.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon color="error">mdi-power</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
      <!-- <v-list class="" style="position: absolute; bottom: 0; left: 0; right: 0">
        <v-list-item link @click="logout">
          <v-list-item-icon>
            <v-icon color="error">mdi-power-standby</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list> -->
    </v-navigation-drawer>
    <v-app-bar color="teal" dark :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
        class="hidden-sm-and-down"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped" class="hidden-sm-and-down">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="fixed = !fixed" class="hidden-sm-and-down">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-if="$auth.loggedIn" v-text="$auth.user.name" /> -->
      <v-spacer />
      <AppBarUserMenu />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click.stop="darkMode" v-bind="attrs" v-on="on">
            <v-icon v-show="isDark">mdi-moon-waxing-crescent</v-icon>
            <v-icon v-show="!isDark">mdi-white-balance-sunny</v-icon>
          </v-btn>
        </template>
        <span>{{ isDark ? "Light Mode" : "Dark Mode" }}</span>
      </v-tooltip>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
      :style="
        $vuetify.theme.dark
          ? ''
          : { background: $vuetify.theme.themes.light.background }
      "
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app elevation="5" dark>
      <span
        >cit.tools &copy; {{ new Date().getFullYear() }} Powered by Creative IT
        Institute | Developed by
        <a
          href="https://dmarkcy.com/"
          target="_blank"
          title="Digital Marketing Agency"
          style="color: #fff; text-decoration"
          >dMarkcy</a
        ></span
      >
    </v-footer>
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
    <v-dialog v-model="logoutDialog" hide-overlay persistent width="300">
      <v-card color="error" dark>
        <v-card-text>
          Logging out...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "admin-layout",
  middleware: ["admin"],
  data() {
    return {
      logoutDialog: false,
      logoutLoading: false,
      multiLine: true,
      isDark: false,
      clipped: true,
      drawer: true,
      fixed: false,
      menu: false,
      users: [
        {
          icon: "mdi-account-group-outline",
          title: "Students",
          to: "/admin/student-list",
        },
      ],
      departments: [
        {
          icon: "mdi-offer",
          title: "Offers",
          to: "/admin/offers",
        },
        // {
        //   icon: "mdi-vector-intersection",
        //   title: "Departments",
        //   to: "/admin/departments",
        // },
        {
          icon: "mdi-source-branch",
          title: "Categories",
          to: "/admin/categories",
        },
        {
          icon: "mdi-graph-outline",
          title: "Brands",
          to: "/admin/brands",
        },
        {
          icon: "mdi-map-marker-radius",
          title: "Locations",
          to: "/admin/locations",
        },
      ],
      settings: [
        ["Management", "mdi-account-multiple-outline"],
        ["Settings", "mdi-cog-outline"],
      ],
      cruds: [
        ["Create", "mdi-plus-outline"],
        ["Read", "mdi-file-outline"],
        ["Update", "mdi-update"],
        ["Delete", "mdi-delete"],
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
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
    logout() {
      this.logoutDialog = true;
      this.$auth.logout();
    },
  },
};
</script>