export default async function ({ store, $auth, redirect, route }) {
    // If the user is not authenticated
    if (!$auth.loggedIn) {
        store.dispatch('fireSnackbarAction', {
            color: "error",
            message: `You must be logged in to view ${route.path} page`,
            show: true,
        });
        return redirect(`/login`)
    }
}