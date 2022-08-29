window.env = {
	filesUrl: 'https://files-host.siriusmart.repl.co',
	outReqUrl: 'https://server.siriusmart.repl.co/api/v1/utils/request-proxy/html'
}

try {
	window.cookies = JSON.parse(document.cookie);
} catch (e) {
	window.cookies = {};
}

function updateCookie() {
	document.cookie = JSON.stringify(window.cookies);
}

function decodeEntity(inputStr) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = inputStr;
    return textarea.value;
}

window.listeners = {};

window.addEventListener("message", ({data: message}) => {
	if(message.type !== undefined && typeof listeners[message.type] === 'function') {
		listeners[message.type](message);
	}
});
