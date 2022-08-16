const animations = {
  'footer': 'footer-reverse',
  'float-in-top': 'float-in-top-reverse',
  'float-in-bottom': 'float-in-bottom-reverse',
  'float-in-left': 'float-in-left-reverse',
  'float-in-right': 'float-in-right-reverse',
  'delayed-float-in-right': 'float-in-right-reverse'
};

function exit(url) {
	for (const [before, after] of Object.entries(animations)) {
		let items = document.getElementsByClassName(before);
		for(const item of items) {
			item.classList.add(after);
		}
	}

	setTimeout(
		() => {
			for(const after of Object.values(animations)) {
				let items = document.getElementsByClassName(after);
				for(const item of items) {
					item.classList.remove(after);
				}

			}
			window.location.href = url;
		},
		500
	);
}
