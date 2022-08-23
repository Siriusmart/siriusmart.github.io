window.env = {
	filesUrl: 'https://files-host.siriusmart.repl.co',
	outReqUrl: 'http://3.74.146.72:54033/utils/request-proxy/html'
}

try {
	window.cookies = JSON.parse(document.cookie);
} catch (e) {
	window.cookies = {};
}

function updateCookie() {
	document.cookie = JSON.stringify(window.cookies);
}
