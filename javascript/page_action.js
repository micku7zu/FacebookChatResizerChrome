function onChangeCheckbox(e) {
	localStorage[e.srcElement.name] = JSON.stringify(e.srcElement.checked);
}

var checks = ['min', 'save'];

for(var i in checks) {
	var elem = document.getElementById(checks[i]);

	elem.checked = JSON.parse(localStorage[checks[i]]);
	elem.onchange = onChangeCheckbox;
}
