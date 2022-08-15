window.env = {
	filesUrl: 'https://files-host.siriusmart.repl.co'
}

try {
	window.cookies = JSON.parse(document.cookie);
} catch (e) {
	window.cookies = {};
}

function updateCookie() {
	document.cookie = JSON.stringify(window.cookies);
}
