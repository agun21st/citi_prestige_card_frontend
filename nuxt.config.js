import colors from "vuetify/es5/util/colors";

export default {
    // Disable server-side rendering for spa app : https://go.nuxtjs.dev/ssr-mode
    ssr: false,
    // Target: https://go.nuxtjs.dev/config-target
    target: "static",
    // server: {
    //   port: 8089,
    // },
    // component loading progress bar init
    loading: {
        color: "red",
        height: "10px",
        continuous: true
    },
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: "%s - cit.tools",
        title: "cit.tools download area",
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: "" },
            { name: "format-detection", content: "telephone=no" }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ["~assets/css/custom.css"],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        // {
        //   src: '~plugins/tinymce-vue.js',
        //   mode: 'client',
        // }
        {
            src: "~plugins/citData.js",
            mode: "client"
        }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/vuetify
        "@nuxtjs/vuetify",
        // https://go.nuxtjs.dev/pwa
        "@nuxtjs/pwa",
    ],
    image: {
        citTools: {
            // baseURL: "https://api.cit.tools/images/tools/"
        }
    },
    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        // https://go.nuxtjs.dev/pwa
        "@nuxtjs/pwa",
        // https://auth.nuxtjs.org/
        "@nuxtjs/auth-next",
        // With options
        ["cookie-universal-nuxt", { alias: "citCookies" }],
    ],
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        credentials: true
    },
    proxy: {
        // "/laravel": {
        //     target: "https://laravel-auth.nuxtjs.app",
        //     pathRewrite: { "^/laravel": "/" }
        // }
    },
    router: {
        // middleware: ['auth']
    },
    // for auth-next module
    auth: {
        strategies: {
            laravelSanctum: {
                provider: "laravel/sanctum",
                // url: "https://api.cit.tools",
                url: "http://localhost:8000",
                endpoints: {
                    login: {
                        url: "/api/login",
                        method: "POST"
                    },
                    logout: {
                        url: "/api/logout",
                        method: "POST",
                        withCredentials: true
                    },
                    user: {
                        url: "/api/user",
                        method: "GET"
                    }
                },
                user: {
                    property: false
                }
            }
        },
        localStorage: false,
        redirect: {
            login: "/login",
            logout: "/login",
            home: "/"
        },
        cookie: {
            options: {
                maxAge: 60 * 60,
                secure: true
                    // expires: "Thu, 01 Jan 1970 00:00:00 GMT"
            }
        }
    },
    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        meta: {
            title: "CITI Tools App",
            author: "Md.M.H.Razib",
            mobileAppIOS: true,
            theme_color: "red"
        },
        manifest: {
            name: "cit.tools app",
            short_name: "cit.tools",
            description: "Creative IT Institute provide their students resources for better learning",
            lang: "en"
        },
        icon: {
            fileName: "app-icon.png"
        }
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ["~/assets/variables.scss"],
        theme: {
            dark: false,
            themes: {
                // light: {
                //   primary: colors.blue.darken2,
                //   accent: colors.grey.darken3,
                //   secondary: colors.amber.darken3,
                //   info: colors.teal.lighten1,
                //   warning: colors.amber.base,
                //   error: colors.deepOrange.accent4,
                //   success: colors.green.accent3,
                //   background: '#ecf0f3',
                // },
                // dark: {
                //   primary: colors.blue.darken2,
                //   accent: colors.grey.darken3,
                //   secondary: colors.amber.darken3,
                //   info: colors.teal.lighten1,
                //   warning: colors.amber.base,
                //   error: colors.deepOrange.accent4,
                //   success: colors.green.accent3
                // }
                light: {
                    primary: "#9155FD",
                    accent: "#0d6efd",
                    secondary: "#8A8D93",
                    success: "#56CA00",
                    info: "#16B1FF",
                    warning: "#FFB400",
                    error: "#FF4C51"
                },
                dark: {
                    primary: "#9155FD",
                    accent: "#0d6efd",
                    secondary: "#8A8D93",
                    success: "#56CA00",
                    info: "#16B1FF",
                    warning: "#FFB400",
                    error: "#FF4C51"
                }
            }
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        // analyze: true,
        // filenames: {
        //     app: '[name].[chunkhash].js'
        // },
    }
};