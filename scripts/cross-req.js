window.createIframe = (url) => {
	let iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	document.body.appendChild(iframe);
	iframe.contentWindow.location.href = url;
}
