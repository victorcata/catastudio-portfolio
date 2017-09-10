var app = app || {};

(function (global) {
    "use strict";

    var cbOnScroll = [];

    /**
    *   Gets the scroll top position compatibility with IE
    *   @return {int} Scroll Top value
    */
    global.ScrollTop = function () {
        return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    }

    /**
     * Add event to scroll
     * @param {function} callback Function to execute when the user scrolls
     */
    global.addEventToScroll = function (...callback) {
        for(var cb of callback) {
            if (cb !== undefined && typeof cb === "function") {
                cbOnScroll.push(cb);
            }
        }
    }

    /**
     * Sets a cookie 
     * @param {string} cname Name of the cookie
     * @param {string} cname Value of the cookie
     * @param {number} cname Number of days before expiration
     */
    global.setCookie = function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     * Gest a cookie by name
     * @param {string} cname Name of the cookie
     */
    global.getCookie = function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /**
     * OnScroll event
     */
    global.onscroll = function () {
        for (let i = 0; i < cbOnScroll.length; i++) {
            cbOnScroll[i]();
        }
    }

    /**
    *   Resolve if an element is visible on the viewport
    *   @return {boolean} True if it's visible
    */
    global.isOnScreen = function () {
        var coords = getCoords.call(this);
        if (coords.top < ScrollTop()) return;
        if (coords.top > ScrollTop() && coords.top < (ScrollTop() + window.innerHeight + 100)) return true;
        return false;
    };

    /**
    *   Return the coordinates top and left of an element
    *   @return {object} top and left coordinates
    */
    var getCoords = function () {
        var box = this.getBoundingClientRect(),
            body = document.body,
            docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop + 40;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }
})(window);