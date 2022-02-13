<template>
  <div class="loginForm">
    <v-card class="d-flex flex-row" tile flat max-width="800" elevation="16">
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-card
            flat
            tile
            class="d-flex flex-column justify-center align-center pa-16"
            color="#f9f9f9"
          >
            <h2 class="text-center">
              Are you Student of Creative IT Institute?
            </h2>
            <v-card-subtitle class="text-justify"
              >Creative IT Institute, one of the leading IT training institutes
              in Bangladesh offers the best training opportunities. It has been
              playing a vital role to eradicate the unemployment problem since
              2008.</v-card-subtitle
            >
            <v-img src="/CreativeITLogo.png" max-width="200" contain>
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" v-show="!resetPass">
          <v-card flat tile class="d-flex flex-column pa-16">
            <v-img
              src="/CreativeITLogo.png"
              max-width="200"
              contain
              class="mb-5 mb-md-10"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
            <div>
              <!-- <v-form ref="form" v-model="valid" @submit.prevent="login"> -->
              <v-form ref="form" v-model="valid" @submit.prevent="login">
                <v-text-field
                  name="email"
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  autofocus="autofocus"
                  color="error"
                  @focus="$event.target.select()"
                  prepend-icon="mdi-email"
                ></v-text-field>
                <!-- <v-text-field
                  name="login_id"
                  v-model="login_id"
                  :rules="[(v) => !!v || 'User ID is required']"
                  label="User ID"
                  required
                  autofocus="autofocus"
                  color="error"
                  @focus="$event.target.select()"
                  prepend-icon="mdi-target-account"
                ></v-text-field> -->
                <v-text-field
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[passwordRules.required, passwordRules.min]"
                  :type="show3 ? 'text' : 'password'"
                  label="Password"
                  hint="At least 8 characters"
                  v-model="password"
                  @click:append="show3 = !show3"
                  color="error"
                  @focus="$event.target.select()"
                  counter="8"
                  prepend-icon="mdi-lock"
                ></v-text-field>
                <!-- <div class="float-right">
                  <v-btn @click="resetPassword" x-small text class="mt-3"
                    >I foregot password</v-btn
                  >
                </div> -->
                <v-btn
                  :disabled="!valid"
                  color="error"
                  rounded
                  class="mt-10 white--text"
                  type="submit"
                  @click="validate"
                  :loading="loading"
                >
                  Sign in
                </v-btn>
              </v-form>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" v-show="resetPass">
          <v-card flat tile class="d-flex flex-column pa-16">
            <v-img
              src="/logo.png"
              max-width="200"
              contain
              class="mb-5 mb-md-10"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
            <div>
              <v-form
                ref="form"
                v-model="valid"
                @submit.prevent="sendPasswordLink"
              >
                <v-text-field
                  name="email"
                  v-model="resetPasswordEmail"
                  :rules="emailRules"
                  label="Enter Your E-mail"
                  required
                  autofocus="autofocus"
                  color="error"
                  @focus="$event.target.select()"
                ></v-text-field>
                <div class="float-right">
                  <v-btn @click="resetPassword" small text>Sign In</v-btn>
                </div>
                <v-btn
                  :disabled="!valid"
                  color="error"
                  rounded
                  class="mt-10 white--text"
                  :loading="loading"
                  type="submit"
                >
                  Reset Password
                </v-btn>
              </v-form>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-snackbar v-model="snackbar" multi-line>
      Successfully done

      <template v-slot:action="{ attrs }">
        <v-btn color="success" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "login",
  layout: "custom",
  // middleware: ["authetication"],
  data: () => ({
    snackbar: false,
    resetPass: false,
    loading: false,
    valid: true,
    checkbox: false,
    dialog: false,
    text: "",
    errors: "",
    login_id: "",
    system_ip: "",
    system_name: "",
    system_browser: "",
    email: "",
    resetPasswordEmail: "",
    myPresenceId: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    show3: false,
    password: "",
    passwordRules: {
      required: (value) => !!value || "Required",
      min: (v) => v.length >= 8 || "Min 8 characters",
      emailMatch: () => "The email and password you entered don't match",
    },
  }),

  watch: {
    dialog(val) {
      if (!val) return;
      setTimeout(() => (this.dialog = false), 4000);
    },
  },
  computed: {},
  mounted() {
    // if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$citCookies.removeAll();}
    // console.log("------------------------");
    // console.log(window.navigator.platform);
    // console.log(this.browserDetection());
    // console.log("------------------------");
    this.system_browser = this.browserDetection();
    this.system_name = window.navigator.platform
    this.$vuetify.theme.light = true;
    localStorage.setItem("theme-color-mode","light");
    this.$axios.$get("https://api.ipify.org?format=json")
      .then((res) => {
        this.system_ip = res.ip;
        this.system_ip = this.system_ip.split(".").join("")
        this.$citCookies.set("creativeItInstitute_cit_prestige_card",this.system_ip);
        // this.myPresenceId = this.$citCookies.get("creativeItInstitute_cit_tools");
        // let ipString = this.myPresenceId.toString();
        // this.myPresenceId = ipString;
        // let ipStringFormat = ipString.match(/.{1,3}/g);
        // let finalIp = ipStringFormat.join(".");
        // console.log(finalIp);
        // console.log(typeof(finalIp));
      })
      .catch((error) => {
        if(error.message=="IP Request failed with status code 401")this.$auth.logout();
        console.log(error);
      });
    // console.log(this.myPresenceId == undefined);
    // console.log("this.myPresenceId");
    // console.log(this.myPresenceId);
    // console.log("this.myPresenceId");
    // if (this.myPresenceId == undefined) {
    //   this.$citCookies.set("myPresenceId", "cookie-value", {
    //     path: "/",
    //     maxAge: 60,
    //   });
    // }
  },

  methods: {
    browserDetection() {
      let userAgent = window.navigator.userAgent;
      let browserName;
      if(userAgent.match(/chrome|chromium|crios/i)){
          browserName = "chrome";
        }else if(userAgent.match(/firefox|fxios/i)){
          browserName = "firefox";
        }  else if(userAgent.match(/safari/i)){
          browserName = "safari";
        }else if(userAgent.match(/opr\//i)){
          browserName = "opera";
        } else if(userAgent.match(/edg/i)){
          browserName = "edge";
        }else{
          browserName="No browser detection";
        }
      return browserName;
    },
    resetPassword() {
      this.resetPass = !this.resetPass;
    },
    sendPasswordLink() {
      this.loading = true;
      this.$axios.$get(
          this.$cit.citBaseUrl +
            "/api/reset-password?email=" +
            this.resetPasswordEmail
        )
        .then((res) => {
          // console.log(res);
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: res.success,
            color: "primary",
          });
          this.loading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: error,
            color: "error",
          });
          this.loading = false;
        });
    },
    login() {
      this.loading = true;
      this.$auth.loginWith("laravelSanctum", {
        data: {
          email: this.email,
          password: this.password,
          creativeItInstitute_cit_tools: this.system_ip,
          system_name: this.system_name,
          system_browser: this.system_browser,
        },
        })
      .then((res) => {
        // this.$store.commit('updateSnackbar', { show: true })
        this.$store.dispatch("fireSnackbarAction", {
          show: true,
          message: res.data.message,
          color: "primary",
        });
        this.loading = false;
      })
      .catch((err) => {
        this.$store.dispatch("fireSnackbarAction", {
          show: true,
          message: "Invalid User ID or Password",
          color: "error",
        });
        this.loading = false;
        console.log(err);
      });
    },
    checkUserLoginStatus(){
      this.loading = true;
      // let formData = new FormData();
      // formData.append("login_id", this.login_id);
      // formData.append("creativeItInstitute_cit_tools", this.system_ip);
      this.$axios.$get(this.$cit.citBaseUrl + `/api/checkUserLoginStatus?login_id=${this.login_id}&creativeItInstitute_cit_tools=${this.system_ip}`,{
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log(res);
        if(res.status===621){
          // console.log(res);
          this.login();
        }
        if(res.status===126){
          // console.log(res);
          this.loading = false;
        }
        if(res.status===401){
          console.log(`${res.message[0].system_ip}${res.message[1].system_ip}`);
          // let ipStringFormatOne = (res.message[0].system_ip).match(/.{1,3}/g);
          // let ipStringFormatTwo = (res.message[1].system_ip).match(/.{1,3}/g);
          // let finalIpOne = ipStringFormatOne.join(".");
          // let finalIpTwo = ipStringFormatTwo.join(".");
          // let fullMessage = `Your login device quota is finished. You can login maximum two devices. Please contact CIT Admission team. Device details a) ${finalIpOne} b) ${finalIpTwo}`
          let fullMessage = "Your login device quota is finished. You can login maximum two devices. Please contact CIT Admission Team for details.";
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: fullMessage,
            color: "error",
          });
          this.loading = false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    },
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>

<style scoped>
div.loginForm {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/login_background.webp");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>