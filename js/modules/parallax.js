(function (global) {
    const SPEED_PARALLAX = 100;

    var _itemsParallax = document.querySelectorAll('[data-parallax-y]')


    /**
    *   Controls the parallax movement of the layers
    */
    var _parallax = function() {
        let scrollTop = global.ScrollTop();

        Array.prototype.forEach.call(_itemsParallax, function (item) {
            // Parameters
            var motionY = item.getAttribute('data-parallax-y') * SPEED_PARALLAX,
                motionX = item.getAttribute('data-parallax-x') * SPEED_PARALLAX;

            // Movement
            var x = (scrollTop / SPEED_PARALLAX * motionX).toFixed(2) + 'px';
            var y = (scrollTop / SPEED_PARALLAX * motionY).toFixed(2) + 'px';

            // Transformation
            item.style.transform = 'translate3d(' + x + ', ' + y + ', ' + 0 + ')';
        });
    };

    global.addEventToScroll(_parallax);
})(window);