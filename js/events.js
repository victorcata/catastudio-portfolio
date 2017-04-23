
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
    if (tiles.length > 0) SetTiles();

    // Skill elements
    Array.prototype.forEach.call(skills, function (item) {
        var container = item.parentElement;
        container.addEventListener('mouseenter', app.skills.show);
        container.addEventListener('mouseleave', app.skills.hide);
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