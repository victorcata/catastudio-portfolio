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
            // 09-10-17: Suddenly work document.body.scrollTop doesn't on Chrome
            var prev = document.documentElement.scrollTop;
            document.documentElement.scrollTop = value;
            
            // Nothing happen
            if (document.documentElement.scrollTop === prev) {
                document.body.scrollTop = value;
                return document.body.scrollTop;
            }

            return document.documentElement.scrollTop;

            // if (window.navigator.userAgent.indexOf('MSIE') > 0) {
            //     document.documentElement.scrollTop = value;
            //     return document.documentElement.scrollTop;
            // } else {
            //     document.body.scrollTop = value;
            //     return document.body.scrollTop;
            // }
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
    _controlsHeaderVisibility();
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
(function () {
    "use strict";

    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          EMAILJS_SERVICE_ID = "default_service",
          EMAILJS_TEMPLATE_ID = "template_LYoOpR50",
          SENDING_SUCCESS = "Message sended",
          SENDING_ERROR = "Sorry, there was a problem. Try contacting by Linkedin, Thanks!"

    emailjs.init("user_IkbBM8PiQ7SFBY6gIdoZA");

    /**
    *   Validate the fields of the form
    *   @return {boolean} True if every fields is filled right
    */
    var _validateFields = function () {
        var name = document.getElementById('name'),
            email = document.getElementById('email'),
            comments = document.getElementById('comments'),
            emailRegex = EMAIL_REGEX,
            isValid = true;

        if (name.value === '') {
            name.classList.add('is-error');
            isValid = false;
        }
        if (email.value === '' || !emailRegex.test(email.value)) {
            email.classList.add('is-error');
            isValid = false;
        }
        if (comments.value === '') {
            comments.classList.add('is-error');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Clears the error styles
     */
    var _clearFieldError = function () {
        this.classList.remove('is-error');
    }

    /**
    *   Append a message with the result of sending the email
    *   @param {boolean} success: True if the message was send it
    */
    var _responseMessage = function (success) {
        var container = document.createElement('div'),
            msg = document.createElement('p');

        container.classList.add('contact-result');
        success ? container.classList.add('is-success') : container.classList.add('is-error');
        success ? msg.innerText = SENDING_SUCCESS : msg.innerText = SENDING_ERROR;

        container.appendChild(msg);


        container.style.height = 0;
        document.getElementsByClassName('contact-form')[0].appendChild(container);
        setTimeout(function () {
            container.style.height = '3em';
        }, 100);

        setTimeout(function () {
            _enableButton();
            container.style.height = 0;
            setTimeout(function () {
                container.parentElement.removeChild(container);
            }, 1000);
        }, 1000);
    }

    var _disableButton = function () {
        var btn = document.getElementById("send-email");

        btn.disabled = true;
        btn.innerText = "SENDING...";
    }

    var _enableButton = function () {
        var btn = document.getElementById("send-email");

        btn.removeAttribute("disabled");
        btn.innerText = "SEND COMMENTS";
    }

    /**
    *   Send an email
    */
    var _sendEmail = function (evt) {
        evt.preventDefault();
        _disableButton();

        if (!_validateFields()) return;

        var params = {
            "from_name": contactForm.name.value,
            "message_html": `Email: ${contactForm.email.value} Message: ${contactForm.comments.value}`
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
                .then(function (response) {
                    _responseMessage(true);
                }, function (err) {
                    _responseMessage(false);
                });
    }

    /**
     * Initializes events
     */
    function _events() {
        document.getElementById("send-email").addEventListener('click', _sendEmail);

        // Focus on fields
        let fields = document.querySelectorAll('.contact-form input, .contact-form textarea');
        Array.prototype.forEach.call(fields, function (item) {
            item.addEventListener('focus', _clearFieldError);
        });
    };
    _events();


})();
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
"use strict";!function(e){function t(){if(""===e.getCookie("a")){var t='<div class="login">\n                      <button class="login-close" onclick="document.body.removeChild(this.parentElement.parentElement)">&#10006</button>\n                      <p>Access to this work is restricted. Please contact me if you need further information.</p>\n                      <form id="fLogin" class="login-action">\n                        <div class="form-row">\n                          <label for="pass">PASSWORD</label>\n                          <input id="pass" name="pass" type="password">\n                          <input type="hidden" id="to" value="'+this.getAttribute("data-validate")+'" />\n                        </div>\n                        <input class="btn" type="submit" value="ENTER"/>\n                      </form>\n                    </div>',o=document.createElement("div");o.classList.add("login-container"),o.innerHTML=t,document.body.appendChild(o),document.getElementById("pass").focus(),document.getElementById("fLogin").addEventListener("submit",a),document.getElementById("pass").addEventListener("keyup",function(){n.clear()})}else document.location=getCookie(this.getAttribute("data-validate"))}function a(t){t.preventDefault();firebase.database().ref().once("value").then(function(a){t.target.pass.value===a.val().login?(e.setCookie("a","t",7),e.setCookie("mm",a.val().mm),e.setCookie("ms",a.val().ms),e.setCookie("uf",a.val().uf),document.location=a.val()[t.target.to.value]):(n.set(),t.target.reset())})}var o={apiKey:"AIzaSyDaRFo82GmVTAygprgD1frGzcflcanFgi4",authDomain:"catastudio-d02bd.firebaseapp.com",databaseURL:"https://catastudio-d02bd.firebaseio.com",projectId:"catastudio-d02bd",storageBucket:"catastudio-d02bd.appspot.com",messagingSenderId:"171539071265"};firebase.initializeApp(o);var n={set:function(){var e=document.querySelector("#fLogin label");e.classList.add("error"),e.innerText="PASSWORD INVALID"},clear:function(){var e=document.querySelector("#fLogin label");e.classList.remove("error"),e.innerText="PASSWORD"}},i=document.querySelectorAll(".work[data-validate]");if(Array.prototype.forEach.call(i,function(e){e.addEventListener("click",t,!1)}),""!==e.getCookie("a")){var s=document.querySelectorAll(".work .icon-login");Array.prototype.forEach.call(s,function(e){e.children[0].className="icon-unlocked"})}}(window);