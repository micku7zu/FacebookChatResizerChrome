var tX = 0, tY = 0;
var current;

var bodyHeightDif = 55; //the difference between the window and the body with the text
var bodyMinWidth = 200;
var bodyMinHeight = 200;
var bodyMaxWidth = 600;
var bodyMaxHeight = 600;

var defaultWidth = 0,
	defaultHeight = 0; //default width and height of a window, we will get it

//on windows load
window.addEventListener("load", function() {

	//try to insert the resize button
	setInterval(function() { insertResizeButton(); }, 1000);

	//on resize button mousedown and up (click, hold, move, release)
	$(document.body).on('mousedown', '.extresize', function(){
		onClickPressed($(this));
	}).on('mouseup', '.extresize', function() {
		onClickReleased($(this));
	});

	$('.drag').drag(function( ev, dd ){
	$( this ).css({
	top: dd.offsetY,
	left: dd.offsetX
	});
	});

}, false);

function insertResizeButton() {
	var elems = $(".mls.titlebarButtonWrapper");
	elems.each(function(el) {
		if($(this).children(".extresize").length == 0) {
			//add the resize button
			$(this).prepend('<a style="background-image:url( ' + chrome.extension.getURL('images/resize.png') + ');" class="extresize close button" data-ft="{&quot;tn&quot;:&quot;+\u003C&quot;}" role="button" tabindex="0" data-hover="tooltip" aria-label="Resize"></a>');
		
			//hide the annoying info box
			var chatBox = $(this).parents(".fbDockChatTabFlyout").eq(0);
			chatBox.find('.fbNubFlyoutHeader').eq(0).hide();

			//get a default width if not set
			if(defaultWidth == 0) {
				defaultWidth = chatBox.width();
				defaultHeight = chatBox.height();

				console.log("Default width and height: " + defaultWidth + " - " + defaultHeight);
			}

			//resize the window after we removed the info box
			resize(defaultWidth, defaultHeight, $(this));
		}
	});
}


function resize(w, h, elem) {
	if(elem == undefined) {
		elem = current;
	}

	var parent = elem.parents(".fbNub").eq(0);
	var chatBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var chatBody = $(chatBox).find(".fbNubFlyoutBody").eq(0);

	var bodyHeight = h - bodyHeightDif; //height of the chatBody

	parent.css("width", w + "px");
	chatBox.css("width", w + "px");
	chatBox.css("height", h + "px");
	chatBody.css("height", bodyHeight + "px");
}

function onMouseMove(e) {
	var w = tX - e.clientX,
		h = tY - e.clientY;

	if(w < bodyMinWidth) w = bodyMinWidth;
	if(w > bodyMaxWidth) w = bodyMaxWidth;
	if(h < bodyMinHeight) h = bodyMinHeight;
	if(h > bodyMaxHeight) h = bodyMaxHeight;

	resize(w, h)
}

function onClickPressed(elem) {
	var parent = elem.parents(".fbNub").eq(0);
	var chatBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var chatBody = $(chatBox).find(".fbNubFlyoutBody").eq(0);

	tX = chatBox.offset().left + chatBox.width();
	tY = chatBox.offset().top - $(window).scrollTop() + chatBox.height();

	//chatBody.find(".conversation").eq(0).css("paddingTop", "500px");
	//chatBody.animate({"scrollTop": 99999}, 0);
	//chatBody.css("overflow-y", "scroll");

	//set width auto
	chatBody.find("div").css("width", "auto");

	//set current chat window
	current = elem;

	toggleOnMoveEvent(true); //set move mouse listener
}

function onClickReleased(elem) {
	toggleOnMoveEvent(false); //unset move mouse listenere
}

function toggleOnMoveEvent(enabled) {
	if(enabled) {
		$(document).on("mousemove", onMouseMove);
	}else{
		$(document).off("mousemove", onMouseMove);
	}
}