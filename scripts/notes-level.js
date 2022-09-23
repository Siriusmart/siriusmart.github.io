let container = document.getElementById("items");
container.innerText = "Loading content...";

let paramString = window.location.href.split("?")[1].split("#")[0];
let search_params = new URLSearchParams(paramString);
let level = search_params.get("level");

window.listeners.notes_level = ({ content: data }) => {
  try {
    data = JSON.parse(data);
  } catch (e) {
    container.innerText = "Error loading index.";
    return;
  }

  container.innerText = "";

  document.title = data.title;

  let levelLabel = document.createElement("p");
  levelLabel.innerText = data.title;
  levelLabel.classList.add("float-in-bottom");
  container.appendChild(levelLabel);

  setTimeout(() => display_item(data.items), 500);
};

function display_item(items) {
  if (items.length === 0) {
    return;
  }

  let item = items.shift();

  let div = document.createElement("div");
  div.classList.add("float-in-bottom");

  let hr = document.createElement("hr");
  div.appendChild(hr);

  let h2 = document.createElement("h2");
  h2.innerText = item.title;
  if (item.wip) {
    h2.innerText += " (WIP)";
  }
  div.appendChild(h2);

  if (item.notes) {
    let p = document.createElement("p");
    p.innerText = item.notes;
    div.appendChild(p);
  }

  let button = document.createElement("button");
  button.onclick = () =>
    exit(`./note-index.html?level=${level}&subject=${item.path}`);
  button.innerText = "Go to notes";
  div.appendChild(button);

  container.appendChild(div);

  setTimeout(() => display_item(items), 300);
}

createIframe(
  `${window.env.notesUrl}?path=./${level}/index.json&type=notes_level`
);
