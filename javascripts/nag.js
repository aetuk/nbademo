var handleOut = "";

/* Document Ready Call */
jQuery(document).ready(function ($) {

//Detect mobiles
var deviceAndroid = "android";
var deviceIphone = "iphone";
var deviceBlackberry = "blackberry";
var uagent = navigator.userAgent.toLowerCase();
DetectDevice();
function DetectDevice() {
if (uagent.search(deviceAndroid) > -1) {$('body').addClass(deviceAndroid);}
else if (uagent.search(deviceIphone) > -1) {$('body').addClass(deviceIphone);}
else if (uagent.search(deviceBlackberry) > -1) {$('body').addClass(deviceBlackberry);}
}
if ($(window).width()<768) {
$('body').addClass("mobi");
}
var mobimove=$("#leftnav").html();
$("#mobileleftnav").html(mobimove);


	/* all application specific JS */

	/* TABS */
	/* Remove if you don't need :) */

	function activateTab($tab) {
		var $activeTab = $tab.closest('dl').find('a.active'),
				contentLocation = $tab.attr("href") + 'Tab';
				
		// Strip off the current url that IE adds
		contentLocation = contentLocation.replace(/^.+#/, '#');

		//Make Tab Active
		$activeTab.removeClass('active');
		$tab.addClass('active');

    //Show Tab Content
		$(contentLocation).closest('.tabs-content').children('li').hide();
		$(contentLocation).css('display', 'block');
	}

	$('dl.tabs').each(function () {
		//Get all tabs
		var tabs = $(this).children('dd').children('a');
		tabs.click(function (e) {
			activateTab($(this));
return false;
		});
	});

	if (window.location.hash) {
		activateTab($('a[href="' + window.location.hash + '"]'));
		$.foundation.customForms.appendCustomMarkup();
	}

	/* ALERT BOXES */
	$(".alert-box").delegate("a.close", "click", function(event) {
    event.preventDefault();
	  $(this).closest(".alert-box").fadeOut(function(event){
	    $(this).remove();
	  });
	});


	/* PLACEHOLDER FOR FORMS */
	/* Remove this and jquery.placeholder.min.js if you don't need :) */

	$('input, textarea').placeholder();

	/* TOOLTIPS */
	$(this).tooltips();

	/* DROPDOWN NAV */

	var lockNavBar = false;
	$('.nav-bar a.flyout-toggle').live('click', function(e) {
		e.preventDefault();
		var flyout = $(this).siblings('.flyout');
		if (lockNavBar === false) {
			$('.nav-bar .flyout').not(flyout).slideUp(500);
			flyout.slideToggle(500, function(){
				lockNavBar = false;
			});
		}
		lockNavBar = true;
	});
  if (Modernizr.touch) {
    $('.nav-bar>li.has-flyout>a.main').css({
      'padding-right' : '75px'
    });
    $('.nav-bar>li.has-flyout>a.flyout-toggle').css({
      /*'border-left' : '1px dashed #eee'*/
    });
  } else {
    $('.nav-bar>li.has-flyout').hover(function() {
      $(this).children('.flyout').show();
    }, function() {
      $(this).children('.flyout').hide();
    })
  }


	/* Accordion code */
var accoranime = false;
	$('dl.accordion dd').slideUp(function () {
		$('dl.accordion dd').first().slideDown();
		$('dl.accordion dt').first().addClass('active');
	});
	$('dl.accordion dt').click(function () {
		if (!(accoranime)) {
			accoranime = true;
			var accorfoo = $(this);
			if (!($(accorfoo).hasClass('active'))) {
				$('dl.accordion dt').removeClass('active');
				$('dl.accordion dd:visible').slideUp(function() {
					$(accorfoo).next('dd').slideDown();
					$(accorfoo).addClass('active');
				});
			}
			accoranime = false;
		}
	})
	
	/* Show/hide code */
	$('dl.showhide dd').slideUp();
	$('dl.showhide dt').click(function () {
		var showhidefoo = $(this);
		if ($(showhidefoo).hasClass('active')) {
			$(showhidefoo).next('dd').slideUp(function() {
				$(showhidefoo).removeClass('active');
			});
		} else {
			$(showhidefoo).next('dd').slideDown(function() {
				$(showhidefoo).addClass('active');
			});
		}
	})
	
	// MOBILE NAV SETUP
	$('#mobile-nav').click(function() {
		$('#mobile-nav-menu').slideToggle();
		return false;
	});
	$('#mobile-nav-left').click(function() {
		$('#mobile-nav-left-show').slideToggle();
		return false;
	});
	
	// More Content show/hide
	$('.more .morecontent').hide();
	var mheaders = '.more .moreheader';
	$(mheaders).addClass('morejs');
	$(mheaders).click(function () {
		if ($(this).hasClass('active')) {
			$(this).parent().children(".morecontent").slideUp();
			$(this).removeClass('active');
		} else {
			$(this).parent().children(".morecontent").slideDown();
			$(this).addClass('active');
		}
	})
	
  
});


			

jQuery.fn.forceNumeric = function () {
return this.each(function () {
$(this).keydown(function (e) {
var key = e.which || e.keyCode;
if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
// numbers   
key >= 48 && key <= 57 ||
// Numeric keypad
key >= 96 && key <= 105 ||
// Backspace and Tab and Enter
key == 8 || key == 9 || key == 13 ||
// Home and End
key == 35 || key == 36 ||
// left and right arrows
key == 37 || key == 39 ||
// Del and Ins
key == 46 || key == 45)
return true;
return false;
});
});
}

