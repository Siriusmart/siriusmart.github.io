let box = document.getElementById('posts');
let text = box.getElementsByTagName('p')[0];
let indicator = document.getElementById('indicator');
text.innerText = 'Loading content...';

let total = undefined;
let loaded = 0;

function updateIndicator() {
	if(total === loaded) {
		indicator.remove();
	}

	indicator.innerText = `Loading content... ${loaded}/${total}`;
}

window.listeners.post_index = ({content}) => {
	let data = JSON.parse(content);
	let posts = data.slice(0, 3);

	total = posts.length;

	updateIndicator();

	for(let i = 0; i < posts.length; i++) {
		let post_id = posts[i];

		let post = document.createElement('article');
		post.id = post_id;
		let title = document.createElement('h2');
		title.innerText = post_id;
		post.appendChild(title);

		let header = document.createElement('p');
		header.className = 'article-header';
		header.innerText = 'Loading content...';

		post.appendChild(header);
		box.insertBefore(post, box.children[box.children.length - 2]);

		createIframe(`${window.env.filesUrl}?path=./posts/${post_id}.json&label=${post_id}&type=post_content`);
	}

}

window.listeners.post_content = (res) => {
	let data = JSON.parse(res.content);

	let post = document.getElementById(res.label);
	let h2 = post.getElementsByTagName('h2')[0];
	let p = post.getElementsByTagName('p')[0];

	loaded++;
	updateIndicator();
	

	switch(data.type) {
		case 'blog':
			h2.innerText = data.content.title;
			p.innerText = data.content.header;

			let read_more = document.createElement('button');
			read_more.className = 'button';
			read_more.innerText = 'Read more';
			read_more.onclick = () => window.exit(`./post.html?id=${res.label}`);

			let br = document.createElement('br');
			p.appendChild(br);

			p.appendChild(read_more);
			break;
	}
}

createIframe(`${window.env.filesUrl}?path=./posts/index.json&type=post_index`);
