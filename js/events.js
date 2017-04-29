
/**
*   Initialize the events
*/
function _events() {
    // Navigate to top button
    navTop.addEventListener('click', ScrollToTop);


    // Send an email
    btnEmail.addEventListener('click', SendEmail);


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
        //SetTiles(); 
        //Sunburst(sunburst, SUNBURST_PATH);
    }

    // Avoid auto scrolling if touchs the page
    //window.addEventListener('touchstart', function () {
    //    clearInterval(intervalScrolling);
    //});
}

_events();