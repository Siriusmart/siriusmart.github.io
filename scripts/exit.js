function exit(url) {
  for (const [before, after] of Object.entries(window.transitionclasses)) {
    let items = document.getElementsByClassName(before);
    for (const item of items) {
      item.classList.add(after);
    }
  }

  setTimeout(() => (window.location.href = url), 500);
}
