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
        evt.stopImmediatePropagation();

        let el = evt.target.parentElement,
            link = el.getAttribute('data-goto'),
            article = document.querySelector(`[data-menu-target=${link}]`);

        ToggleMenu.call(_navMenu);
        app.scroll.to(article);
    }

    /**
     * Initialize events
     */
    (function(){
        _navMenu.addEventListener('click', ToggleMenu);
        _menu.addEventListener("click", onClickMenuOption);
    })();
})();