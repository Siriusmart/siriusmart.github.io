let header = document.getElementById('header');
let headerP = header.getElementsByTagName('p')[0];
headerP.style.paddingLeft = '3vw';
headerP.innerText = 'Loading article...';

document.title = 'Loading article';

let paramString = window.location.href.split('?')[1];
let id = new URLSearchParams(paramString).get('id');

window.addEventListener('message', ({data: req}) => {
	let data = req.content;
	switch(req.type) {
		case 'article-json':
			try {
				data = JSON.parse(data);
				headerP.remove();

				let h1 = document.createElement('h1');
				let p = document.createElement('p');
				h1.innerText = data.content.title;
				p.innerText = data.content.header;
				p.style.paddingLeft = '3vw';
				
				header.appendChild(h1);
				header.appendChild(p);

				document.title = data.content.title;

				switch(data.type) {
					case 'blog':
						window.createIframe(`${window.env.filesUrl}/index.html?path=./posts/${id}.md&type=article-md&label=${encodeURIComponent(data.content.title)}`);
				}
			} catch (e) {
				headerP.innerText = 'No such article.'
			}
			break;

		case 'article-md':
			let container = document.createElement('div');
			container.classList.add('container');
			container.classList.add('float-in-bottom');

			let title = document.createElement('h1');
			title.innerText = decodeURIComponent(req.label);

			let article = document.createElement('article');
			let html = window.markdown(data);
			article.innerHTML += html;
			article.style.paddingLeft = '3vw'

			let div = document.createElement('div')
			div.appendChild(article);

			container.appendChild(title);
			container.appendChild(div);

			document.getElementById('header-container').remove();
			document.body.appendChild(container);
	}
});

window.createIframe(`${window.env.filesUrl}/index.html?path=./posts/${id}.json&type=article-json`);
