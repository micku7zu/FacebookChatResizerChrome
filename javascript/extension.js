var clicked = 0;
var tX = 0, tY = 0;
var current;

window.addEventListener("load", function() {

	setInterval(function() {
		insertResizeButton();
	}, 1000);

	$(document.body).on('click', '.extresize',function(){
		onClick($(this));
	});

}, false);

function insertResizeButton() {
	var elems = $(".mls.titlebarButtonWrapper");
	elems.each(function(el) {
		if($(this).children(".extresize").length == 0) {
			$(this).prepend('<a style="background-image:url( ' + chrome.extension.getURL('images/resize.png') + ');" class="extresize close button" data-ft="{&quot;tn&quot;:&quot;+\u003C&quot;}" role="button" tabindex="0" data-hover="tooltip" aria-label="Resize"></a>');
		}
	});
}


function resize(w, h) {
	elem = current;
	var megaParent = elem.parents(".fbNub").eq(0);
	var bigBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var bodyHeight = h - 55;

	megaParent.css("width", w + "px");
	bigBox.css("width", w + "px");
	bigBox.css("height", h + "px");
	var body = $(bigBox).find(".fbNubFlyoutBody").eq(0);
	body.css("height", bodyHeight + "px");
}

function onMove(e) {
	clicked = 1;
	var w = tX - e.clientX;
	var h = tY - e.clientY;

	if(w < 200) {
		w = 200;
	}

	if(h < 200) {
		h = 200;
	}

	resize(w, h)

}

function onClick(elem) {
	var megaParent = elem.parents(".fbNub").eq(0);
	var bigBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var info = bigBox.find('.fbNubFlyoutHeader').eq(0);
	var body = $(bigBox).find(".fbNubFlyoutBody").eq(0);
	var nustiu = $(bigBox).find(".fbNubFlyoutInner").eq(0);

	if(clicked == 0) {
		info.hide();

		tX = bigBox.offset().left + bigBox.width();
		tY = bigBox.offset().top - $(window).scrollTop() + bigBox.height();

		body.find(".conversation").eq(0).css("paddingTop", "500px");
		body.animate({"scrollTop": 99999}, 0);
		body.css("overflow-y", "scroll");
		body.find("div").css("width", "auto");
		clicked = 1;
		current = elem;

		$(document).on("mousemove", onMove);

	}else{
		body.animate({"scrollTop": 99999}, 0);
		clicked = 0;
		$(document).off("mousemove", onMove);
	}
}