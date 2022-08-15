let box = document.getElementById('posts');
let text = box.getElementsByTagName('p')[0];
text.innerText = 'Loading content...';

window.addEventListener("message", ({data: res}) => {
	let data = JSON.parse(res.content);

	switch (res.type) {
		case 'post_index':
			let posts = data.slice(-3);

			box.removeChild(box.lastChild);

			for(post_id of posts) {
				let post = document.createElement('article');
				post.id = post_id;
				let title = document.createElement('h2');
				title.innerText = post_id;
				title.className = 'p';
				post.appendChild(title);

				let header = document.createElement('p');
				header.className = 'article-header';
				header.innerText = 'Loading content...';

				post.appendChild(header);
				box.appendChild(post);

				createIframe(`${window.env.filesUrl}?path=./posts/${post_id}.json&label=${post_id}&type=post_content`);
			}
			break;

		case 'post_content':
			let post = document.getElementById(res.label);
			let h2 = post.getElementsByTagName('h2')[0];
			let p = post.getElementsByTagName('p')[0];
			

			switch(data.type) {
				case 'blog':
					h2.innerText = data.content.title;
					p.innerText = data.content.header;

					let read_more = document.createElement('button');
					read_more.className = 'read_more';
					read_more.innerText = 'Read more';
					read_more.onclick = () => window.exit('./posts/view.html?id=${post_id}');

					let br = document.createElement('br');
					p.appendChild(br);

					p.appendChild(read_more);
					break;
			}

			break;
	}
});

createIframe(`${window.env.filesUrl}?path=./posts/index.json&type=post_index`);
