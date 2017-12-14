function motionjpeg(id) {
    var image = $(id), src;

    if (!image.length) return;

    src = image.attr("src");
    if (src.indexOf("?") < 0) {
        image.attr("src", src + "?");
    }

    image.on("load", function() {
        this.src = this.src.replace(/\?[^\n]*$/, "?") +
            (new Date()).getTime(); 
    });
}