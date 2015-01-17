var bodyHeightDif = 55; //the difference between the window and the body with the text
var bodyMinWidth = 200;
var bodyMinHeight = 200;
var bodyMaxWidthDif = 225; //window width - this
var bodyMaxHeightDif = 100; //window height - this
var defaultWidth = 260,
	defaultHeight = 285; //default width and height of a window, we will get it
var defaultMinHeight = 200,
	defaultMinWidth = 200;

function get(key) {
	try{
		return JSON.parse(localStorage[key]);
	}catch(err) {
		return localStorage[key];
	}
}

function updateLocalStorage(callback) {
	chrome.runtime.sendMessage({method: "getLocalStorage"}, function(response) {
		for(var key in response.data) {
			localStorage[key] = response.data[key];
		}

		if(callback != undefined)
			callback();
	});
}

function updateMinimumSize() {
	updateLocalStorage(function(){
		if(get("min")) {
			bodyMinWidth = defaultWidth;
			bodyMinHeight = defaultHeight;
		}else{
			bodyMinHeight = defaultMinHeight;
			bodyMinWidth = defaultMinWidth;
		}
	});
}

//on windows load
window.addEventListener("load", function() {

	updateMinimumSize();

	//try to insert the resize button
	setInterval(function() { insertResizeButton(); }, 1000);

}, false);

function insertResizeButton() {
	updateLocalStorage();
	var elems = $(".mls.titlebarButtonWrapper");
	elems.each(function(el) {
		if($(this).children(".extresize").length == 0) {

			//add the resize button
			$(this).prepend('<a style="background-image:url( ' + chrome.extension.getURL('images/resize.png') + ');" class="extresize close button" data-ft="{&quot;tn&quot;:&quot;+\u003C&quot;}" role="button" tabindex="0" data-hover="tooltip" aria-label="Resize"></a>');
		
			//hide the annoying info box
			var chatBox = $(this).parents(".fbDockChatTabFlyout").eq(0);
			chatBox.find('.fbNubFlyoutHeader').eq(0).hide();

			//resize the window after we removed the info box
			var w = defaultWidth,
				h = defaultHeight;

			if(get("save")) {
				arr = getSaved($(this));
				console.log(arr);

				w = arr.w;
				h = arr.h;
			}

			resize(w, h, $(this));

			//drag events
			$(this).drag('start', function(ev, dd) {
				updateMinimumSize();
				var chatBox = $(this).parents(".fbDockChatTabFlyout").eq(0);
				dd.width = chatBox.width();
				dd.height = chatBox.height();
			});

			var elem = $(this);

			$(this).drag(function(ev, dd) {
				resize(dd.width - dd.deltaX, dd.height - dd.deltaY, elem);
			});

			$(this).drag('end', function() {
				save(elem);
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

	var parent = elem.parents(".fbNub").eq(0);
	var chatBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var chatBody = $(chatBox).find(".fbNubFlyoutBody").eq(0);

	var bodyHeight = h - bodyHeightDif; //height of the chatBody

	parent.css("width", w + "px");
	chatBox.css("width", w + "px");
	chatBox.css("height", h + "px");
	chatBody.css("height", bodyHeight + "px");
}

function getSaved(elem) {
	var chatBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var name = chatBox.find(".titlebarText").eq(0).html();
	name = name.replace(/\W/g, '')

	var arr = get("saved");

	if(arr != undefined && name in arr) {
		return arr[name];
	}else{
		return {w: defaultWidth, h: defaultHeight}
	}
}

function save(elem) {
	var chatBox = elem.parents(".fbDockChatTabFlyout").eq(0);
	var name = chatBox.find(".titlebarText").eq(0).html();
	name = name.replace(/\W/g, '')
	
	var arr = get("saved");

	if(arr == undefined) {
		arr = {};
	}

	arr[name] = {w: chatBox.width(), h: chatBox.height()};

	localStorage["saved"] = JSON.stringify(arr);

}