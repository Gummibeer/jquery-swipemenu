/**
 * swipeMenu.js
 *
 * @author      Tom Witkowski
 * @copyright   2014  Tom Witkowski  (email : tomwitkowski@ymail.com)
 * @license     GPL2
 * @version     1.0
 * @requires	jQuery (http://jquery.com)
 * @requires	hammer.js (http://eightmedia.github.io/hammer.js)
 */

/**
 * Copyright 2014  Tom Witkowski  (email : tomwitkowski@ymail.com)
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License, version 2, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

/** @namespace */
var swipeMenu = new Object();
swipeMenu.fns = new Object();
swipeMenu.options = new Array();
swipeMenu.calcs = new Array();

swipeMenu.count = 0;



/**
 * initialize Debug Function
 * 
 * @function
 */
swipeMenu.fns.initDebug = function() {
    swipeMenu.fns.debug = new Object();
    swipeMenu.fns.debug.log = function(str) {
        if(window.console && console.log && swipeMenu.options[0].debug) {
            console.log(str);
        }
    };
    swipeMenu.fns.debug.info = function(str) {
        if(window.console && console.info && swipeMenu.options[0].debug) {
            console.info(str);
        }
    };
    swipeMenu.fns.debug.error = function(str) {
        if(window.console && console.error && swipeMenu.options[0].debug) {
            console.error(str);
        }
    };
};



/**
 * set Options
 *
 * @function
 * @param {integer} index -  The Array-Key
 * @param {object} options - An Object with the Settings
 */
swipeMenu.fns.setOptions = function(index, options) {
    if(typeof options !== "undefined") {
        swipeMenu.options[index] = $.extend(swipeMenu.options[index], options);
    }
};



/**
 * get multiple Options
 *
 * @function
 * @param {integer} index - The Array-Key
 * @returns {object} options - all Options for the swipeMenu
 */
swipeMenu.fns.getOptions = function(index) {
    if(typeof swipeMenu.options[index] !== "undefined") {
        return swipeMenu.options[index];
    }
};



/**
 * get single Option
 *
 * @function
 * @param {integer} The Array-Key
 * @param {string} The Object-Key
 * @returns {mixed} option - all Options for the swipeMenu
 */
swipeMenu.fns.getOption = function(index, key) {
    if(typeof swipeMenu.options[index][key] !== "undefined") {
        return swipeMenu.options[index][key];
    }
};



/**
 * initialize all Menu-Items
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 */
swipeMenu.fns.initItems = function(arrayIndex) {
    swipeMenu.calcs[arrayIndex] = new Array();
    swipeMenu.options[arrayIndex].items.each(function(index) {
        var $this = $(this);
        swipeMenu.calcs[arrayIndex][index] = new Object();
        swipeMenu.calcs[arrayIndex][index].itemWidth = parseFloat($this.outerWidth());
	swipeMenu.calcs[arrayIndex][index].itemLeft = swipeMenu.options[arrayIndex].containerWidth;
        swipeMenu.calcs[arrayIndex][index].itemCenter = swipeMenu.options[arrayIndex].containerWidth + (swipeMenu.calcs[arrayIndex][index].itemWidth / 2);
        swipeMenu.calcs[arrayIndex][index].itemLeftOverflow = (swipeMenu.options[arrayIndex].wrapperWidth / 2) - swipeMenu.calcs[arrayIndex][index].itemCenter;
	if(swipeMenu.calcs[arrayIndex][index].itemLeftOverflow > 0) {
	    swipeMenu.calcs[arrayIndex][index].itemLeftOverflow = 0;
	}
	
        if($this.hasClass('active')) {
            swipeMenu.options[arrayIndex].activeItem = swipeMenu.options[arrayIndex].activeItem || index;
        }
        
        if(index == 0) {
            swipeMenu.options[arrayIndex].containerHeight = parseFloat($this.outerHeight());
        }
        
        swipeMenu.options[arrayIndex].containerWidth = swipeMenu.options[arrayIndex].containerWidth + swipeMenu.calcs[arrayIndex][index].itemWidth;
    });
    
    swipeMenu.options[arrayIndex].container.width(swipeMenu.options[arrayIndex].containerWidth + 'px');
    swipeMenu.options[arrayIndex].maxOverflow = swipeMenu.options[arrayIndex].containerWidth - swipeMenu.options[arrayIndex].wrapperWidth;
    
    swipeMenu.fns.initBackground(arrayIndex);
    
    swipeMenu.fns.centerItem(arrayIndex, swipeMenu.options[arrayIndex].activeItem);
};



/**
 * center the Item with the given Index
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 * @param {integer} index - The Item-Index
 */
swipeMenu.fns.centerItem = function(arrayIndex, index) {
    if(index > swipeMenu.options[arrayIndex].lastItem || index < 0) {
	    index = swipeMenu.options[arrayIndex].centeredItem;
    }

    var $this = swipeMenu.options[arrayIndex].items.eq(index);
    var itemCenter = swipeMenu.calcs[arrayIndex][index].itemCenter;
    swipeMenu.options[arrayIndex].currentLeft = Math.abs(swipeMenu.calcs[arrayIndex][index].itemLeftOverflow);
    swipeMenu.options[arrayIndex].centeredItem = index;
    
    if(swipeMenu.options[arrayIndex].currentLeft > swipeMenu.options[arrayIndex].maxOverflow) {
	    swipeMenu.options[arrayIndex].currentLeft = swipeMenu.options[arrayIndex].maxOverflow;
    }
    
    swipeMenu.fns.setTransition(arrayIndex, swipeMenu.options[arrayIndex].animationTime);
    
    if(swipeMenu.options[arrayIndex].maxOverflow < 0) {
	    swipeMenu.options[arrayIndex].currentLeft = Math.abs(swipeMenu.options[arrayIndex].maxOverflow / 2);
        swipeMenu.fns.positionContainer(arrayIndex, swipeMenu.options[arrayIndex].currentLeft);
	    swipeMenu.options[arrayIndex].currentLeft = swipeMenu.options[arrayIndex].currentLeft * -1;
    } else if(swipeMenu.options[arrayIndex].currentLeft > 0) {
	    swipeMenu.fns.positionContainer(arrayIndex, '-' + swipeMenu.options[arrayIndex].currentLeft);
    } else {
	    swipeMenu.options[arrayIndex].currentLeft = 0;
	    swipeMenu.fns.positionContainer(arrayIndex, 0);
    }
    
    window.setTimeout(function() {
	swipeMenu.fns.setTransition(arrayIndex, 0);
    }, swipeMenu.options[arrayIndex].animationTime);
    
    $this.trigger('mw.swipenav.item.center');
};



/**
 * set CSS3 Transition
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 * @param {integer} time - The Transition Time in ms
 */
swipeMenu.fns.setTransition = function(arrayIndex, time) {
    swipeMenu.options[arrayIndex].container.css({'-webkit-transition': '-webkit-transform ' + time + 'ms linear 0s'});
    swipeMenu.options[arrayIndex].container.css({'-moz-transition': '-moz-transform ' + time + 'ms linear 0s'});
    swipeMenu.options[arrayIndex].container.css({'-ms-transition': '-ms-transform ' + time + 'ms linear 0s'});
    swipeMenu.options[arrayIndex].container.css({'-o-transition': '-o-transform ' + time + 'ms linear 0s'});
    swipeMenu.options[arrayIndex].container.css({'transition': 'transform ' + time + 'ms linear 0s'});
}



/**
 * set CSS3 Transform
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 * @param {integer} time - The Transition Time in ms	
 */
swipeMenu.fns.positionContainer = function(arrayIndex, value) {
    swipeMenu.options[arrayIndex].container.css({'-webkit-transform': 'translateX(' + value + 'px)'});
    swipeMenu.options[arrayIndex].container.css({'-moz-transform': 'translateX(' + value + 'px)'});
    swipeMenu.options[arrayIndex].container.css({'-ms-transform': 'translateX(' + value + 'px)'});
    swipeMenu.options[arrayIndex].container.css({'-o-transform': 'translateX(' + value + 'px)'});
    swipeMenu.options[arrayIndex].container.css({'transform': 'translateX(' + value + 'px)'});
}



/**
 * move the Container by draged Distance
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 * @param {integer} distance - The absolute Distance in px	
 */
swipeMenu.fns.moveContainer = function(arrayIndex, distance) {
	swipeMenu.fns.positionContainer(arrayIndex, (swipeMenu.options[arrayIndex].currentLeft * -1) + distance);
};



/**
 * calcs the nearest Item by draged Distance
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 * @param {integer} distance - The absolute Distance in px
 */
swipeMenu.fns.calcNearestItem = function(arrayIndex, distance) {
    var leftOverflowValue = (swipeMenu.options[arrayIndex].currentLeft * -1) + distance;
    var arrayIndex = arrayIndex;
    if(leftOverflowValue > 0) {
	    leftOverflowValue = 0;
    } else {
	    leftOverflowValue = Math.abs(leftOverflowValue) + swipeMenu.options[arrayIndex].wrapperWidth / 2;
    }
    
    var nearestItem = 0;
    var lowestDifference = 1000;
    swipeMenu.options[arrayIndex].items.each(function(index) {
        var difference = Math.abs(leftOverflowValue - swipeMenu.calcs[arrayIndex][index].itemCenter);
        if(difference < lowestDifference) {
            nearestItem = index;
            lowestDifference = difference;
        }
    });
    
    swipeMenu.fns.centerItem(arrayIndex, nearestItem);
};



/**
 * initialize Background-Container
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 */
swipeMenu.fns.initBackground = function(arrayIndex) {
    if(swipeMenu.options[arrayIndex].container.find('.swipeMenuBackground').length == 0 && swipeMenu.options[arrayIndex].background === true) {
	    swipeMenu.options[arrayIndex].container.find('ul').append('<li class="swipeMenuBackground"></li>');
    }
    if(swipeMenu.options[arrayIndex].background === true) {
	    swipeMenu.options[arrayIndex].background = swipeMenu.options[arrayIndex].container.find('.swipeMenuBackground');
	
        swipeMenu.options[arrayIndex].background.height(swipeMenu.options[arrayIndex].containerHeight + 'px');

        swipeMenu.options[arrayIndex].background.css({'transition': 'all ' + swipeMenu.options[arrayIndex].animationTime + 'ms linear 0s'});

        swipeMenu.options[arrayIndex].items.on('mw.swipenav.item.center', function() {
	        swipeMenu.fns.positionBackground($(this).parents('.swipeMenuWrapper').attr('data-swipeMenu-count'), swipeMenu.calcs[arrayIndex][swipeMenu.options[arrayIndex].centeredItem].itemWidth, swipeMenu.calcs[arrayIndex][swipeMenu.options[arrayIndex].centeredItem].itemLeft);
	    });
    }
    if(swipeMenu.options[arrayIndex].background === false) {
	    swipeMenu.options[arrayIndex].container.find('.swipeMenuBackground').remove();
	    swipeMenu.options[arrayIndex].items.off('mw.swipenav.item.center');
    }
};



/**
 * move and resize Background-Container
 *
 * @function
 * @param {integer} arrayIndex - The Array-Key
 * @param {integer} bgWidth - Background-Container width
 * @param {integer} bgMargin - Background-Container left margin
 */
swipeMenu.fns.positionBackground = function(arrayIndex, bgWidth, bgMargin) {
	swipeMenu.options[arrayIndex].background.css({'marginLeft': bgMargin + 'px'});
	swipeMenu.options[arrayIndex].background.width(bgWidth);
};



/**
 * extend the jQuery function-Object
 * swipeMenu initializer-Function
 *
 * @param {object} options - An Object with the Settings
 */
jQuery.fn.swipeMenu = function(options) {
    this.attr('data-swipeMenu-count', swipeMenu.count);
    
    swipeMenu.options[swipeMenu.count] = new Object();
    /** @default */
    swipeMenu.options[swipeMenu.count] = {
        debug: false,
        background: false,
        animationTime: 500
    };
    swipeMenu.fns.setOptions(swipeMenu.count, options);
    swipeMenu.fns.setOptions(swipeMenu.count, {wrapper: this});
    swipeMenu.fns.setOptions(swipeMenu.count, {wrapperWidth: swipeMenu.options[swipeMenu.count].wrapper.width()});
    swipeMenu.options[swipeMenu.count].wrapper.addClass('swipeMenuWrapper');
    swipeMenu.fns.setOptions(swipeMenu.count, {container: this.find('.swipeMenuContainer')});
    swipeMenu.fns.setOptions(swipeMenu.count, {containerWidth: 0});
    swipeMenu.fns.setOptions(swipeMenu.count, {items: swipeMenu.options[swipeMenu.count].container.find('ul').find('li')});
    swipeMenu.fns.setOptions(swipeMenu.count, {lastItem: swipeMenu.options[swipeMenu.count].items.last().index()});
    
    swipeMenu.fns.initItems(swipeMenu.count);
    swipeMenu.fns.initDebug();
    
    swipeMenu.options[swipeMenu.count].wrapper.hammer({
        drag: true,
        drag_min_distance: 5,
        drag_block_vertical: true
    }).on("drag", function(event) {
	    event.preventDefault();
        event.gesture.preventDefault();
	    swipeMenu.fns.moveContainer($(this).attr('data-swipeMenu-count'), event.gesture.deltaX);
    }).on("dragend", function(event) {
	    event.preventDefault();
	    event.gesture.preventDefault();
	    swipeMenu.fns.calcNearestItem($(this).attr('data-swipeMenu-count'), event.gesture.deltaX);
    });
    
    swipeMenu.fns.debug.log(swipeMenu);
    
    swipeMenu.count++;
};



/**
 * extend the jQuery function-Object
 * swipeMenu reinitializer-Function
 *
 * @param {object} options - An Object with the Settings
 */
jQuery.fn.swipeMenuReinit = function(options) {
    var arrayIndex = $(this).attr('data-swipeMenu-count');
    swipeMenu.fns.setOptions(arrayIndex, options);
    swipeMenu.fns.setOptions(arrayIndex, {wrapperWidth: swipeMenu.options[arrayIndex].wrapper.width()});
    swipeMenu.fns.setOptions(arrayIndex, {containerWidth: 0});
    swipeMenu.fns.initItems(arrayIndex);
    
    swipeMenu.fns.debug.log(swipeMenu);
};