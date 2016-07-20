/**
 * Longpress is a jQuery plugin that makes it easy to support long press
 * events on mobile devices and desktop borwsers.
 *
 * @name longpress
 * @version 0.1.2
 * @requires jQuery v1.2.3+
 * @author Vaidik Kapoor
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, check out the README at:
 * http://github.com/vaidik/jquery-longpress/
 *
 * Copyright (c) 2008-2013, Vaidik Kapoor (kapoor [*dot*] vaidik -[at]- gmail [*dot*] com)
 */
define(function() {
(function($) {
    $.event.special.longpress = {
        add: function(data) {
            return longpressOn(this, data.selector);
        },

        remove: function(data) {
            return longpressOff(this, data.selector);
        }
    };

    function longpressOn(item, selector) {
        selector || (selector = "");
        var $item = $(item);
        // Browser Support
        $item.on('mousedown', selector, mousedown_callback);
        $item.on('mouseup', selector, mouseup_callback);
        $item.on('mousemove', selector, move_callback);

        // Mobile Support
        $item.on('touchstart', selector, mousedown_callback);
        $item.on('touchend', selector, mouseup_callback);
        $item.on('touchmove', selector, move_callback);
    };

    function longpressOff(item, selector) {
        var $item = $(item);

        // Browser Support
        $item.off('mousedown', selector, mousedown_callback);
        $item.off('mouseup', selector, mouseup_callback);
        $item.off('mousemove', selector, move_callback);

        // Mobile Support
        $item.off('touchstart', selector, mousedown_callback);
        $item.off('touchend', selector, mouseup_callback);
        $item.off('touchmove', selector, move_callback);
    };

    // to keep track of how long something was pressed
    var mouse_down_time;
    var inmousedown = false;
    var timeouts = [], duration = 250;

    // mousedown or touchstart callback
    function mousedown_callback(e) {
        inmousedown = true;
        e.stopPropagation();
        mouse_down_time = new Date().getTime();
        var context = $(this);

        set_callback_timeout(context);
    }

    function set_callback_timeout(context) {
        // set a timeout to call the longpress callback when time elapses
        timeouts.push(setTimeout(function() {
            context.trigger("longpress");
        }, duration));
    }

    // mouseup or touchend callback
    function mouseup_callback(e) {
        inmousedown = false;
        e.stopPropagation();
        var press_time = new Date().getTime() - mouse_down_time;
        if (press_time < duration) {
            // cancel the timeout
            for (var i = 0, l = timeouts.length; i < l; i++) {
                clearTimeout(timeouts.pop());
            }

            var context = $(this);
            // call the shortCallback if provided
            context.trigger("shortpress");
        }
    }

    // cancel long press event if the finger or mouse was moved
    function move_callback(e) {
        if (!inmousedown) return;
        if (e.originalEvent) {
            if (!e.originalEvent.movementX && !e.originalEvent.movementY) return;
        }
        for (var i = 0, l = timeouts.length; i < l; i++) {
            clearTimeout(timeouts.pop());
        }
    }
}(jQuery));
});