<template>
  <div>
    <v-container class="d-flex justify-center flex-column align-center">
      <v-card max-width="800" class="">
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>My Profile</v-toolbar-title>
        </v-toolbar>
            <v-card flat class="pa-3 mt-2">
              <v-card-text class="d-flex align-center">
                <v-avatar rounded size="120" class="me-6">
                  <v-img
                    :src="$auth.user.image != null && $auth.user.image!=''?$auth.user.image:'/avatar_image.png'"
                  ></v-img>
                </v-avatar>
                <div>
                  <v-btn color="primary" class="me-3 mt-5"><span class=""
                      >ID: {{ $auth.user.login_id }}</span
                    >
                  </v-btn>
                </div>
              </v-card-text>

              <v-card-text>
                <v-form class="multi-col-validation mt-6">
                  <v-row>
                    <!-- <v-col md="6" cols="12">
                      <v-text-field
                        v-model="$auth.user.login_id"
                        label="User ID"
                        dense
                        outlined
                        readonly
                        prepend-icon="mdi-badge-account"
                      ></v-text-field>
                    </v-col> -->
                    <v-col md="6" cols="12">
                      <v-text-field
                        v-model="admin.name"
                        label="Name"
                        dense
                        outlined
                        prepend-icon="mdi-account"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="admin.email"
                        label="E-mail"
                        dense
                        outlined
                        prepend-icon="mdi-email"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="admin.mobile"
                        dense
                        label="Mobile"
                        prepend-icon="mdi-cellphone-basic"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[passwordRules.min]"
                        :type="show3 ? 'text' : 'password'"
                        label="Password"
                        hint="At least 8 characters"
                        v-model="admin.password"
                        @click:append="show3 = !show3"
                        color="error"
                        counter="8"
                        prepend-icon="mdi-lock"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input
                        v-model="admin.image"
                        :rules="imageRules"
                        accept="image/png, image/jpeg, image/bmp, image/webp"
                        prepend-icon="mdi-camera"
                        label="Photo (300x300)"
                        chips
                        show-size
                        outlined
                        dense
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        color="primary"
                        class="me-3 mt-4"
                        @click.stop="updateUserProfile"
                        :loading="saveChangesBtn"
                        block
                      >
                        Save changes
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  layout: "super_admin",
  data: () => ({
    saveChangesBtn: false,
    imageRules: [
      (value) =>
        !value ||
        value.size < 1000000 ||
        "Image size should be less than 1 MB!",
    ],
    show3: false,
    passwordRules: {
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    admin: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      image: null,
    },
  }),
  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    this.admin.name = this.$auth.user.name;
    this.admin.email = this.$auth.user.email;
    this.admin.mobile = this.$auth.user.mobile;
  },
  methods: {
    updateUserProfile() {
      this.saveChangesBtn = true;
      let formData = new FormData();
      formData.append("name", this.admin.name);
      formData.append("email", this.admin.email);
      formData.append("mobile", this.admin.mobile);
      formData.append("password", this.admin.password);
      formData.append("image", this.admin.image);
      // formData.append("auth_id", this.$auth.user.auth_id);
      formData.append("_method", "PATCH");
      this.$axios.$post(this.$cit.citBaseUrl + "/api/update-user-from-profile/" + this.$auth.user.id,
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
          // console.log(res);
          if(res.error){
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.error,
              color: "error",
            });
          }else{
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "green",
            });
          }
          // this.saveChangesBtn = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: error,
            color: "error",
          });
          this.saveChangesBtn = false;
        });
    },
  },
};
</script>