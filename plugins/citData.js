export default function(context, inject) {

    const citBaseUrl = "http://localhost:8000";
    // const citBaseUrl = "https://prestigecard.creativeitinstitute.com";

    inject("cit", {
        citBaseUrl,
    });

}