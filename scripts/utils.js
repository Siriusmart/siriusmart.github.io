function copy(element, text) {
  navigator.clipboard.writeText(text);
  element.innerText = "Copied to clipboard!";
}
