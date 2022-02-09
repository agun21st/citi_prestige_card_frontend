export const strict = false;

export const state = () => ({
    snackbar: {
        show: false,
        color: "cyan",
        message: "Your Job Successfully Done!"
    },
    pagination: {
        pageNumber: 1,
        pageLength: 1
    },
    admins: [],
    students: [],
    user_department: [],
    departments: [],
    courses: [],
    categories: [],
    brands: [],
    tools: [],
    noDataFound: false,
    toolsOrigin: "",
    myFirstCourse: "",
    mySecondCourse: "",
    totalCourses: 0,
    fixedCourses: [],
    searchItems: [],
    fiveCategoryItems: [],
    moreCategories: [],
    pagination: {
        per_page: 0,
        toolsPagination: 1,
        toolsTotal: 0
    }
});

export const mutations = {
    updateSearchItems(state, payload) {
        // state.searchItems = [];
        state.searchItems = payload;
    },
    user_department(state, payload) {
        // state.searchItems = [];
        state.user_department = payload;
    },
    updateFiveCategoryItems(state, payload) {
        // state.fiveCategoryItems = [];
        state.fiveCategoryItems = payload;
    },
    updateMoreCategories(state, payload) {
        // state.moreCategories = [];
        state.moreCategories = payload;
    },
    updatePagination(state, payload) {
        state.pagination.per_page = payload.per_page;
        state.pagination.toolsPagination = payload.toolsPagination;
        state.pagination.toolsTotal = payload.toolsTotal;
    },
    updateSnackbar(state, payload) {
        state.snackbar.show = payload.show;
        state.snackbar.color = payload.color;
        state.snackbar.message = payload.message;
    },
    updateAdmins(state, payload) {
        // state.admins = [];
        state.admins = payload;
    },
    updateStudents(state, payload) {
        // state.students = [];
        state.students = payload;
    },
    updateDepartments(state, payload) {
        // state.departments = [];
        state.departments = payload;
    },
    updateCourses(state, payload) {
        // state.Courses = [];
        state.courses = payload;
    },
    updateCategories(state, payload) {
        // state.categories = [];
        state.categories = payload;
    },
    updateBrands(state, payload) {
        // state.brands = [];
        state.brands = payload;
    },
    updateTools(state, payload) {
        // state.tools = [];
        state.tools = payload;
    },
    updateDataNotFound(state, payload) {
        // state.noDataFound = false;
        state.noDataFound = payload;
    },
    updateToolsOrigin(state, payload) {
        // state.toolsOrigin = "";
        state.toolsOrigin = payload;
    },
    updateMyFirstCourse(state, payload) {
        // state.myFirstCourse = "";
        state.myFirstCourse = payload;
    },
    updateMySecondCourse(state, payload) {
        // state.mySecondCourse = "";
        state.mySecondCourse = payload;
    },
    updateFixedCourses(state, payload) {
        // state.fixedCourses = [];
        state.fixedCourses = payload;
    },
    updateTotalCourses(state, payload) {
        // state.totalCourses = "";
        state.totalCourses = payload;
    }
};
export const actions = {
    fireToolsPagination({ commit }, payload) {
        commit("updatePagination", payload);
    },
    user_department({ commit }, payload) {
        commit("user_department", payload);
    },
    fireToolsTotal({ commit }, payload) {
        commit("updateToolsTotal", payload);
    },
    fireSearchItems({ commit }, payload) {
        commit("updateSearchItems", payload);
    },
    fireFiveCategoryItems({ commit }, payload) {
        commit("updateFiveCategoryItems", payload);
    },
    fireMoreCategories({ commit }, payload) {
        commit("updateMoreCategories", payload);
    },
    fireSnackbarAction({ commit }, payload) {
        commit("updateSnackbar", payload);
    },
    fireAdmins({ commit }, payload) {
        commit("updateAdmins", payload);
    },
    fireStudents({ commit }, payload) {
        commit("updateStudents", payload);
    },
    fireDepartments({ commit }, payload) {
        commit("updateDepartments", payload);
    },
    fireCourses({ commit }, payload) {
        commit("updateCourses", payload);
    },
    fireCategories({ commit }, payload) {
        commit("updateCategories", payload);
    },
    fireBrands({ commit }, payload) {
        commit("updateBrands", payload);
    },
    fireTools({ commit }, payload) {
        commit("updateTools", payload);
    },
    fireDataNotFound({ commit }, payload) {
        commit("updateDataNotFound", payload);
    },
    fireToolsOrigin({ commit }, payload) {
        commit("updateToolsOrigin", payload);
    },
    fireMyFirstCourse({ commit }, payload) {
        commit("updateMyFirstCourse", payload);
    },
    fireMySecondCourse({ commit }, payload) {
        commit("updateMySecondCourse", payload);
    },
    fireFixedCourses({ commit }, payload) {
        commit("updateFixedCourses", payload);
    },
    fireTotalCourses({ commit }, payload) {
        commit("updateTotalCourses", payload);
    }
};
export const getters = {};
export const modules = {};