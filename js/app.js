var app = app || {};

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

/**
*   Sunburst chart control
*   @param {object} element: DOM element with the container
*   @param {string} path: URL where is the json data
*/
var Sunburst = function (element, path) {
    if (element === null || element.offsetParent === null) return;

    function sunBurst(selector) {
        var _graph = {};
        var _ux = '#2980B8',
            _front = '#f39c12',
            _back = '#e45e41',
            _experience = '#FFF';

        var _data,
            _width = element.offsetWidth * 2,
            _height = element.offsetHeight - 50,
            _radius = Math.min(_width, _height) / 2,
            _svg,
            _bodyG,
            _labelsG,
            _partition,
            _arc,
            _x = d3.scaleLinear().range([0, Math.PI * 2]),
            _y = d3.scaleSqrt().range([0, _radius]);

        _graph.render = function () {
            if (!_svg) {
                _svg = d3.select(selector).append('svg').attr('width', _width).attr('height', _height);
            }

            renderBody();
        }

        function renderBody() {
            if (!_bodyG) {
                _bodyG = _svg.append('g').attr('class', 'body').attr('transform', 'translate(0, ' + _height / 2 + ')');
            }

            processData();
            renderCircles();
        }

        function processData() {
            _data = d3.hierarchy(_data).sum(function (d) {
                return d.size;
            });
            _partition = d3.partition();
            _arc = d3.arc()
                        .startAngle(function (d) {
                            var x0 = Math.min(Math.PI, _x(d.x0 / Math.PI * 1.57));
                            return Math.max(0, x0);
                        })
                        .endAngle(function (d) {
                            var x1 = Math.min(Math.PI, _x(d.x1 / Math.PI * 1.57));
                            return Math.max(0, x1);
                        })
                        .innerRadius(function (d) {
                            return Math.max(0, _y(d.y0));
                        })
                        .outerRadius(function (d) {
                            return Math.max(0, _y(d.y1));
                        });
        }

        function renderCircles() {
            var node = _partition(_data).descendants();

            var pathG = _bodyG.selectAll('path')
                    .data(node)
                    .enter()
                    .append('g');

            pathG.append('path')
                .attr('data-skill', function (d) {
                    return d.data.skill;
                })
                .attr('data-skill-chain', function (d) {
                    var skill = '',
                        path = d;
                    for (var i = d.depth; i > 0; i--) {
                        skill += path.data.skill + '-';
                        path = path.parent;
                    }

                    return skill;
                })
                .attr('stroke', 'white')
                .attr('fill', function (d) {
                    var group = d.data.name;
                    if (d.depth === 2) {
                        group = d.parent.data.name;
                    } else if (d.depth === 3) {
                        group = d.parent.parent.data.name;
                    }
                    switch (group) {
                        case 'UX':
                            return d3.color(_ux).darker((d.depth - 1) / 2);
                            return _ux;
                            break;
                        case 'Front-End':
                            return d3.color(_front).darker((d.depth - 1) / 2);
                            return _front;
                            break;
                        case 'Back-End':
                            return d3.color(_back).darker((d.depth - 1) / 2);
                            return _back;
                            break;
                        default:
                            return '#FFF';
                            break;
                    }
                })
                .attr('d', _arc);

            pathG.append("text")
                    .text(function (d) {
                        return d.data.name;
                    })
                    .classed("label", true)
                    .attr("x", function (d) { return d.x; })
                    .attr("style", function (d) {
                        if (d.depth === 1) {
                            return 'font-size: 1.5em';
                        }
                        else {
                            return 'font-size: .9em';
                        }
                    })
                    .attr("text-anchor", function (d) {
                        if (d.depth === 1) {
                            return 'middle';
                        }
                        else {
                            return 'middle';
                        }
                    })
                    .attr("transform", function (d) {
                        if (d.depth > 0) {
                            return "translate(" + _arc.centroid(d) + ")" +
                                    "rotate(" + getAngle(d) + ")";
                        } else {
                            return null;
                        }
                    })
                    .attr("dx", "6")
                    .attr("dy", ".35em")
                    .attr("pointer-events", "none");
        }

        function getAngle(d) {
            var thetaDeg = (180 / Math.PI * (_arc.startAngle()(d) + _arc.endAngle()(d)) / 2 - 90);
            var rotation = (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg + 180;

            return rotation;
        }

        _graph.data = function (data) {
            if (!arguments.length) return _data;
            _data = data;
            return _graph;
        }

        return _graph;
    }

    d3.json(path, function (error, data) {
        if (error) console.warn('Sunburst data not found');

        element.innerHTML = null;
        sunBurst('#' + element.id).data(data).render();
    });
}
app.skills = (function(){
    /**
    *   Shows the level of each skill with an animation
    */
    function _animeLevel() {
        for (var i = 0; i < skills.length; i++) {
            var item = skills[i];
            var level = item.querySelector('.percentage');
            if (item.isOnScreen()) {
                level.style.width = level.getAttribute('data-level') + '%';
                level.style.transition = 'width 1s .250s ease-out'
            }
            else {
                level.removeAttribute('style');
            }
        }
    }

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

    return {
        animeLevel: _animeLevel,
        details: {
            show: _showDetails,
            hide: _hideDetails
        }
    }
})();
app.tiles = (function() {
	var _tiles = document.getElementsByClassName('box');

	/**
	*   Create the 3D tiles in the progress section
	*/
	function _tiles(tile) {
		var tileWidth = tile.offsetWidth;
		var depth = '100px';

		for (var i = 0; i < tile.children.length; i++) {
			var tileSide = tile.children[i];
			tileSide.style.width = tileWidth + 'px';
			switch (tileSide.className) {
				case 'box-top':
					tileSide.style.height = tileWidth + 'px';
					tileSide.style.transform = 'rotateX(90deg) rotateZ(90deg) translate3D(0, ' + -(tileWidth / 2) + 'px, ' + (tileWidth / 2) + 'px)';
					tileSide.style.transformOrigin = 'left center';
					tileSide.style.width = depth;
					break;
				case 'box-bottom':
					tileSide.style.height = tileWidth + 'px';
					tileSide.style.transform = 'rotateX(-90deg) rotateZ(90deg) translate3D(-100px, ' + -(tileWidth / 2) + 'px, ' + -((tileWidth / 2) - 10) + 'px)';
					tileSide.style.transformOrigin = 'left center';
					tileSide.style.width = depth;
					break;
				case 'box-left':
					tileSide.style.transform = 'rotateY(-90deg) translate3D(50px, 0, 50px)';
					tileSide.style.width = depth;
					break;
				case 'box-right':
					tileSide.style.transform = 'rotateY(90deg) translate3D(-50px, 0, ' + (tileWidth - 50) + 'px)';
					tileSide.style.width = depth;
					break;
				case 'box-front':
					tileSide.style.transform = 'translateZ(' + 100 + 'px)';
					break;
				case 'box-back':
					break;
			}
		}
	}

	/**
	 *   Set the tiles in the education section
	 */
	function _setTiles() {
		if (tiles[0].offsetParent === null) return;
		Array.prototype.forEach.call(tiles, Tiles);
		_tilesConnector();
	}
		
	/**
	*   Establish the connectors with the tiles
	*/
	function _tilesConnector() {
		var cards = document.getElementsByClassName('card');

		Array.prototype.forEach.call(cards, function (item) {
			var card = item.getAttribute('data-card'),
				tile = document.querySelector('.tile-container[data-card="' + card + '"]'),
				connector = item.getElementsByClassName('card-connector')[0];

			var cardBox = item.getBoundingClientRect(),
				tileBox = tile.getBoundingClientRect();

			connector.style.height = (tileBox.top + (tileBox.height / 2) - (cardBox.top + cardBox.height)) + 'px';
		});
	}


	if (_tiles.length) _setTiles();
});
var SCROLL_MOVE = 100,
    SPEED_PARALLAX = 100,
    HOVER_INTENT_DELAY = 350,
    SUNBURST_PATH = '/Content/data/skills.json',
    SENDING_ERROR = 'Sorry, There was a problem sending your message.',
    SENDING_SUCCESS = 'Your messages has been send it, Thank You!';

var navTop = document.getElementById('nav-top'),
    navMenu = document.getElementById('nav-toggle'),
    menuOpts = document.querySelectorAll('.menu li'),
    skills = document.getElementsByClassName('skill'),
    sunburst = document.getElementById('sunburst'),
    btnEmail = document.getElementById('send-email'),
    fields = document.querySelectorAll('.contact-form input, .contact-form textarea'),
    timeoutIn = null,
    intervalScrolling = null;

/**
*   Gets the scroll top position compatibility with IE
*   @return {int} Scroll Top value
*/
function ScrollTop() {
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}

/**
*   Sets the scroll top position compatibility with IE
*   @param {int} value: Scroll Top value
*/
function SetScrollTop(value) {
    if (window.navigator.userAgent.indexOf('MSIE') > 0) {
        document.documentElement.scrollTop = value;
        return document.documentElement.scrollTop;
    } else {
        document.body.scrollTop = value;
        return document.body.scrollTop;
    }
}

/**
*   Controls the visibility of the scroll to top button
*/
function ScrollTopVisibility() {
    if (navTop == undefined) return;
    ScrollTop() == 0 ? navTop.classList.add('is-hidden') : navTop.classList.remove('is-hidden');
}

/**
*   Controls the visibility of the header
*/
function HeaderVisibility() {
    var header = document.getElementsByClassName("layout-header")[0];
    (ScrollTop() > 0) ? header.classList.add('is-ontop') : header.classList.remove('is-ontop');
}

/**
*   Controls the visibility of the social media buttons
*/
function SocialMediaVisibility() {
    var social = document.getElementById('rrss'),
        fullHeight = ScrollTop() + document.body.offsetHeight;
    (ScrollTop() >= 0 && fullHeight < document.body.scrollHeight) ? social.classList.add('is-floating') : social.classList.remove('is-floating');
}

/**
*   Animate the scroll to the top of the window
*/
function ScrollToTop() {
    ScrollPageTo(0);
};

/**
*   Scroll the page to a determinated position
*   @param {object} to: Element where to scroll
*/
function ScrollPageTo(to) {
    if (to === undefined || to === null) return;

    var top = to.offsetTop;

    intervalScrolling = setInterval(function () {
        if (isNaN(to)) {
            // Scroll to an element
            if (top < ScrollTop()) {
                //document.body.scrollTop -= SCROLL_MOVE;
                var value = ScrollTop() - SCROLL_MOVE;
                SetScrollTop(value);
                if (ScrollTop() <= top) {
                    SetScrollTop(top);
                    clearInterval(intervalScrolling);
                }
            } else {
                //document.body.scrollTop += SCROLL_MOVE;
                var value = ScrollTop() + SCROLL_MOVE;
                SetScrollTop(value);
                if (ScrollTop() >= top) {
                    //document.body.scrollTop = top;
                    SetScrollTop(top);
                    clearInterval(intervalScrolling);
                }
            }
        } else {
            // Scroll to the top
            //document.body.scrollTop -= SCROLL_MOVE;
            var value = ScrollTop() - SCROLL_MOVE;
            SetScrollTop(value);
            if (ScrollTop() <= 0) clearInterval(intervalScrolling);
        }
    }, 10);
}

/**
*   Controls the parallax movement of the layers
*/
function Parallax() {
    var itemsParallax = document.querySelectorAll('[data-parallax-y]'),
        scrollTop = ScrollTop();

    Array.prototype.forEach.call(itemsParallax, function (item) {
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

/**
*   Shows or hides the navigation menu on mobile resolutions
*/
function ToggleMenu() {
    if (this.offsetParent === null) return;
    var menu = this.nextElementSibling.children[0];

    (_isMenuVisible()) ? _hideMenu() : _showMenu();
}

function _isMenuVisible() {
    return navMenu.nextElementSibling.children[0].style.display === 'block';
}

/**
*   Hides the navigation menu
*   @param {object} container: Main container
*/
function _hideMenu(container) {
    var menu = navMenu.nextElementSibling.children[0],
        container = navMenu.parentElement;

    menu.style.height = 0;
    setTimeout(function () {
        menu.removeAttribute('style');
        container.removeAttribute('class');
    }, 300);
}

/**
*   Shows the navigation menu
*   @param {object} menu: Menu of options
*   @param {object} container: Main container
*/
function _showMenu(menu, container) {
    var menu = navMenu.nextElementSibling.children[0],
        container = navMenu.parentElement;

    menu.style.display = 'block';
    container.classList.add('is-open');
    var height = menu.offsetHeight;
    menu.style.height = 0;
    setTimeout(function () {
        menu.style.height = height + 'px';
    }, 50);
}

/**
*   Change the opacity on the rest of menu items
*/
function onMouseOverMenuOption() {
    for (var i = 0; i < menuOpts.length; i++) {
        if (menuOpts[i].getAttribute('data-goto') !== this.getAttribute('data-goto')) {
            menuOpts[i].style.opacity = .5;
        }
    }
}

/**
*   Restore the opacity on the rest of menu items
*/
function onMouseLeaveMenuOption() {
    for (var i = 0; i < menuOpts.length; i++) {
        menuOpts[i].style.opacity = 1;
    }
}

/**
*   Scroll to the container position
*/
function onClickMenuOption() {
    var id = this.getAttribute('data-goto'),
        section = document.getElementById(id);

    ToggleMenu.call(navMenu);
    ScrollPageTo(section);
}

/**
*   Return the height of the container to prepare it for the animation
*   @param {object} container: Skill details container
*   @param {function} callback: Function to execute after calculate the height 
*   @return {number} Value of the details container height
*/
function getDetailsContainerHeight(container, callback) {
    container.style.height = 'auto';
    var height = container.offsetHeight;
    container.style.height = 0;
    if (callback !== undefined && callback !== null && typeof callback === 'function') {
        callback(height);
    }
    return height;
}

/**
*   Highlight the sunburst section of the skill
*/
function _highLightSunburst(skill) {
    var path = document.querySelector('path[data-skill=' + skill + ']');
    if (path === null) return;

    var chain = path.getAttribute('data-skill-chain').split('-');

    if (path.classList === undefined) return;

    path.classList.add('is-highlight');
    for (var i = 1; i < chain.length - 1; i++) {
        sunburst.querySelector('path[data-skill=' + chain[i] + ']').classList.add('is-highlight');
    }

}

/**
*   Remove the highlight in the sunburst section of the skill
*/
function _removeHighLightSunburst(skill) {
    var path = document.querySelector('path[data-skill=' + skill + ']');
    if (path === null) return;
    var chain = path.getAttribute('data-skill-chain').split('-');

    if (path.classList == undefined) return;

    path.classList.remove('is-highlight');
    for (var i = 1; i < chain.length - 1; i++) {
        sunburst.querySelector('path[data-skill=' + chain[i] + ']').classList.remove('is-highlight');
    }
}

/**
*   Validate the fields of the form
*   @return {boolean} True if every fields is filled right
*/
function _validateFields() {
    var name = document.getElementById('name'),
        email = document.getElementById('email'),
        comments = document.getElementById('comments'),
        emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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

function clearFieldError() {
    this.classList.remove('is-error');
}

/**
*   Append a message with the result of sending the email
*   @param {boolean} success: True if the message was send it
*/
function _responseMessage(success) {
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
        container.style.height = 0;
        setTimeout(function () {
            container.parentElement.removeChild(container);
        }, 1000);
    }, 5000);
}

window.ResponseMessage = _responseMessage;

/**
*   Send an email
*/
function SendEmail(e) {
    if (!_validateFields()) return;

    var data = {
        'name': document.getElementById('name').value,
        'email': document.getElementById('email').value,
        'comments': document.getElementById('comments').value
    };
    var params = 'name=' + data.name + '&email=' + data.email + '&comments=' + data.comments;

    var http = new XMLHttpRequest();
    http.open("POST", '/Content/data/email.php?' + params, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            _responseMessage(http.responseText.trim() == "1");
        }
    }
    http.send();
    return false;
}

/**
*   Initialize the events
*/
function _events() {
    // Navigate to top button
    navTop.addEventListener('click', ScrollToTop);

    // Open top menu on mobile
    navMenu.addEventListener('click', ToggleMenu);

    // Send an email
    btnEmail.addEventListener('click', SendEmail);

    // Menu items
    Array.prototype.forEach.call(menuOpts, function (item) {
        item.addEventListener('mouseover', onMouseOverMenuOption);
        item.addEventListener('mouseleave', onMouseLeaveMenuOption);
        item.addEventListener('click', onClickMenuOption);
    });

    // Create the tiles 3d effect on the education section
    app.tiles();

    // Skill elements
    Array.prototype.forEach.call(skills, function (item) {
        var container = item.parentElement;
        container.addEventListener('mouseenter', app.skills.details.show);
        container.addEventListener('mouseleave', app.skills.details.hide);
    });

    // Focus on fields
    Array.prototype.forEach.call(fields, function (item) {
        item.addEventListener('focus', clearFieldError);
    });

    // Shows the skill if they are visible on the moment to load the page
    //ShowSkill();
    app.skills.animeLevel();

    // Load the sunburst chart
    //Sunburst(sunburst, SUNBURST_PATH);

    // Shows the scroll to top button if it's reloaded the page not on the top
    ScrollTopVisibility();
    SocialMediaVisibility();

    // Functions to execute when scrolling
    window.onscroll = function () {
        ScrollTopVisibility();
        HeaderVisibility();
        Parallax();
        app.skills.animeLevel();
        SocialMediaVisibility();

        if (_isMenuVisible()) {
            _hideMenu();
        }
    }

    // Elements when resize
    window.onresize = function () {
        SetTiles();
        Sunburst(sunburst, SUNBURST_PATH);
    }

    // Avoid auto scrolling if touchs the page
    //window.addEventListener('touchstart', function () {
    //    clearInterval(intervalScrolling);
    //});
}

_events();