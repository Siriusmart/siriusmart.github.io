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
		for(let i = 0; i < items.length; i++) {
			items[i].classList.add(after);
		}
	}

	setTimeout(
		() => {
			window.location.href = url;
		},
		500
	);
}
