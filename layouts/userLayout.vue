<template>
  <v-app dark>
    <v-container>
      <v-toolbar flat tile dense color="transparent">
        <v-toolbar-title
          ><v-img src="/logo.png" max-width="150" contain></v-img
        ></v-toolbar-title>
        <v-spacer />
        <v-text-field
          label="Search Here..."
          color="error"
          filled
          rounded
          dense
          hide-details
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-spacer />
        <v-menu
          v-model="menu"
          bottom
          right
          transition="scale-transition"
          origin="top left"
        >
          <template v-slot:activator="{ on }">
            <v-chip pill v-on="on">
              <v-avatar left>
                <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
              </v-avatar>
              Zumanur
            </v-chip>
          </template>
          <v-card width="300">
            <v-list dark>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Zumanur</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $auth.user.email
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item @click="$auth.logout()">
                <v-list-item-action>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-action>
                <v-list-item-subtitle>Logout</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click.stop="darkMode" v-bind="attrs" v-on="on">
              <v-icon v-show="isDark">mdi-moon-waxing-crescent</v-icon>
              <v-icon v-show="!isDark">mdi-white-balance-sunny</v-icon>
            </v-btn>
          </template>
          <span>{{ isDark ? "Dark Mode" : "Light Mode" }}</span>
        </v-tooltip>
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-toolbar>
    </v-container>
    <!-- <v-app-bar fixed app color="transparent">
      <v-container>
        <v-toolbar-items class="hidden-md-and-down">
          <v-img src="/logo.png" max-width="150" contain></v-img>
          <v-spacer />
          <v-btn text @click.stop="$auth.logout()" class="mt-1">
            <v-icon left>mdi-logout</v-icon>Logout
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon @click.stop="darkMode" v-bind="attrs" v-on="on">
                <v-icon v-show="!isDark">mdi-moon-waxing-crescent</v-icon>
                <v-icon v-show="isDark">mdi-white-balance-sunny</v-icon>
              </v-btn>
            </template>
            <span>{{ isDark ? "Light Mode" : "Dark Mode" }}</span>
          </v-tooltip>
          <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-container>
    </v-app-bar> -->
    <v-main>
      <v-toolbar color="accent" dark>
        <v-spacer />
        <v-toolbar-items class="hidden-md-and-down">
          <v-btn text to="/" class="text-decoration-none">
            Print Templates
          </v-btn>
          <v-btn text to="/about" class="text-decoration-none">
            Product Mockups
          </v-btn>
          <v-btn text to="/price" class="text-decoration-none"> Price </v-btn>
          <v-btn text to="/free-trial" class="text-decoration-none">
            Web Templates
          </v-btn>
          <v-btn text to="/company" class="text-decoration-none">
            Logo Design
          </v-btn>
          <v-btn
            text
            to="/other-service"
            class="text-decoration-none dropdownSelector"
          >
            Vectors
          </v-btn>
          <v-btn text to="/blog" class="text-decoration-none"> Filters</v-btn>
          <v-menu
            v-model="servicesMenu"
            :close-on-content-click="false"
            :nudge-width="800"
            :nudge-left="400"
            offset-y
            transition="slide-y-transition"
            bottom
            open-on-hover
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" color="transparent" depressed>
                More
              </v-btn>
            </template>

            <v-card>
              <v-card-text class="pa-10">
                <v-layout row wrap>
                  <!-- <v-layout row wrap>
                    <v-flex xs12
                  </v-layout> -->
                  <v-flex xs12 sm6 md3>
                    <v-list shaped>
                      <v-card-title>Basic Image Editing</v-card-title>
                      <v-list-item-group color="primary">
                        <v-list-item
                          v-for="(item, i) in basicImageEditing"
                          :key="i"
                        >
                          <v-list-item-icon>
                            <v-icon v-text="item.icon" small></v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.text"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-list shaped>
                      <v-card-title>Image Enhancement</v-card-title>
                      <v-list-item-group color="primary">
                        <v-list-item
                          v-for="(item, i) in imageEnhancement"
                          :key="i"
                        >
                          <v-list-item-icon>
                            <v-icon v-text="item.icon" small></v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.text"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-list shaped>
                      <v-card-title>Image Manipulation</v-card-title>
                      <v-list-item-group color="primary">
                        <v-list-item
                          v-for="(item, i) in imageManupulation"
                          :key="i"
                        >
                          <v-list-item-icon>
                            <v-icon v-text="item.icon" small></v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.text"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-list shaped>
                      <v-card-title>Advanced Design</v-card-title>
                      <v-list-item-group color="primary">
                        <v-list-item
                          v-for="(item, i) in advancedDesign"
                          :key="i"
                        >
                          <v-list-item-icon>
                            <v-icon v-text="item.icon" small></v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.text"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="message" color="purple"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Enable messages</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-action>
                    <v-switch v-model="hints" color="purple"></v-switch>
                  </v-list-item-action>
                  <v-list-item-title>Enable hints</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click="menu = false"> Cancel </v-btn>
                <v-btn color="primary" text @click="menu = false"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-toolbar-items>
        <v-spacer />
      </v-toolbar>
      <nuxt />
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "user-layout",
  middleware: ["authetication"],
  data: () => ({
    isDark: false,
    clipped: false,
    drawer: false,
    fixed: false,
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
    fav: true,
    servicesMenu: false,
    message: false,
    hints: true,
  }),
  methods: {
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.isDark = this.$vuetify.theme.dark;
    },
  },
};
</script>
