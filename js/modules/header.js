(function(global) {
    /**
     *   Controls the visibility of the header
     */
    var _controlsHeaderVisibility = function() {
        let header = document.getElementsByClassName("layout-header")[0],
            title = document.getElementsByClassName("title")[0];

        if (ScrollTop() > 0) {
            header.classList.add('is-fixed');
            if (title !== undefined) title.classList.add("is-fixed");
        } else {
            header.classList.remove('is-fixed');
            if (title !== undefined) title.classList.remove("is-fixed");
        }
    }

    global.addEventToScroll(_controlsHeaderVisibility);
})(window);