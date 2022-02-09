<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="elevation-5"
    >
      <div class="mt-2 d-flex justify-center align-center flex-column">
        <v-img src="/logo.png" :width="miniVariant ? 40 : 150" contain class="my-4" alt="cit.tools"></v-img>
        <v-avatar :size="miniVariant ? 40 : 80">
          <img
            :src="
              $auth.user.image
                ? $auth.user.image
                : require('@/assets/images/avatars/1.png')
            "
            :alt="$auth.user.name"
          />
        </v-avatar>
        <p class="mb-0 text-uppercase font-weight-bold text--secondary">
          <span :style="miniVariant ? 'font-size:10px' : 'font-size:16px'">{{
            $auth.user.name
          }}</span>
        </p>
      </div>
      <v-list>
        <v-list-item link nuxt to="/super-admin/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-group
          :value="
            $route.path == '/super-admin/admin-list' ||
            $route.path == '/super-admin/student-list'
              ? true
              : false
          "
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>Users</v-list-item-title>
          </template>
          <v-list-item
            v-for="(user, i) in users"
            :key="i"
            nuxt
            link
            :to="user.to"
          >
            <v-list-item-title v-text="user.title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="user.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>

          <!-- <v-list-group :value="false" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Admins</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="([title, icon], i) in admins" :key="i" link>
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Actions</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="([title, icon], i) in cruds" :key="i" link>
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group> -->
        </v-list-group>
        <v-list-group
          :value="
            $route.path == '/super-admin/tools' ||
            $route.path == '/super-admin/departments' ||
            $route.path == '/super-admin/sub-category' ||
            $route.path == '/super-admin/tools-category'
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
    </v-navigation-drawer>
    <v-app-bar dark :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-if="$auth.loggedIn" v-text="$auth.user.name" />
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
    <v-footer :absolute="!fixed" app elevation="5" dark color="secondary">
      <span>&copy; {{ new Date().getFullYear() }} cit.tools</span>
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
  name: "super-admin-layout",
  middleware: ["super-admin"],
  data() {
    return {
      logoutDialog: false,
      multiLine: true,
      isDark: false,
      clipped: true,
      drawer: true,
      fixed: false,
      menu: false,
      users: [
        {
          icon: "mdi-account-supervisor",
          title: "Admins",
          to: "/super-admin/admin-list",
        },
        {
          icon: "mdi-account-group-outline",
          title: "Students",
          to: "/super-admin/student-list",
        },
      ],
      departments: [
        // {
        //   icon: "mdi-hammer-screwdriver",
        //   title: "Tools",
        //   to: "/super-admin/tools",
        // },
        {
          icon: "mdi-vector-intersection",
          title: "Departments",
          to: "/super-admin/departments",
        },
        // {
        //   icon: "mdi-source-branch",
        //   title: "Category",
        //   to: "/super-admin/tools-category",
        // },
        // {
        //   icon: "mdi-file-tree",
        //   title: "Sub-Category",
        //   to: "/super-admin/sub-category",
        // },
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
    // if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
  },
  methods: {
    logout() {
      this.logoutDialog = true;
      this.$auth.logout();
    },
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