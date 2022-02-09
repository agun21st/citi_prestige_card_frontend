<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :options.sync="options"
      :server-items-length="totalDesserts"
      :loading="loading"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
  export default {
    name: "admin-tools",
    layout: "admin",
    data () {
      return {
        totalDesserts: 0,
        desserts: [],
        loading: true,
        options: {},
        headers: [
          {
            text: "ID",
            align: "start",
            sortable: true,
            value: "id",
          },
          { text: "Name", value: "name" },
          { text: "Department", value: "department.name", width: "150px" },
          { text: "Category", value: "category.name" },
          { text: "Sub-Category", value: "sub_category.name" },
          { text: "Thumbnail", value: "toolThumbnail" },
          { text: "Slides", value: "sliderImages" },
          { text: "Download_Link", value: "downloadLink" },
          // { text: "Status", value: "status" },
          { text: "Created", value: "created_at", width: "180px" },
          { text: "Actions", value: "actions", sortable: false, width: "80px" },
        ],
      }
    },
    watch: {
      options: {
        handler () {
          this.initialize()
        },
        deep: true,
      },
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        this.fakeApiCall().then(data => {
          this.desserts = data.items
          this.totalDesserts = data.total
          this.loading = false
        })
      },
      initialize() {
        this.tableLoading = true;

        if (this.searchFromServer) {
          this.$axios
            .$get(
              this.$cit.citBaseUrl +
                `/api/tools?dept=${this.$auth.user.department_id}&searchBy=${this.searchFromServer}&page=${this.toolsPagination}`,
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
              this.$cit.citBaseUrl + `/api/tools?dept=${this.$auth.user.department_id}`,
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
              console.log(res);
              this.desserts = res.allTools.data
              this.totalDesserts = res.allTools.total

              // this.tools = res.allTools.data;
              // this.toolsPagination = res.allTools.current_page;
              // this.toolsTotal = res.allTools.last_page;
              // this.per_page = res.allTools.per_page;
              // this.departments = res.departments;
              // res.departmentNames.forEach((element) => {
              //   this.departmentName.push(element.name);
              // });
              // this.$store.dispatch("fireTools", this.tools);
              this.tableLoading = false;
            })
            .catch((error) => {
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              console.log(error);
              this.tableLoading = false;
            });
        }
      },
      /**
       * In a real application this would be a call to fetch() or axios.get()
       */
      fakeApiCall () {
        return new Promise((resolve, reject) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options

          let items = this.getDesserts()
          const total = items.length

          if (sortBy.length === 1 && sortDesc.length === 1) {
            items = items.sort((a, b) => {
              const sortA = a[sortBy[0]]
              const sortB = b[sortBy[0]]

              if (sortDesc[0]) {
                if (sortA < sortB) return 1
                if (sortA > sortB) return -1
                return 0
              } else {
                if (sortA < sortB) return -1
                if (sortA > sortB) return 1
                return 0
              }
            })
          }

          if (itemsPerPage > 0) {
            items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
          }

          setTimeout(() => {
            resolve({
              items,
              total,
            })
          }, 1000)
        })
      },
      getDesserts () {
        return [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ]
      },
    },
  }
</script>