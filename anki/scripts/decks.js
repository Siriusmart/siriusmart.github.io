async function decks() {
    const screen = document.getElementById("decks");
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

    function count(tree) {
        return (
            tree.cards.length +
            Object.values(tree.subtrees)
                .map(count)
                .reduce((a, b) => a + b, 0)
        );
    }

    function construct(tree, prepend) {
        let ul = document.createElement("ul");
        ul.classList.add("subdecks");

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

        for (const subtree of Object.keys(tree.subtrees).sort(sorter)) {
            let qualifier =
                prepend === undefined ? subtree : `${prepend}::${subtree}`;
            let name = document.createElement("span");
            name.innerText = subtree;
            name.classList.add("name");

            let cards = document.createElement("span");
            cards.innerText = count(tree.subtrees[subtree]);
            cards.classList.add("cards");

            let li = document.createElement("li");
            li.appendChild(name);
            li.appendChild(cards);
            li.setAttribute("qualifier", qualifier);
            li.onclick = ({ target }) => {
                let qualifier = null;
                let cursor = target;
                while (cursor.parentNode && qualifier === null) {
                    qualifier = cursor.getAttribute("qualifier");
                    cursor = cursor.parentNode;
                }
                let url = new URL(window.location.href);
                let oldParams = new URLSearchParams(url.search);
                let params = new URLSearchParams();
                params.set("screen", "single");
                params.set("package", oldParams.get("package"));
                params.set("deck", qualifier);
                url.search = params;
                window.location.href = url;
            };

            if (Object.keys(tree.subtrees[subtree].subtrees).length != 0) {
                li.appendChild(construct(tree.subtrees[subtree], qualifier));
            }

            ul.appendChild(li);
        }

        return ul;
    }

    screen.appendChild(construct(tree));
}
