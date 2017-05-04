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