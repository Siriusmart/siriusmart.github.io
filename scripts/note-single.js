let container = document.getElementById("items");
container.innerText = "Loading content...";

let paramString = window.location.href.split('?')[1];
if(typeof paramString === 'string') {
	paramString = paramString.split('#')[0];
}
let search_params = new URLSearchParams(paramString);
let level = search_params.get("level");
let subject = search_params.get("subject");
let id = search_params.get("id");
let title = search_params.get("title");

window.listeners.note_single = ({ content: data }) => {
  container.innerText = "";

  document.title = title;

  let levelLabel = document.createElement("p");
  levelLabel.innerText = title;
  levelLabel.classList.add("float-in-bottom");
  container.appendChild(levelLabel);

  setTimeout(() => {
    let hr = document.createElement("hr");
    hr.classList.add("float-in-bottom");
    container.appendChild(hr);

    showdown.setOption("tables", true);
    let converter = new showdown.Converter(),
      text = data,
      html = converter.makeHtml(text);

    setTimeout(() => {
      let div = document.createElement("div");
      div.innerHTML = html;
      div.classList.add("float-in-bottom");

      container.appendChild(div);
    });
  }, 500);
};

function upOneLevel() {
  exit(`./note-index.html?level=${level}&subject=${subject}`);
}

createIframe(
  `${window.env.notesUrl}?path=./${level}/${subject}/${id}.md&type=note_single`
);
