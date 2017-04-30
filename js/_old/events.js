
/**
*   Initialize the events
*/
function _events() {



    // Create the tiles 3d effect on the education section
    app.tiles();

    // Skill elements
    Array.prototype.forEach.call(skills, function (item) {
        var container = item.parentElement;
        container.addEventListener('mouseenter', app.skills.details.show);
        container.addEventListener('mouseleave', app.skills.details.hide);
    });


    // Functions to execute when scrolling
    window.onscroll = function () {
        Parallax();
        app.skills.animeLevel();

        if (_isMenuVisible()) {
            _hideMenu();
        }
    }
}

_events();