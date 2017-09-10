(function(global){
    "use strict";
    
    var app = global.app || {};

    app.scroll = (function(){
        const SCROLL_INTERVAL = 10,
              SCROLL_MOVE = 100;

        var intervalScrolling = null;
    
        function _maxScroll() {
            var body = document.body,
                html = document.documentElement;

            var isHeaderFixed = document.querySelector('.layout-header.is-fixed') !== null;

            return Math.max(isHeaderFixed ? body.scrollHeight : body.scrollHeight - 53, body.offsetHeight, html.clientHeight, isHeaderFixed ? html.scrollHeight : html.scrollHeight - 53, html.offsetHeight ) - document.body.offsetHeight;
        }
        /**
        *   Scroll the page to a determinated position
        *   @param {object} to: Element where to scroll
        */
        function _scrollPageTo(to) {
            if (to === undefined || to === null) return;

            let top = to.offsetTop,
                max = _maxScroll();

            if (top > max) top = max;

            intervalScrolling = setInterval(function() {
                if (isNaN(to)) {
                    // Scroll to an element
                    if (top < global.ScrollTop()) {
                        let value = global.ScrollTop() - SCROLL_MOVE;
                        _setScrollTop(value);
                        if (global.ScrollTop() <= top) {
                            _setScrollTop(top);
                            clearInterval(intervalScrolling);
                        }
                    } else {
                        let value = global.ScrollTop() + SCROLL_MOVE;
                        _setScrollTop(value);
                        if (global.ScrollTop() >= top) {
                            _setScrollTop(top);
                            clearInterval(intervalScrolling);
                        }
                    }
                } else {
                    // Scroll to the top
                    let value = global.ScrollTop() - SCROLL_MOVE;
                    _setScrollTop(value);
                    if (global.ScrollTop() <= 0) clearInterval(intervalScrolling);
                }
            }, SCROLL_INTERVAL);
        }

        /**
        *   Animate the scroll to the top of the window
        */
        function _scrollToTop() {
            _scrollPageTo(0);
        };
        
        /**
        *   Sets the scroll top position compatibility with IE
        *   @param {int} value: Scroll Top value
        */
        function _setScrollTop(value) {
            if (window.navigator.userAgent.indexOf('MSIE') > 0) {
                document.documentElement.scrollTop = value;
                return document.documentElement.scrollTop;
            } else {
                document.body.scrollTop = value;
                return document.body.scrollTop;
            }
        }

        /**
         * Navigates to top button
         */
        (function () {
            document.getElementById("nav-top").addEventListener('click', _scrollToTop);
        })();

        return {
            to: _scrollPageTo,
            top: _scrollToTop
        }
    })();
})(window);