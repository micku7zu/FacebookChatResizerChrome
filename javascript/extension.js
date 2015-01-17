var bodyHeightDif = 55; //the difference between the window and the body with the text
var bodyMinWidth = 200;
var bodyMinHeight = 200;
var bodyMaxWidthDif = 225; //window width - this
var bodyMaxHeightDif = 100; //window height - this
var defaultWidth = 0,
	defaultHeight = 0; //default width and height of a window, we will get it

//on windows load
window.addEventListener("load", function() {

	//try to insert the resize button
	setInterval(function() { insertResizeButton(); }, 1000);

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

			//drag events
			$(this).drag('start', function(ev, dd) {
				var chatBox = $(this).parents(".fbDockChatTabFlyout").eq(0);
				dd.width = chatBox.width();
				dd.height = chatBox.height();
			});

			var elem = $(this);

			$(this).drag(function(ev, dd) {
				resize(dd.width - dd.deltaX, dd.height - dd.deltaY, elem);
			});
		}
	});
}


function resize(w, h, elem) {
	if(elem == undefined) {
		elem = current;
	}

	if(w < bodyMinWidth) w = bodyMinWidth;
	if(w > $(window).width() - bodyMaxWidthDif) w =  $(window).width() - bodyMaxWidthDif;
	if(h < bodyMinHeight) h = bodyMinHeight;
	if(h > $(window).height() - bodyMaxHeightDif) h =  $(window).height() - bodyMaxHeightDif;

	console.log($( window ).height());

	var parent = elem.parents(".fbNub").eq(0);
	var chatBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var chatBody = $(chatBox).find(".fbNubFlyoutBody").eq(0);

	var bodyHeight = h - bodyHeightDif; //height of the chatBody

	parent.css("width", w + "px");
	chatBox.css("width", w + "px");
	chatBox.css("height", h + "px");
	chatBody.css("height", bodyHeight + "px");
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