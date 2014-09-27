(function() {
	var settings, wrapper, saveInterval;

	$(document).ready(function() {
        //$('#slidebox .slideImage:first-child').addClass("selected");
        advanceRight();
	});

    var sliderTimer = null;
    var interval = 15000;

    $('#slidebox .left').click(function()
    {
        advanceLeft();
    });

    $('#slidebox .right').click(function()
    {
        advanceRight();
    });

    function advanceRight()
    {
        var current = $('#slidebox .slideImage.selected');
        var next = current.next();

        if(next.length == 0)
            next = $('#slidebox .slideImage:first-child');

        transitionImage(next);
    }

    function advanceLeft()
    {
        var current = $('#slidebox .slideImage.selected');
        var next = current.prev();

        if(next.length == 0)
            next = $('#slidebox .slideImage:last-child');

        transitionImage(next);
    }

    function transitionImage(next)
    {
        $('#slidebox .slideImage.selected').removeClass('selected');
        $(next).addClass('selected')

        autoTransition();
    }

    function autoTransition()
    {
        if(sliderTimer != null)
        {
            clearTimeout(sliderTimer);
            sliderTimer = null;
        }

        sliderTimer = setTimeout(advanceRight, interval);
    }




}());