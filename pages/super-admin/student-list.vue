<template>
  <div>
    <v-card class="mx-auto ma-0 ma-md-5" tile flat color="transparent">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="students"
          :options.sync="options"
          :server-items-length="totalStudent"
          sort-by="id"
          sort-desc
          item-key="id"
          class="elevation-10"
          :loading="tableLoading"
          loading-text="Students are loading..."
          style="font-weight: 600"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          :footer-props="{
            'items-per-page-options':[10,20,30,40,50,100,200,500,1000]
          }"
        >
          <!-- <template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ header }"> -->
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-row justify="center" class="my-5" v-if="item.login_details[0]">
                <v-col cols="12">
                  <v-data-table
                    :headers="LoginDetailsHeaders"
                    :items="item.login_details"
                    sort-by="id"
                  >
                    <template v-slot:item.login_details_id="{item}">
                      {{item.id}}
                    </template>
                    <template v-slot:item.login_details_system_ip="{item}">
                      {{item.system_ip.match(/.{1,3}/g).join(".")}}
                    </template>
                    <template v-slot:item.login_details_system_name="{item}">
                      {{item.system_name}}
                    </template>
                    <template v-slot:item.login_details_system_browser="{item}">
                      {{item.system_browser}}
                    </template>
                    <template v-slot:item.login_details_updated_at="{item}">
                      {{
                        new Date(item.updated_at).toLocaleDateString(undefined, {
                          weekend: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      }}
                    </template>
                    <template v-slot:item.login_details_actions="{ item }">
                      <v-btn fab
                        @click="login_details_deleteItem(item)" text small>
                        <v-icon>
                          mdi-delete
                        </v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:no-data>
                      <v-btn
                        color="primary"
                        @click="initialize"
                      >
                        Reset
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </td>
          </template>
          <template v-slot:item.courses="{ item }">
            <!-- {{ item.courses }} -->
            <span v-if="item.courses != null">
              <span
                v-for="(course, index) in item.courses.split(',')"
                :key="index"
                class="d-flex align-center justify-center flex-column"
              >
                <v-chip
                  x-small
                  class="ma-1"
                  v-if="course != '' && course != null"
                >
                  {{ course }}
                </v-chip>
              </span>
            </span>
          </template>
          <template v-slot:item.image="{ item }">
            <span v-if="item.image">
              <v-img
                :src="item.image"
                lazy-src="https://picsum.photos/10/6"
                :alt="item.name"
                style="width: 50px; height: 50px; cursor: pointer"
                @click.stop="showImage(item.image)"
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
          <template v-slot:item.updated_at="{ item }">
            {{
              new Date(item.updated_at).toLocaleDateString(undefined, {
                weekend: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }}
          </template>
          <!-- <template v-slot:header.name="{ header }">
          {{ header.text.toUpperCase() }}
        </template> -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Students</v-toolbar-title>
              <v-divider class="mx-4 hidden-sm-and-down" inset vertical></v-divider>
              <v-spacer class=""></v-spacer>
              <!-- <v-form ref="form" v-model="valid" @submit.prevent="initialize" style="width:50%"> -->
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search by id, name, email, date... (press enter)"
                  single-line
                  hide-details
                  clearable
                  @click:clear="clearSearchInitialize"
                  class="d-print-none mr-md-10 hidden-sm-and-down d-print-none"
                  required
                  @keyup="myDebounce"
                ></v-text-field>
              <!-- </v-form> -->
              <v-dialog v-model="dialog" max-width="800px" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="error"
                    dark
                    class="mb-2 hidden-sm-and-down"
                    v-bind="attrs"
                    v-on="on"
                    >Add Student
                  </v-btn>
                  <v-btn
                    color="error"
                    dark
                    class="mb-2 hidden-md-and-up"
                    v-bind="attrs"
                    v-on="on"
                    fab
                    small
                    >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <v-card>
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
                        ><v-icon dark> mdi-close </v-icon></v-btn
                      >
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Student Name*"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[
                                (v) => !!v || 'Student name is required',
                              ]"
                              required
                              autofocus="autofocus"
                              prepend-icon="mdi-account"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              name="email"
                              v-model="editedItem.email"
                              :rules="emailRules"
                              label="Student E-mail*"
                              required
                              color="error"
                              @focus="$event.target.select()"
                              prepend-icon="mdi-email"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.login_id"
                              label="Student ID*"
                              @focus="$event.target.select()"
                              clearable
                              :rules="[(v) => !!v || 'User ID is required']"
                              required
                              @blur="checkLogin_id(editItemId, editedItem.login_id)"
                              prepend-icon="mdi-target-account"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              :append-icon="show3 ? 'mdi-eye-off' : 'mdi-eye'"
                              :rules="!isEdit ? [passwordRules.required, passwordRules.min]
                                  : []"
                              :type="show3 ? 'password' : 'text'"
                              label="Login Password*"
                              hint="At least 8 characters"
                              v-model="editedItem.password"
                              @click:append="show3 = !show3"
                              color="error"
                              @focus="$event.target.select()"
                              prepend-icon="mdi-lock"
                              counter="8"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-dialog
                              ref="admissionDateDialog"
                              v-model="admissionModal"
                              :return-value.sync="editedItem.admissionDate"
                              persistent
                              width="290px"
                              :rules="[(v) => !!v || 'Admission date is required']"
                              required
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.admissionDate"
                                  label="Admission Date"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.admissionDate"
                                scrollable
                                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="admissionModal = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.admissionDateDialog.save(editedItem.admissionDate)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-dialog>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.mobile"
                              label="Mobile Number"
                              @focus="$event.target.select()"
                              clearable
                              prepend-icon="mdi-cellphone-basic"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="5">
                            <v-file-input
                              v-model="editedItem.image"
                              :rules="imageRules"
                              accept="image/png, image/jpeg, image/bmp, image/webp"
                              prepend-icon="mdi-camera"
                              label="Student Photo (300 x 300)"
                              chips
                              show-size
                            ></v-file-input>
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
              <v-dialog v-model="dialogDelete" max-width="500px">
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
              </v-dialog>
            </v-toolbar>
            <v-toolbar flat class="hidden-md-and-up ">
              <!-- <v-spacer/> -->
              <!-- <v-form ref="form" v-model="valid" @submit.prevent="initialize" style="width:100%"> -->
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search by id, name, email, date... (press enter)"
                  single-line
                  hide-details
                  clearable
                  @click:clear="clearSearchInitialize"
                  class="d-print-none "
                  required
                  @keyup="myDebounce"
                ></v-text-field>
              <!-- </v-form> -->
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="editItem(item)"
                  color="primary"
                >
                mdi-square-edit-outline
                </v-icon>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class=""
                  v-bind="attrs"
                  v-on="on"
                  @click="studentEnrollmentCoursesDialog(item.id)"
                  color="teal"
                >mdi-school
                </v-icon>
              </template>
              <span>Enrollment Courses</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon right
                @click="deleteItem(item)"
                color="error"
                v-bind="attrs"
                v-on="on"
                v-if="$auth.user.login_id==10082">
                mdi-delete
                </v-icon>
              </template>
              <span>Delete Student</span>
            </v-tooltip>
            <!-- <v-icon right @click="deleteItem(item)" color="error" v-if="$auth.user.login_id==10082"> mdi-delete </v-icon> -->
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="isShowImage"
    >
      <template v-slot:default="dialog">
        <v-card>
          <a :href="deptThumbLink" title="Click to download" download>
            <v-img
              :src="deptThumbLink"
              lazy-src="https://picsum.photos/10/6"
              contain
            ></v-img>
          </a>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false" color="error"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- Student Course Details Section -->
    <section>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="1200"
        v-model="studentCoursesDialog"
        scrollable
      >
        <v-card max-width="1200">
          <v-toolbar
            color="primary"
            dark
          >
            <v-toolbar-title>Enrollment Courses</v-toolbar-title>
            <v-spacer/>
            <v-btn icon>
              <v-icon @click="studentCoursesDialog = false">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :headers="enrollmentHeaders"
              :items="studentEnrollments"
              :search="enrollmentSearch"
              sort-by="id"
              sort-desc
              item-key="id"
              class="my-10"
              :loading="enrollmentTableLoading"
              loading-text="Students are loading..."
              style="font-weight: 600"
            >
              <!-- <template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ header }"> -->
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
              <template v-slot:item.updated_at="{ item }">
                {{
                  new Date(item.updated_at).toLocaleDateString(undefined, {
                    weekend: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                }}
              </template>
              <!-- <template v-slot:header.name="{ header }">
              {{ header.text.toUpperCase() }}
            </template> -->
              <template v-slot:top>
                <v-toolbar flat>
                  <!-- <v-toolbar-title>Courses</v-toolbar-title> -->
                  <!-- <v-spacer class="d-none d-md-block"></v-spacer> -->
                  <v-text-field
                    v-model="enrollmentSearch"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    @focus="$event.target.select()"
                    class="d-print-none mr-10"
                  ></v-text-field>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-dialog v-model="enrollmentDialog" max-width="600px" persistent>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="error"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >Add Course
                      </v-btn>
                    </template>
                    <v-card :loading="courseCardLoading">
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
                        @submit.prevent="enrollmentCourseSave"
                        enctype="multipart/form-data"
                      >
                        <v-card-title>
                          <span class="text-h5">{{ enrollmentFormTitle }} </span>
                          <v-spacer />
                          <v-btn color="error" @click="enrollmentDialogClose" text
                            ><v-icon dark> mdi-close </v-icon></v-btn
                          >
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-select
                                  v-model="enrollmentItem.department_id"
                                  :items="departments"
                                  label="Select Department*"
                                  item-text="name"
                                  item-value="id"
                                  :rules="[(v) => !!v || 'Department is required']"
                                  required
                                  @change="getCoursesByDepartment(enrollmentItem.department_id)"
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6">
                                <v-select
                                  v-model="enrollmentItem.course_id"
                                  :items="courses"
                                  label="Select Course*"
                                  item-text="name"
                                  item-value="id"
                                  :rules="[(v) => !!v || 'Course is required']"
                                  required
                                ></v-select>
                              </v-col>
                              <v-col cols="12">
                                <v-dialog
                                  ref="enrollmentDateDialog"
                                  v-model="enrollmentModal"
                                  :return-value.sync="enrollmentItem.enrollmentDate"
                                  persistent
                                  width="290px"
                                  :rules="[(v) => !!v || 'Enrollment date is required']"
                                  required
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="enrollmentItem.enrollmentDate"
                                      label="Enrollment Date"
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="enrollmentItem.enrollmentDate"
                                    scrollable
                                    :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                  >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      text
                                      color="primary"
                                      @click="enrollmentModal = false"
                                    >
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      text
                                      color="primary"
                                      @click="$refs.enrollmentDateDialog.save(enrollmentItem.enrollmentDate)"
                                    >
                                      OK
                                    </v-btn>
                                  </v-date-picker>
                                </v-dialog>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="error" @click="enrollmentDialogClose">close</v-btn>
                          <v-btn
                            :disabled="!valid"
                            color="primary"
                            type="submit"
                            @click="validate"
                            :loading="enrollmentBtnLoading"
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
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="mr-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="enrollmentEditItem(item)"
                      color="primary"
                    >
                    mdi-square-edit-outline
                    </v-icon>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class=""
                      v-bind="attrs"
                      v-on="on"
                      @click="studentEnrollmentCoursesDialog(item.id)"
                      color="accent"
                    >mdi-school
                    </v-icon>
                  </template>
                  <span>Enrollment Courses</span>
                </v-tooltip> -->
                <!-- <v-icon right @click="deleteItem(item)" color="error" v-if="$auth.user.login_id==10082"> mdi-delete </v-icon> -->
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize"> Reset </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="error"
              text
              @click="studentCoursesDialog = false"
            >Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
    <!-- Student Course Details Section -->
    <v-dialog
      v-model="modalCardLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Categories are loading...
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
import _ from "lodash";
export default {
  name: "super-student-list",
  layout: "super_admin",
  data: () => ({
    modalCardLoading: false,
    courseCardLoading: false,
    isShowImage: false,
    studentCoursesDialog: false,
    admissionModal: false,
    enrollmentModal: false,
    tableLoading: false,
    enrollmentTableLoading: false,
    search: "",
    enrollmentSearch: "",
    btnLoading: false,
    enrollmentBtnLoading: false,
    dialog: false,
    enrollmentDialog: false,
    dialogDelete: false,
    valid: true,
    isEdit: false,
    oldLogin_id: 0,
    student_id: 0,
    show3: false,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    imageRules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Department Thumbnail size should be less than 2 MB!",
    ],
    headers: [
      // {
      //   text: "ID",
      //   align: "start",
      //   sortable: true,
      //   value: "id",
      // },
      { text: "User_ID", value: "login_id" },
      { text: "Name", value: "name" },
      { text: "Admission", value: "admissionDate" },
      { text: "Email", value: "email", sortable: false },
      // { text: "Photo", value: "image" },
      // { text: "Status", value: "status" },
      { text: "Created", value: "created_at" },
      // { text: "Updated", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    LoginDetailsHeaders: [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "login_details_id",
      },
      // { text: "User_ID", value: "login_id" },
      { text: "Login_IP", value: "login_details_system_ip" },
      { text: "System_Name", value: "login_details_system_name" },
      { text: "Browser", value: "login_details_system_browser" },
      { text: "Last_Login", value: "login_details_updated_at" },
      { text: "Actions", value: "login_details_actions", sortable: false },
    ],
    enrollmentHeaders: [
      // {
      //   text: "ID",
      //   align: "start",
      //   sortable: true,
      //   value: "id",
      // },
      { text: "Course", value: "course.name" },
      { text: "Department", value: "department.name" },
      // { text: "Email", value: "email" },
      { text: "Enrolled_on", value: "enrollmentDate" },
      // { text: "Photo", value: "image" },
      // { text: "Status", value: "status" },
      { text: "Created", value: "created_at" },
      // { text: "Updated", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    students: [],
    totalStudent: 0,
    options: {},
    expanded: [],
    singleExpand: true,
    departments: [],
    enrollments: [],
    courses: [],
    studentEnrollments: [],
    editItemId: 0,
    deleteItemId: 0,
    editedIndex: -1,
    enrollmentEditedIndex: -1,
    editedItem: {
      name: "",
      login_id: "",
      password: (Math.random().toString(36).slice(2).substr(2,8)).toUpperCase(),
      email: "",
      mobile: "",
      image: null,
      admissionDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    defaultItem: {
      name: "",
      login_id: "",
      password: (Math.random().toString(36).slice(2).substr(2,8)).toUpperCase(),
      email: "",
      mobile: "",
      image: null,
      admissionDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    enrollmentItem: {
      department_id: "",
      course_id: "",
      enrollmentDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    enrollmentDefaultItem: {
      department_id: "",
      course_id: "",
      enrollmentDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create Student" : "Edit Student";
    },
    enrollmentFormTitle() {
      return this.enrollmentEditedIndex === -1 ? "Add Course" : "Edit Course";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    // Server side Pagination
    options: {
      handler () {
        this.initialize()
      },
      deep: true,
    },
  },

  created() {
  },

  mounted() {
    if(!this.$citCookies.get("auth._token.laravelSanctum")){this.$router.push('/login')}
    // this.initialize();
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    login_details_deleteItem(item)
    {
      this.modalCardLoading = true;
      this.$axios.$delete(this.$cit.citBaseUrl + "/api/delete-student-login-details/" + item.id,
        {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      })
      .then((res) => {
        // console.log(res);
        this.search = "";
        this.initialize();
        this.$store.dispatch("fireSnackbarAction", {
          show: true,
          message: res.success,
          color: "primary",
        });
        this.modalCardLoading = false;
      })
      .catch((error) => {
        if(error.message=="Request failed with status code 401")this.$auth.logout();
        console.log(error);
        this.modalCardLoading = false;
      });
    },
    clearSearchInitialize(){
      this.search = "";
      // console.log("search cleared");
      this.initialize();
    },
    initialize() {
      // console.log("this.search")
      // console.log(this.search)
      // console.log("this.search")
      this.tableLoading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      // console.log(sortBy);
      if(this.search!="" && this.search!=null) {
        // console.log('I am a search');
        let self = this;
        this.$axios.$get(this.$cit.citBaseUrl + "/api/get-students", {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            sortBy: sortBy[0],
            sortDesc: sortDesc[0],
            page: page,
            itemsPerPage: itemsPerPage,
            searchBy: self.search
          },
        })
        .then((res) => {
          // console.log(res);
          this.students = res.students.data;
          this.totalStudent = res.students.total;
          this.departments = res.departments;
          this.tableLoading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.tableLoading = false;
        });
      }else{
        // console.log("Not in search");
        this.$axios.$get(this.$cit.citBaseUrl + "/api/get-students", {
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            sortBy: sortBy[0],
            sortDesc: sortDesc[0],
            page: page,
            itemsPerPage: itemsPerPage,
          },
        })
        .then((res) => {
          // console.log(res);
          this.students = res.students.data;
          this.totalStudent = res.students.total;
          this.departments = res.departments;
          this.tableLoading = false;
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.tableLoading = false;
        });
      }

    },

    editItem(item) {
      this.oldLogin_id = item.login_id;
      this.editItemId = item.id;
      this.editedIndex = this.students.indexOf(item);
      item.image = null;
      item.password = "";
      this.isEdit = true;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    enrollmentEditItem(item) {
      // console.log(item);
      this.enrollmentEditItemId = item.id;
      this.student_id = item.student_id;
      // console.log(this.enrollmentEditItemId);
      this.enrollmentEditedIndex = this.studentEnrollments.indexOf(item);
      this.getCoursesByDepartment(item.department_id);
      this.enrollmentItem = Object.assign({}, item);
      this.enrollmentDialog = true;
    },

    deleteItem(item) {
      if(this.$auth.user.login_id=="10082"){
        this.deleteItemId = item.id;
        this.editedIndex = this.students.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.isEdit = false;
        this.dialogDelete = true;
      }
    },

    deleteItemConfirm() {
      this.btnLoading = true;
      this.$axios.$delete(this.$cit.citBaseUrl + "/api/delete-student/" + this.deleteItemId,
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
          this.students = res.getAllStudent;
          this.$store.dispatch("fireSnackbarAction", {
            show: true,
            message: res.success,
            color: "primary",
          });
          this.btnLoading = false;
          this.closeDelete();
        })
        .catch((error) => {
          if(error.message=="Request failed with status code 401")this.$auth.logout();
          console.log(error);
          this.btnLoading = false;
          this.closeDelete();
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.isEdit = false;
      this.initialize();
    },
    enrollmentDialogClose() {
      this.enrollmentDialog = false;
      this.$nextTick(() => {
        this.enrollmentItem = Object.assign({}, this.enrollmentDefaultItem);
        this.enrollmentEditedIndex = -1;
      });
      this.enrollmentIsEdit = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.isEdit = false;
      this.$nuxt.refresh();
    },
    checkLogin_id(editItemId, login_id) {
      if (this.editedIndex > -1) {
        if (login_id != "") {
          // console.log(-1);
          this.$axios.$get(this.$cit.citBaseUrl + "/api/check-student-Login_id/" + login_id+"?idCheckInEditMode="+editItemId,
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
              if (res.userFound) {
                this.editedItem.login_id = this.oldLogin_id;
                this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.userFound,
                  color: "error",
                });
              }
            })
            .catch((error) => {
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              console.log(error);
            });
        }
      } else {
        if (login_id != "") {
          // console.log("else");
          this.$axios.$get(this.$cit.citBaseUrl + "/api/check-student-Login_id/" + login_id,
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
              if (res.userFound) {
                this.editedItem.login_id = "";
                this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.userFound,
                  color: "error",
                });
              }
            })
            .catch((error) => {
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              console.log(error);
            });
        }
      }
    },
    getCoursesByDepartment(department_id)
    {
      this.courseCardLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + "/api/courses/" + department_id,
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
        // console.log(res.courses);
        this.courses = res.courses;
        this.courseCardLoading = false;
      })
      .catch((error) => {
        if(error.message=="Request failed with status code 401")this.$auth.logout();
        console.log(error);
        this.courseCardLoading = false;
      });
    },
    studentEnrollmentCoursesDialog(id){
      // console.log("-------------------------------");
      this.studentEnrollments = [];
      this.student_id = id;
      this.studentCoursesDialog= true;
      this.enrollmentTableLoading = true;
      this.$axios.$get(this.$cit.citBaseUrl + "/api/enrollments/"+this.student_id,
      {
        withCredentials: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log("resThen");
        // console.log(res);
        // console.log("resThen");
        this.studentEnrollments = res.studentEnrollments;
        this.enrollmentTableLoading= false;
      })
      .catch((error) => {
        if(error.message=="Request failed with status code 401")this.$auth.logout();
        // console.log("errorCatch");
        // console.log(error);
        // console.log("errorCatch");
        this.$store.dispatch("fireSnackbarAction", {
          show: true,
          message: error,
          color: "error",
        });
        this.isEdit = false;
        this.enrollmentTableLoading = false;
        // this.enrollmentDialogClose();
        });
    },
    save() {
      if (this.editedIndex > -1) {
        if(this.$auth.user.auth_id == 3){
          this.btnLoading = true;
          let formData = new FormData();
          formData.append("name", this.editedItem.name);
          formData.append("login_id", this.editedItem.login_id);
          formData.append("password", this.editedItem.password);
          formData.append("email", this.editedItem.email);
          formData.append("admissionDate", this.editedItem.admissionDate);
          formData.append("mobile", this.editedItem.mobile);
          formData.append("image", this.editedItem.image);
          formData.append("auth_id", 3);
          formData.append("_method", "PATCH");
          this.$axios.$post(this.$cit.citBaseUrl + "/api/update-student/" + this.editItemId,formData,
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
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: res.success,
              color: "primary",
            });
            // this.students = res.getAllStudent;
            // this.$store.dispatch("fireStudents", this.students);
            this.isEdit = false;
            this.btnLoading = false;
            this.close();
            this.initialize();
          })
          .catch((error) => {
            console.log(error);
            if(error.message=="Request failed with status code 401")this.$auth.logout();
            this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: error,
              color: "error",
            });
            this.editedItem = Object.assign({}, this.defaultItem);
            this.isEdit = false;
            this.close();
            this.btnLoading = false;
          });
        }else{
          this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: "Only Super Admin can create Students",
              color: "error",
          })
        }
      } else {
        if(this.$auth.user.auth_id == 3){
          // console.log(this.editedItem);
          // return;
          this.btnLoading = true;
          let formData = new FormData();
          formData.append("name", this.editedItem.name);
          formData.append("login_id", this.editedItem.login_id);
          formData.append("password", this.editedItem.password);
          formData.append("email", this.editedItem.email);
          formData.append("admissionDate", this.editedItem.admissionDate);
          formData.append("mobile", this.editedItem.mobile);
          formData.append("image", this.editedItem.image);
          formData.append("auth_id", 1);
          this.$axios.$post(this.$cit.citBaseUrl + "/api/create-student", formData, {
              withCredentials: true,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then((res) => {
              console.log("resThen");
              console.log(res);
              console.log("resThen");
              this.btnLoading = false;
              if(res.email||res.name||res.login_id||res.password||res.auth_id){
                  this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res,
                  color: "error",
                });
              }
              if(res.error){
                  this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.error ? res.error : res.success,
                  color: res.error ? "error" : "primary",
                });
              }
              if(res.success){
                  this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.error ? res.error : res.success,
                  color: res.error ? "error" : "primary",
                });
              }
              // this.students = res.getAllStudent;
              // this.$store.dispatch("fireStudents", this.students);
              this.isEdit = false;
              this.btnLoading = false;
              if(res.success){
                this.close();
              }
              this.initialize();
            })
            .catch((error) => {
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              console.log("errorCatch");
              console.log(error.message);
              console.log("errorCatch");
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: error,
                color: "error",
              });
              this.isEdit = false;
              this.btnLoading = false;
              // this.close();
            });
        }else{
          this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: "Only Super Admin can create Students",
              color: "error",
          });
        }
      }
    },
    enrollmentCourseSave() {
      if (this.enrollmentEditedIndex > -1) {
        // console.log(this.enrollmentItem);
        // console.log("-1");
        // return;
        this.enrollmentBtnLoading = true;
        if(this.$auth.user.auth_id == 3){
          let formData = new FormData();
          formData.append("department_id", this.enrollmentItem.department_id);
          formData.append("course_id", this.enrollmentItem.course_id);
          formData.append("enrollmentDate", this.enrollmentItem.enrollmentDate);
          formData.append("student_id", this.student_id);
          formData.append("_method", "PATCH");
          this.$axios.$post(this.$cit.citBaseUrl + "/api/enrollments/" + this.enrollmentEditItemId,formData,
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
              // return;
              if(res.error){
                this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.error,
                  color: "error",
                });
                this.enrollmentBtnLoading = false;
                return;
              }
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res.error ? res.error : res.success,
                color: res.error ? "error" : "primary",
              });
              this.studentEnrollments = res.studentEnrollments;
              this.enrollmentBtnLoading = false;
              this.enrollmentDialogClose();
            })
            .catch((error) => {
              console.log(error);
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: error,
                color: "error",
              });
              this.enrollmentBtnLoading = false;
              this.enrollmentDialogClose();
            });
        }
      } else {
        if(this.$auth.user.auth_id == 3){
          // console.log(this.editedItem);
          // return;
          this.enrollmentBtnLoading = true;
          let formData = new FormData();
          formData.append("department_id", this.enrollmentItem.department_id);
          formData.append("course_id", this.enrollmentItem.course_id);
          formData.append("enrollmentDate", this.enrollmentItem.enrollmentDate);
          formData.append("student_id", this.student_id);
          this.$axios.$post(this.$cit.citBaseUrl + "/api/enrollments", formData, {
              withCredentials: true,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then((res) => {
              // console.log("resThen");
              // console.log(res);
              // console.log("resThen");
              if(res.error){
                this.$store.dispatch("fireSnackbarAction", {
                  show: true,
                  message: res.error,
                  color: "error",
                });
                this.enrollmentBtnLoading = false;
                return;
              }
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: res.error ? res.error : res.success,
                color: res.error ? "error" : "primary",
              });
              this.studentEnrollments = res.studentEnrollments;
              this.enrollmentBtnLoading = false;
              this.enrollmentDialogClose();
            })
            .catch((error) => {
              if(error.message=="Request failed with status code 401")this.$auth.logout();
              // console.log("errorCatch");
              // console.log(error);
              // console.log("errorCatch");
              this.$store.dispatch("fireSnackbarAction", {
                show: true,
                message: error,
                color: "error",
              });
              this.isEdit = false;
              this.enrollmentBtnLoading = false;
              // this.enrollmentDialogClose();
            });
        }else{
          this.$store.dispatch("fireSnackbarAction", {
              show: true,
              message: "Only Super Admin can create Students",
              color: "error",
          });
        }
      }
    },
    showImage(link) {
      this.deptThumbLink = link;
      this.isShowImage = true;
    },
    myDebounce: _.debounce(function() {
      this.initialize();
    }, 1000)
  },
};
</script>

<style scoped>
</style>