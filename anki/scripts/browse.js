async function browse() {
    let renderQueue = [];
    let render = (item) => {
        renderQueue.push(item);
        return item;
    };

    let katexScript = document.createElement("script");
    katexScript.src =
        "https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.js";
    document.head.appendChild(katexScript);

    katexScript.onload = () => {
        let katexAutoScript = document.createElement("script");
        katexAutoScript.src =
            "https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.js";
        katexAutoScript.onload = () => {
            document.body.appendChild(katexAutoScript);
            render = renderMathInElement;
            for (const elem of renderQueue) {
                render(elem);
            }
        };
        document.body.appendChild(katexAutoScript);
    };

    let katexStyle = document.createElement("link");
    katexStyle.rel = "stylesheet";
    katexStyle.href = "https://cdn.jsdelivr.net/npm/katex/dist/katex.css";
    document.body.appendChild(katexStyle);

    const screen = document.getElementById("browse");
    screen.innerHTML = "";
    let url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    let index = await fetchJSON(`./${params.get("package")}/index.json`);
    loaded();

    let tree = { subtrees: {}, cards: [] };

    function createDeck(name, cards) {
        let chunks = name.split("::");
        let depth = 0;
        let subtree = tree;

        for (const chunk of chunks) {
            if (subtree.subtrees[chunk] === undefined) {
                subtree.subtrees[chunk] = {
                    subtrees: {},
                    cards: [],
                };
            }

            subtree = subtree.subtrees[chunk];
            depth++;

            if (depth == chunks.length) {
                subtree.cards = cards;
            }
        }
    }

    for (const name in index) {
        createDeck(name, index[name]);
    }

    function getTree(tree, chunks) {
        if (chunks.length == 0) return tree;

        return getTree(tree.subtrees[chunks[0]], chunks.slice(1));
    }

    function construct(tree) {
        function sorter(a, b) {
            function getInt(s) {
                let val = Number.MAX_SAFE_INTEGER;

                for (let i = 1; i < s.length; i++) {
                    try {
                        val = parseFloat(s.substring(0, i));
                    } catch (_e) {}
                }

                return val;
            }

            let aVal = getInt(a);
            let bVal = getInt(b);

            if (aVal == bVal) {
                return a < b ? -1 : 1;
            } else {
                return aVal - bVal;
            }
        }

        cards = cards.concat(tree.cards);

        for (const subtree of Object.keys(tree.subtrees).sort(sorter)) {
            cards = cards.concat(tree.cards);
            construct(tree.subtrees[subtree]);
        }
    }

    let cards = [];
    let fetched = 0;
    const pageSize = 20;

    async function fetchCards() {
        let button = document.getElementById("load");
        button.style.opacity = 0;
        button.id = "";

        let url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        let toFetch = cards.slice(fetched, fetched + pageSize);
        let front = [],
            back = [];
        let fetchedFront = fetchTexts(
            toFetch.map((id) => `./${params.get("package")}/front/${id}`),
        );
        let fetchedBack = fetchTexts(
            toFetch.map((id) => `./${params.get("package")}/back/${id}`),
        );

        for (const promise of fetchedFront) {
            let fetched = await promise;
            front.push(fetched);
        }

        for (const promise of fetchedBack) {
            let fetched = await promise;
            back.push(fetched);
        }

        fetched += front.length;

        for (let i = 0; i < front.length; i++) {
            addCard(front[i], back[i]);
        }

        if (fetched != cards.length) {
            button.style.opacity = 1;
            button.id = "load";
        }
    }

    function addCard(front, back) {
        let table = document.getElementById("table");

        let frontBox = document.createElement("td");
        frontBox.innerHTML = front;
        let backBox = document.createElement("td");
        backBox.innerHTML = back;

        render(frontBox);
        render(backBox);

        let row = document.createElement("tr");
        row.appendChild(frontBox);
        row.appendChild(backBox);

        table.appendChild(row);
    }

    let frontLabel = document.createElement("th");
    frontLabel.innerText = "Front";

    let backLabel = document.createElement("th");
    backLabel.innerText = "Back";

    let row = document.createElement("tr");
    row.appendChild(frontLabel);
    row.appendChild(backLabel);

    let table = document.createElement("table");
    table.appendChild(row);
    table.id = "table";

    screen.appendChild(table);

    let button = document.createElement("div");
    button.innerText = "Load more";
    button.id = "load";
    button.onclick = fetchCards;
    screen.appendChild(button);

    construct(getTree(tree, params.get("deck").split("::")));
    fetchCards();
}
