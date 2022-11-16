let container = document.getElementById("items");
container.innerText = "Loading content...";

window.listeners.notes_index = ({ content: data }) => {
  try {
    data = JSON.parse(data);
  } catch (e) {
    container.innerText = "Error loading index.";
    return;
  }

  container.innerText = "";
  display_item(data);
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
  div.appendChild(h2);

  if (item.avaliable.length !== 0) {
    let h3 = document.createElement("h3");
    h3.innerText = "Avaliable";

    let ul = document.createElement("ul");

    for (const avaliable of item.avaliable) {
      let li = document.createElement("li");
      li.innerText = avaliable;
      ul.appendChild(li);
    }

    div.appendChild(h3);
    div.appendChild(ul);
  }

  if (item.wip.length !== 0) {
    let h3 = document.createElement("h3");
    h3.innerText = "WIP";

    let ul = document.createElement("ul");

    for (const wip of item.wip) {
      let li = document.createElement("li");
      li.innerText = wip;
      ul.appendChild(li);
    }

    div.appendChild(h3);
    div.appendChild(ul);
  }

  let button = document.createElement("button");
  button.onclick = () => exit(`./level.html?level=${item.path}`);
  button.innerText = "Go to notes";
  div.appendChild(button);

  container.appendChild(div);

  setTimeout(() => display_item(items), 300);
}

createIframe(
  `${
    window.env.customNotesUrl ? window.env.customNotesUrl : window.env.notesUrl
  }?path=./index.json&type=notes_index`
);
