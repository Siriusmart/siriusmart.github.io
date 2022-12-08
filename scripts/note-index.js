let container = document.getElementById("items");
container.innerText = "Loading content...";

let paramString = window.location.href.split("?")[1];
if (typeof paramString === "string") {
  paramString = paramString.split("#")[0];
}
let search_params = new URLSearchParams(paramString);
let level = search_params.get("level");
let subject = search_params.get("subject");

window.listeners.note_index = ({ content: data }) => {
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

  setTimeout(() => {
    let hr = document.createElement("hr");
    hr.classList.add("float-in-bottom");
    container.appendChild(hr);
    display_items(data.items, data.title);
  }, 500);
};

function display_items(items, title) {
  if (items.length === 0) {
    return;
  }

  let item = items.shift();

  let div = document.createElement("div");
  div.classList.add("float-in-bottom");
  container.appendChild(div);

  setTimeout(() => {
    let h2 = document.createElement("h2");
    h2.innerText = item.title;
    h2.classList.add("float-in-bottom");
    container.appendChild(h2);

    let ol = document.createElement("ol");
    container.appendChild(ol);

    display_item(item.items, ol, title);
  }, 20);

  setTimeout(() => display_items(items, title), 120 + 20 * item.items.length);
}

function display_item(chapters, container, title) {
  if (chapters.length === 0) {
    return;
  }

  let chapter = chapters.shift();

  let button = document.createElement("button");
  button.innerText = chapter.title;
  button.onclick = () =>
    exit(
      `./note.html?level=${level}&subject=${subject}&id=${chapter.id}&title=${chapter.title} - ${title}`
    );
  let li = document.createElement("li");
  li.appendChild(button);
  li.classList.add("float-in-bottom");
  container.appendChild(li);

  setTimeout(() => display_item(chapters, container, title), 30);
}

function upOneLevel() {
  exit(`./level.html?level=${level}`);
}

createIframe(
  `${
    window.env.customNotesUrl ? window.env.customNotesUrl : window.env.notesUrl
  }?path=./${level}/${subject}/index.json&type=note_index`
);
