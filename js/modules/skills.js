(function(global){
    "use strict";
    
    var app = app || {};

    app.skills = (function(){
        const STYLE_ANIMATION = "width 1s .250s ease-out",
            HOVER_INTENT_DELAY = 350;

        var skills = document.getElementsByClassName('skill'),
            timeoutIn = null;
        
        /**
        *   Shows the level of each skill with an animation
        */
        function _animeLevel() {
            for (let item of skills) {
                var level = item.querySelector('.percentage');
                if (global.isOnScreen.call(item)) {
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

                var logo = self.getElementsByTagName('img')[0];
                if (logo !== undefined) details.appendChild(logo.cloneNode(true));

                function setHeight(height) {
                    setTimeout(function () {
                        details.style.height = height + 'px'
                        self.classList.add('is-detailed');
                    }, 50)
                }
                _getDetailsContainerHeight(details, setHeight);
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
        }


        /**
        *   Return the height of the container to prepare it for the animation
        *   @param {object} container: Skill details container
        *   @param {function} callback: Function to execute after calculate the height 
        *   @return {number} Value of the details container height
        */
        var _getDetailsContainerHeight = function (container, callback) {
            container.style.height = 'auto';
            var height = container.offsetHeight;
            container.style.height = 0;
            if (callback !== undefined && callback !== null && typeof callback === 'function') {
                callback(height);
            }
            return height;
        }

        /**
         * Initialize in case the skills are visible when the page is refreshed
         */
        function _init() {
            _animeLevel();
            global.addEventToScroll(_animeLevel);
        };
        _init();

        // Skill elements
        // Array.prototype.forEach.call(skills, function (item) {
        //     var container = item.parentElement;
        //     container.addEventListener('mouseenter', _showDetails);
        //     container.addEventListener('mouseleave', _hideDetails);
        // });

        return {
            animeLevel: _animeLevel,
            details: {
                show: _showDetails,
                hide: _hideDetails
            }
        }
    })();
})(window);
