<template>
  <div>
    <v-menu
      offset-y
      :left="$vuetify.breakpoint.mobile ? false : true"
      nudge-bottom="1"
      min-width="300"
      content-class="user-profile-menu-content"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          pill
          v-on="on"
          :color="$vuetify.breakpoint.mobile ? 'transparent' : ''"
        >
          <v-avatar :left="$vuetify.breakpoint.mobile ? false : true" size="50">
            <v-img
              :src="
                $auth.user.image
                  ? $auth.user.image
                  : require('@/assets/images/avatars/1.png')
              "
            ></v-img> </v-avatar
          >{{ $vuetify.breakpoint.mobile ? "" : $auth.user.name }}
        </v-chip>
      </template>
      <v-list dense>
        <div class="pb-3 pt-2">
          <v-avatar size="50" style="border: 2px solid gray" class="ms-4">
            <v-img
              :src="
                $auth.user.image
                  ? $auth.user.image
                  : require('@/assets/images/avatars/1.png')
              "
            ></v-img>
          </v-avatar>
          <div
            class="d-inline-flex flex-column justify-center ms-3"
            style="vertical-align: middle"
          >
            <span class="text--primary font-weight-bold mb-n1 text-uppercase">
              {{ $auth.user.name }}
            </span>
            <small class="text--secondary font-weight-bold">{{
              $auth.user.email
            }}</small>
            <small class="text--secondary font-weight-bold">{{
              $store.state.user_department.name
            }}</small>
            <div class="d-flex align-center justify-space-between">
              <v-btn
                color="error"
                x-small
                rounded
                class="text-capitalize mt-1"
                max-width="80"
                @click.stop="editProfile"
                >Edit Profile</v-btn
              >&nbsp;&nbsp;
              <small class="text--secondary font-weight-bold"
                >({{ $auth.user.login_id }})</small
              >
            </div>
          </div>
        </div>

        <v-divider></v-divider>
        <v-list-item link @click="logout">
          <v-list-item-icon class="me-2">
            <v-icon size="22" color="error">mdi-power-standby</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-uppercase error--text">Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
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
  </div>
</template>

<script>
export default {
  data: () => ({
    logoutDialog: false,
  }),
  methods: {
    logout() {
      this.logoutDialog = true;
      this.$auth.logout();
    },
    editProfile() {
      if (this.$auth.user.auth_id == 1) {
        this.$router.push("/student/ProfileSettings");
      }
      if (this.$auth.user.auth_id == 2) {
        this.$router.push("/admin/ProfileSettings");
      }
      if (this.$auth.user.auth_id == 3) {
        this.$router.push("/super-admin/ProfileSettings");
      }
    },
  },
};
</script>

<style lang="scss">
.user-profile-menu-content {
  .v-list-item {
    min-height: 2.5rem !important;
  }
}
</style>
