let indicator = document.getElementById('indicator');
indicator.innerText = 'Loading posts...';

let paramString = window.location.href.split('?')[1];
let search_params = new URLSearchParams(paramString);
let page = Number(search_params.get('p'));
let number_per_page = Number(search_params.get('n'));

let max_page = undefined;

let arr = undefined;

if(!page) {
	page = 1;
}

if(!number_per_page) {
	number_per_page = 10;
}

let loaded = 0;
let total = undefined;

const timeout = 100;

function display(posts) { //recursive
	if (posts.length === 0) {
		let div = document.createElement('div');
		div.classList.add('centered');

		let start = page - 2;
		if(start < 1) {
			start = 1;
		}


		let end = page + 2;
		if(end > max_page) {
			end = max_page;
		}

		if(page > 1) {
			let first = document.createElement('button');
			first.innerText = '<<';
			first.classList.add('button');
			first.classList.add('square-button');
			first.onclick = () => window.exit(`./posts.html?p=1&n=${number_per_page}`);
			div.appendChild(first);

			let back = document.createElement('button');
			back.innerText = '<';
			back.classList.add('button');
			back.classList.add('square-button');
			back.onclick = () => window.exit(`./posts.html?p=${page-1}&n=${number_per_page}`);
			div.appendChild(back);
		}

		for(let i = start; i<=end;i++) {
			let button = document.createElement('button');
			button.innerText = i;
			button.classList.add('button');
			button.classList.add('square-button');
			button.onclick = () => window.exit(`./posts.html?p=${i}&n=${number_per_page}`);
			div.appendChild(button);
		}

		if(page < max_page) {
			let next = document.createElement('button');
			next.innerText = '>';
			next.classList.add('button');
			next.classList.add('square-button');
			next.onclick = () => window.exit(`./posts.html?p=${page + 1}&n=${number_per_page}`);
			div.appendChild(next);

			let last = document.createElement('button');
			last.innerText = '>>';
			last.classList.add('button');
			last.classList.add('square-button');
			last.onclick = () => window.exit(`./posts.html?p=${max_page}&n=${number_per_page}`);
			div.appendChild(last);
		}

		let container = document.createElement('div');

		container.appendChild(div);
		container.classList.add('container');
		container.classList.add('float-in-bottom');
		container.classList.add('centered-wrapper')

		document.body.appendChild(container);

		return;
	}

	const post = posts.pop();

	if(post === undefined) {
		display([]);
		return;
	}

	let div = document.createElement('div');
	div.classList.add('container');
	div.classList.add('float-in-right');

	let preview = document.createElement('div');
	preview.className = 'p';

	let h2 = document.createElement('h2');
	h2.innerText = post.title;
	preview.appendChild(h2);

	let p = document.createElement('p');
	p.innerText = `${post.preview} `;
	preview.appendChild(p);

	let button = document.createElement('button');
	button.className = 'button';
	button.innerText = 'Read more';
	button.onclick = () => window.exit(`./post.html?id=${post.id}`);
	p.appendChild(button);

	div.appendChild(preview);
	document.body.appendChild(div);

	setTimeout(() => display(posts), timeout);
}

function updateIndicator() {
		indicator.innerText = `Loading posts... (${loaded}/${total})`;
}

window.addEventListener('message', ({data: req}) => {
	let data = req.content;

	switch(req.type) {
		case 'posts-index':
			let posts = JSON.parse(data);
			max_page = Math.ceil(posts.length / number_per_page);

			let start = (page - 1) * number_per_page;

			posts = posts.slice(start, start + number_per_page);
			arr = new Array(posts.length);
			total = posts.length;

			if(posts.length === 0) {
				indicator.innerText = 'There seems to be no posts in this page.';
				display([]);
			}

			for(let i = 0; i < posts.length; i++) {
				window.createIframe(`${window.env.filesUrl}/index.html?path=./posts/${posts[i]}.json&type=post-preview&label=${JSON.stringify({index: start + i, id: posts[i]})}`);
			}
		 	updateIndicator();
			break;
		
		case 'post-preview':
			updateIndicator();
			let post = JSON.parse(data);
			let {index, id} = JSON.parse(req.label);

			arr[index] = {
				title: post.content.title,
				id,
				preview: post.content.header,
				// type: post.type,
			};

			loaded++;

			
			if(loaded === total) {
				indicator.parentNode.remove();
				display(arr);
			}

	}
});

window.createIframe(`${window.env.filesUrl}/index.html?path=./posts/index.json&type=posts-index`);
