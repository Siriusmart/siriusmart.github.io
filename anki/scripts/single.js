async function single() {
    const screen = document.getElementById("single");
    screen.innerHTML = "";
    let url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    let index = await fetchJSON(`./${params.get("package")}/index.json`);
    loaded();

    let cards = Object.keys(index)
        .filter((k) => k.startsWith(params.get("deck")))
        .reduce((a, b) => a + index[b].length, 0);

    let chunks = params.get("deck").split("::");

    let qualifier = document.createElement("span");
    qualifier.classList.add("qualifier");
    qualifier.innerText = chunks.slice(0, -1).join("::");

    let name = document.createElement("span");
    name.classList.add("name");
    name.innerText = chunks[chunks.length - 1];

    let title = document.createElement("div");
    title.appendChild(qualifier);
    title.appendChild(name);

    let counter = document.createElement("div");
    counter.classList.add("counter");
    counter.innerText = `${cards} cards in deck`;

    let shuffle = document.createElement("div");
    shuffle.innerText = "Shuffle";
    shuffle.classList.add("shuffle");
    shuffle.onclick = () => {
        let url = new URL(window.location.href);
        let oldParams = new URLSearchParams(url.search);
        let params = new URLSearchParams();
        params.set("screen", "shuffle");
        params.set("package", oldParams.get("package"));
        params.set("decks", oldParams.get("deck"));
        url.search = params;
        window.location.href = url;
    };

    let browse = document.createElement("div");
    browse.innerText = "Browse Deck";
    browse.classList.add("browse");
    browse.onclick = () => {
        let url = new URL(window.location.href);
        let oldParams = new URLSearchParams(url.search);
        let params = new URLSearchParams();
        params.set("screen", "browse");
        params.set("package", oldParams.get("package"));
        params.set("deck", oldParams.get("deck"));
        url.search = params;
        window.location.href = url;
    };

    let buttons = document.createElement("div");
    buttons.append(shuffle);
    buttons.append(browse);
    buttons.classList.add("buttons");

    screen.appendChild(qualifier);
    screen.appendChild(name);
    screen.appendChild(counter);
    screen.appendChild(buttons);
}
