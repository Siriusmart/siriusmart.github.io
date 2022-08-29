let banner = document.getElementById('banner');
let bannerP = banner.getElementsByTagName('p')[0];

function setMotd(data) {
	let p = document.createElement('p');
	p.innerText = data.text;

	if(data.url) {
		let a = document.createElement('a');
		a.href = data.url;
		a.style.textDecoration = 'none';
		a.appendChild(p);
		a.target = '_blank';
		p = a;
	}
	banner.appendChild(p);
}

if(window.cookies.motd) {
	bannerP.remove();
	setMotd(window.cookies.motd);
} else {
	bannerP.innerText = 'Loading MOTD...';
}

window.listeners.motd = (res) => {
	let data = JSON.parse(res.content);

	let a =banner.getElementsByTagName('a')[0];

	if(a) {
		a.remove();
	} else {
		bannerP.remove();
	}

	setMotd(data);

	if(data !== window.cookies.motd) {
		window.cookies.motd = data;
		window.updateCookie();
	}
}

window.createIframe(`${window.env.filesUrl}/index.html?path=./motd.json&type=motd`)
