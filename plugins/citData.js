export default function(context, inject) {

    const citBaseUrl = "http://localhost:8000";
    // const citBaseUrl = "https://api.cit.tools";

    inject("cit", {
        citBaseUrl,
    });

}