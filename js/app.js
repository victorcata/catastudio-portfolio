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
(function(global){
    "use strict";
    
    var app = global.app || {};

    app.scroll = (function(){
        const SCROLL_INTERVAL = 10,
              SCROLL_MOVE = 100;
    
        /**
        *   Scroll the page to a determinated position
        *   @param {object} to: Element where to scroll
        */
        function _scrollPageTo(to) {
            if (to === undefined || to === null) return;

            let top = to.offsetTop;

            intervalScrolling = setInterval(function() {
                if (isNaN(to)) {
                    // Scroll to an element
                    if (top < ScrollTop()) {
                        let value = ScrollTop() - SCROLL_MOVE;
                        _setScrollTop(value);
                        if (ScrollTop() <= top) {
                            _setScrollTop(top);
                            clearInterval(intervalScrolling);
                        }
                    } else {
                        let value = ScrollTop() + SCROLL_MOVE;
                        _setScrollTop(value);
                        if (ScrollTop() >= top) {
                            _setScrollTop(top);
                            clearInterval(intervalScrolling);
                        }
                    }
                } else {
                    // Scroll to the top
                    let value = ScrollTop() - SCROLL_MOVE;
                    _setScrollTop(value);
                    if (ScrollTop() <= 0) clearInterval(intervalScrolling);
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

        return {
            to: _scrollPageTo,
            top: _scrollToTop
        }
    })();
})(window);
(function(global){
    "use strict";
    
    var app = global.app || {};

    /**
     * Menu
     */
    app.menu = (function() {
        const DELAY_SHOW = 50,
            DELAY_HIDE = 300;

        let _header = document.getElementsByClassName("layout-header")[0],
            _el = _header.getElementsByClassName("menu")[0],
            _list = _el.children[0];

        /**
         * Shows menu in mobile version
         */
        function _show() {
            _list.style.display = 'block';
            _header.classList.add('is-menuopen');

            let prevHeight = _el.offsetHeight;
            _list.style.height = 0;
            setTimeout(function () {
                _list.style.height = prevHeight + 'px';
            }, DELAY_SHOW);
        }

        /**
         * Hides menu in mobile version
         */
        function _hide() {
            _list.style.height = 0;
            setTimeout(function () {
                _list.removeAttribute('style');
                _header.classList.remove('is-menuopen');
            }, DELAY_HIDE);
        }

        return {
            show: _show,
            hide: _hide
        }
    })();
})(window);

(function(){
    "use strict";

    let _navMenu = document.getElementById('nav-toggle'),
        _menu = document.querySelector('.menu');

    /**
    *   Shows or hides the navigation menu on mobile resolutions
    */
    function ToggleMenu() {
        if (this.offsetParent === null) return;
        (_menu.children[0].style.display === "block") ? app.menu.hide() : app.menu.show();
    }

    /**
    *   Scroll to the container position
    */
    function onClickMenuOption(evt) {
        let el = evt.target.parentElement,
            link = el.getAttribute('data-goto'),
            article = document.querySelector(link);

        ToggleMenu.call(_navMenu);
        app.scroll.to(article);

        evt.stopImmediatePropagation();
    }

    /**
     * Initialize events
     */
    (function(){
        _navMenu.addEventListener('click', ToggleMenu);
        _menu.addEventListener("click", onClickMenuOption);
    })();
})();
(function(global){
    "use strict";
    
    var app = app || {};

    app.skills = (function(){
        const STYLE_ANIMATION = "width 1s .250s ease-out";

        var skills = document.getElementsByClassName('skill');
        
        /**
        *   Shows the level of each skill with an animation
        */
        function _animeLevel() {
            for (let item of skills) {
                var level = item.querySelector('.percentage');
                if (item.isOnScreen()) {
                    level.style.width = level.getAttribute('data-level') + '%';
                    level.style.transition = STYLE_ANIMATION;
                }
                else {
                    level.removeAttribute('style');
                }
            }
        };

        /**
        * Shows the details of a skill
        */
        function _showDetails() {
            var self = this;

            timeoutIn = setTimeout(function () {
                timeoutIn = null;

                var details = self.querySelector('.skill-extra');
                if (details === null) return;

                _highLightSunburst(self.querySelector('.skill').getAttribute('data-skill'));

                var logo = self.getElementsByTagName('img')[0];
                if (logo !== undefined) details.appendChild(logo.cloneNode(true));

                function setHeight(height) {
                    setTimeout(function () {
                        details.style.height = height + 'px'
                        self.classList.add('is-detailed');
                    }, 50)
                }
                getDetailsContainerHeight(details, setHeight);
            }, HOVER_INTENT_DELAY);
        }

        /**
        *   Hide the details of the skill
        */
        function _hideDetails() {
            var details = this.querySelector('.skill-extra');
            if (details === null) return;

            if (timeoutIn !== null) {
                clearTimeout(timeoutIn);
                this.removeAttribute('class');
                details.removeAttribute('style');
                return;
            }

            var img = details.getElementsByTagName('img')[0];
            if (img !== undefined) img.parentNode.removeChild(img);

            this.removeAttribute('class');
            details.removeAttribute('style');

            _removeHighLightSunburst(this.querySelector('.skill').getAttribute('data-skill'));
        }

        /**
         * Initialize in case the skills are visible when the page is refreshed
         */
        function _init(){
            _animeLevel();
            global.addEventToScroll(_animeLevel);
        }

        _init();

        return {
            animeLevel: _animeLevel,
            details: {
                show: _showDetails,
                hide: _hideDetails
            }
        }
    })();
})(window);
