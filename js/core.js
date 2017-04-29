var SPEED_PARALLAX = 100,
    HOVER_INTENT_DELAY = 350,
    SUNBURST_PATH = '/Content/data/skills.json',
    SENDING_ERROR = 'Sorry, There was a problem sending your message.',
    SENDING_SUCCESS = 'Your messages has been send it, Thank You!';

var navTop = document.getElementById('nav-top'),
    sunburst = document.getElementById('sunburst'),
    btnEmail = document.getElementById('send-email'),
    fields = document.querySelectorAll('.contact-form input, .contact-form textarea'),
    timeoutIn = null,
    intervalScrolling = null;



/**
*   Controls the visibility of the scroll to top button
*/
function ScrollTopVisibility() {
    if (navTop == undefined) return;

    if (ScrollTop() == 0) {
        navTop.classList.add('is-hidden');
    } else {
        navTop.classList.remove('is-hidden');
    }
}

/**
*   Controls the visibility of the header
*/
function HeaderVisibility() {
    let header = document.getElementsByClassName("layout-header")[0],
        title = document.getElementsByClassName("title")[0];

    if (ScrollTop() > 0) {
        header.classList.add('is-fixed');
        title.classList.add("is-fixed");
    } else {
        header.classList.remove('is-fixed');
        title.classList.remove("is-fixed");
    }
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