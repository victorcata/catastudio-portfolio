var app = app || {};

(function(global) {
    "use strict";

    var cbOnScroll = [];

    /**
    *   Gets the scroll top position compatibility with IE
    *   @return {int} Scroll Top value
    */
    global.ScrollTop = function() {
        return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    }

    /**
     * Add event to scroll
     * @param {function} callback Function to execute when the user scrolls
     */
    global.addEventToScroll = function(callback) {
        if (callback !== undefined && typeof callback === "function") {
            cbOnScroll.push(callback);
        }
    }

    /**
     * OnScroll event
     */
    global.onscroll = function() {
        for(let i = 0; i < cbOnScroll.length; i++) {
            cbOnScroll[i]();
        }
    }

    /**
    *   Resolve if an element is visible on the viewport
    *   @return {boolean} True if it's visible
    */
    Object.prototype.isOnScreen = function () {
        var coords = this.getCoords();
        if (coords.top < ScrollTop()) return;
        if (coords.top > ScrollTop() && coords.top < (ScrollTop() + window.innerHeight + 100)) return true;
        return false;
    };

    /**
    *   Return the coordinates top and left of an element
    *   @return {object} top and left coordinates
    */
    Object.prototype.getCoords = function () {
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