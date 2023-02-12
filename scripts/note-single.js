let container = document.getElementById("items");
container.innerText = "Loading content...";

let paramString = window.location.href.split("?")[1];
if (typeof paramString === "string") {
  paramString = paramString.split("#")[0];
}
let search_params = new URLSearchParams(paramString);
let level = search_params.get("level");
let subject = search_params.get("subject");
let id = search_params.get("id");

window.listeners.note_single = ({ content: data }) => {
  container.innerText = "";

  let levelLabel = document.createElement("p");
  levelLabel.innerText = "Waiting for note title...";
  levelLabel.id = "title";
  levelLabel.classList.add("float-in-bottom");
  container.appendChild(levelLabel);

  if (!titleAndEnd()) {
    createIframe(
      `${
        window.env.customNotesUrl
          ? window.env.customNotesUrl
          : window.env.notesUrl
      }?path=./${level}/${subject}/index.json&type=note_single_get_index`
    );
  }

  setTimeout(() => {
    let hr = document.createElement("hr");
    hr.classList.add("float-in-bottom");
    container.appendChild(hr);
    data = data
      .replace(
        "./",
        `${
          window.env.customNotesUrl
            ? window.env.customNotesUrl
            : window.env.notesUrl
        }/${level}/${subject}/`
      )
      .replace(
        "../",
        `${
          window.env.customNotesUrl
            ? window.env.customNotesUrl
            : window.env.notesUrl
        }/${level}/`
      );

    showdown.setOption("tables", true);
    let converter = new showdown.Converter(),
      text = data,
      html = converter.makeHtml(text);

    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add("float-in-bottom");
    renderMathInElement(div);

    setTimeout(() => {
      container.appendChild(div);
    });
  }, 500);
};

window.listeners.note_single_get_index = ({ content: data }) => {
  try {
    data = JSON.parse(data);
    localStorage[`notes-index-${level}-${subject}`] = JSON.stringify(data);
  } catch (e) {
    console.log("Error loading index.");
    return;
  }

  titleAndEnd();
};

function upOneLevel() {
  exit(`./note-index.html?level=${level}&subject=${subject}`);
}

function titleAndEnd() {
  let localStored = localStorage[`notes-index-${level}-${subject}`];

  if (localStored) {
    let obj = JSON.parse(localStored);
    let title;
    bigLoop: for (let i = 0; i < obj.items.length; i++) {
      for (let j = 0; j < obj.items[i].items.length; j++) {
        if (obj.items[i].items[j].id == id) {
          title = `${obj.items[i].items[j].title} - ${obj.title}`;
          setTimeout(() => {
            let end = document.createElement("div");
            end.className = "float-in-bottom";
            if (i !== 0 || j !== 0) {
              let prev_i = i;
              let prev_j = j - 1;
              if (j === 0) {
                prev_i = i - 1;
                prev_j = obj.items[i - 1].items.length - 1;
              }

              let previous_chapter = document.createElement("button");
              previous_chapter.innerText = `< ${prev_i + 1}.${prev_j + 1} ${
                obj.items[prev_i].items[prev_j].title
              }`;
              previous_chapter.style.float = "left";
              previous_chapter.onclick = () =>
                exit(
                  `./note.html?level=${level}&subject=${subject}&id=${obj.items[prev_i].items[prev_j].id}`
                );
              end.appendChild(previous_chapter);
            }

            if (
              i !== obj.items.length - 1 ||
              j !== obj.items[i].items.length - 1
            ) {
              let next_i = i;
              let next_j = j + 1;

              if (j === obj.items[i].items.length - 1) {
                next_i = i + 1;
                next_j = 0;
              }

              let next_chapter = document.createElement("button");
              next_chapter.innerText = `${next_i + 1}.${next_j + 1} ${
                obj.items[next_i].items[next_j].title
              } >`;
              next_chapter.style.float = "right";
              next_chapter.onclick = () =>
                exit(
                  `./note.html?level=${level}&subject=${subject}&id=${obj.items[next_i].items[next_j].id}`
                );
              end.appendChild(next_chapter);
            }

            if (end.children.length !== 0) {
              container.append(document.createElement("hr"));
            }

            container.appendChild(end);
          }, 1000);

          break bigLoop;
        }
      }
    }

    if (!title) {
      title = "Title not found";
    }

    document.title = title;
    document.getElementById("title").innerText = title;

    return true;
  } else {
    return false;
  }
}

createIframe(
  `${
    window.env.customNotesUrl ? window.env.customNotesUrl : window.env.notesUrl
  }?path=./${level}/${subject}/${id}.md&type=note_single`
);
