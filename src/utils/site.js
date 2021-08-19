export default {

    pathToURL(path) {
        var base = process.env.BASE_URL;
        if(base == undefined || base == "" || base == "/")
            base = window.location.origin;
        return new URL(path, base).toString();
    }

};