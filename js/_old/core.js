var SUNBURST_PATH = '/Content/data/skills.json',
    SENDING_ERROR = 'Sorry, There was a problem sending your message.',
    SENDING_SUCCESS = 'Your messages has been send it, Thank You!';

var navTop = document.getElementById('nav-top'),
    sunburst = document.getElementById('sunburst'),
    btnEmail = document.getElementById('send-email'),
    timeoutIn = null,
    intervalScrolling = null;

