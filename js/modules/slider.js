var app = app || {};

/**
 * Slider
 */
(function (d) {
    app.slider = (function () {
        let _delay = 5000,
            _els = d.getElementsByClassName('slider'),
            _sliders = [];

        /**
         * Moves the slider to the next slide
         * @param {object} item UI Slider container
         */
        function _nextSlide(item) {
            let active = item.querySelector(".slider-slide.is-active"),
                next = active.nextElementSibling;

            // If it's the last one starts again
            if (next === null) {
                next = item.querySelector(".slider-slide:first-child");
            }

            _animate(active, next);
            _updatePagsBullets(item);
        }

        /**
         * Animates the actual and next slides
         * @param {object} actual Active slide
         * @param {object} next Next slide or the first one it the actual is the last one
         */
        function _animate(actual, next) {
            next.classList.add("to-show");
            setTimeout(function () {
                actual.classList.add("to-left");
                next.classList.add("to-show-anime");
            }, 100);

            setTimeout(function () {
                next.classList.add("is-active");
                next.classList.remove("to-show", "to-show-anime");
                actual.classList.remove("is-active", "to-left");
            }, 1000);
        }

        /**
         * Updates the bullet page active
         * @param {object} item UI Slider container
         */
        function _updatePagsBullets(item) {
            var active = item.querySelector(".slider-pags .is-active"),
                next = active.nextElementSibling;

            // If it's the last one starts again
            if (next === null) {
                next = item.querySelector(".slider-pags li:first-child");
            }

            active.classList.remove("is-active");
            next.classList.add("is-active");
        }

        /**
         * Starts the interval to animate the slider
         * @param {object} item UI Slider container
         */
        function _initSlider(item) {
            let delay = parseInt(item.getAttribute("data-delay"));
            setInterval(function () {
                _nextSlide(item);
            }, delay);
        }

        /**
         * Initializes every slider on the page
         */
        function _init() {
            for (let i = 0; i < _els.length; i++) {
                if (_els[i].getElementsByClassName("slider-slide").length > 1) {
                    _initSlider(_els[i]);
                }
            }
        }

        /**
         * Initializes a specific module
         */
        function _initModule(module) {
            if (module.getElementsByClassName("slider-slide").length > 1) {
                _initSlider(module);
            }
        }

        _init();
        return {
            init: _init,
            start: _initModule
        }
    })();
})(document);