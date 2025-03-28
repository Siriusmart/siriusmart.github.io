async function packages() {
    const screen = document.getElementById("packages");
    screen.innerHTML = "";
    const index = await fetchJSON("./packages.json");

    loaded();

    for (const id in index) {
        let pack = document.createElement("div");
        pack.classList.add("package");

        let title = document.createElement("div");
        title.innerText = index[id].name;
        title.classList.add("title");

        let author = document.createElement("div");
        author.innerText = index[id].author;
        author.classList.add("author");

        let date = document.createElement("div");
        date.innerText = `on ${index[id].date}`;
        date.classList.add("date");

        let url = document.createElement("span");
        url.href = index[id].url;
        url.innerText = "Open package";
        url.classList.add("url");

        let download = document.createElement("img");
        download.src = "./icons/download.svg";
        download.classList.add("download");
        download.classList.add("icon-colour");
        download.classList.add("icon-hover");
        download.onclick = (e) => {
            downloadDeck(id);
            e.stopPropagation();
        };

        let urlWrap = document.createElement("div");
        urlWrap.appendChild(url);
        urlWrap.appendChild(download);
        urlWrap.classList.add("urlWrap");

        pack.appendChild(title);
        pack.appendChild(author);
        pack.appendChild(date);
        pack.appendChild(urlWrap);
        screen.appendChild(pack);

        pack.onclick = () => {
            let url = new URL(window.location.href);
            let params = new URLSearchParams();
            params.set("screen", "decks");
            params.set("package", id);
            url.search = params;
            window.location.href = url;
        };
    }
}
