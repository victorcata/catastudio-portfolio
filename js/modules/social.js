(function (global) {
    "use strict";

    var app = app || {};

    app.social = (function () {
        const MARGIN_CHANGE = 50;

        var _links = document.getElementById('rrss'),
            navTop = document.getElementById('nav-top');

        /**
        *   Controls the visibility of the scroll to top button
        */
        var _ScrollTopVisibility = function() {
            if (navTop == undefined) return;

            (ScrollTop() == 0) ? navTop.classList.add('is-hidden') : navTop.classList.remove('is-hidden');
        }

        /**
         * Checks if the social icons are on top of the footer
         * @return {bool} True is the icons are on top of the footer
         */
        var _isOnFooter = function () {
            var fullHeight = global.ScrollTop() + document.body.offsetHeight;

            return global.ScrollTop() >= 0 && fullHeight + MARGIN_CHANGE < document.body.scrollHeight;
        }

        /**
        *   Controls the visibility of the social media buttons
        */
        var _SocialMediaVisibility = function() {
            (_isOnFooter()) ? _links.classList.add('is-floating') : _links.classList.remove('is-floating');
        }

        global.addEventToScroll(_SocialMediaVisibility, _ScrollTopVisibility);
    })();
})(window);