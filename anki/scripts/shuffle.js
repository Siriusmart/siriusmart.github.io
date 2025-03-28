async function shuffle() {
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

    let screen = document.getElementById("shuffle");

    const checkBoxes = document.createElement("div");
    checkBoxes.innerHTML = "";
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

            let checkBox = document.createElement("input");
            checkBox.setAttribute("type", "checkbox");
            checkBox.id = qualifier;

            let name = document.createElement("span");
            name.innerText = subtree;
            name.classList.add("name");

            let li = document.createElement("li");
            li.appendChild(checkBox);
            li.appendChild(name);
            li.setAttribute("qualifier", qualifier);
            checkBox.onclick = ({ target }) => {
                let qualifier = null;
                let cursor = target.parentNode.parentNode;

                Array.from(
                    target.parentNode.getElementsByTagName("input"),
                ).forEach((box) => {
                    box.checked = target.checked;
                });

                while (cursor.parentNode && qualifier === null) {
                    if (cursor.tagName == "LI") {
                        cursor.getElementsByTagName("input")[0].checked =
                            Array.from(cursor.getElementsByTagName("input"))
                                .slice(1)
                                .every((box) => box.checked);
                    }

                    cursor = cursor.parentNode;
                }
            };

            if (Object.keys(tree.subtrees[subtree].subtrees).length != 0) {
                li.appendChild(construct(tree.subtrees[subtree], qualifier));
            }

            ul.appendChild(li);
        }

        return ul;
    }

    checkBoxes.appendChild(construct(tree));

    let showSettings = false;

    let collapse = document.createElement("div");
    collapse.classList.add("collapse");

    let cardNumberLabel = document.createElement("span");
    cardNumberLabel.innerText = "Number of cards";
    cardNumberLabel.classList.add("cardNoLabel");
    let cardNumberInput = document.createElement("input");
    cardNumberInput.setAttribute("type", "number");
    cardNumberInput.value = 3;
    cardNumberInput.classList.add("cardNumInput");

    let cardNumberWrapper = document.createElement("div");
    cardNumberWrapper.id = "cardNumberWrapper";
    cardNumberWrapper.appendChild(cardNumberLabel);
    cardNumberWrapper.appendChild(cardNumberInput);

    let settings = document.createElement("div");
    settings.id = "settings";
    settings.appendChild(collapse);
    settings.appendChild(cardNumberWrapper);
    settings.appendChild(checkBoxes);

    let cardScreen = document.createElement("div");
    cardScreen.classList.add("cardScreen");

    let generate = document.createElement("div");
    generate.innerText = "Generate cards";
    generate.classList.add("generate");

    screen.appendChild(cardScreen);
    screen.appendChild(generate);
    screen.appendChild(settings);

    function collapseTick() {
        if (showSettings) {
            Array.from(settings.children)
                .slice(1)
                .forEach((child) => child.removeAttribute("hidden"));
            collapse.innerText = "Hide settings ⮞";
        } else {
            Array.from(settings.children)
                .slice(1)
                .forEach((child) => (child.hidden = true));
            collapse.innerText = "Show settings ⮟";
        }
        showSettings = !showSettings;
    }

    collapse.onclick = collapseTick;
    collapseTick();

    function walkTree() {
        let decks = [];

        for (const span of Array.from(
            document.getElementsByClassName("name"),
        )) {
            let input = span.parentNode.getElementsByTagName("input")[0];
            let name = input.getAttribute("id");

            if (input.checked && index[name] !== undefined) {
                decks.push(name);
            }
        }

        return decks.flatMap((deck) => index[deck]);
    }

    function walkDecks() {
        let decks = [];

        for (const span of Array.from(
            document.getElementsByClassName("name"),
        )) {
            let input = span.parentNode.getElementsByTagName("input")[0];
            let name = input.getAttribute("id");

            if (decks.some((deckName) => name.startsWith(deckName))) {
                continue;
            }

            if (input.checked) {
                decks.push(name);
            }
        }

        return decks;
    }

    function fromUrl() {
        let url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        let enabled = params.get("decks").split("$-$");
        cardNumberInput.value = params.get("count");
        for (const name of Array.from(
            document.getElementsByClassName("name"),
        )) {
            let checkBox = name.parentNode.getElementsByTagName("input")[0];
            if (enabled.includes(checkBox.getAttribute("id"))) {
                checkBox.click();
            }
        }
    }

    fromUrl();

    let cards;

    function putCard(cardHolder, front, back, id) {
        let frontTag = `<div class="frontTag">[Front]</div>`;
        let backTag = `<div class="backTag">[Back]</div>`;

        let isFront = true;

        cardHolder.onclick = () => {
            cardHolder.innerHTML = isFront ? frontTag : backTag;
            if (isFront) {
                cardHolder.innerHTML += front;
            } else {
                cardHolder.innerHTML += back;
            }
            render(cardHolder);
            isFront = !isFront;

            let kickButton = document.createElement("img");
            kickButton.src = "./icons/shuffle.svg";
            kickButton.id = "kickButton";
            kickButton.onclick = (e) => {
                kick(cardHolder);
                e.stopPropagation();
            };

            let deleteButton = document.createElement("img");
            deleteButton.src = "./icons/delete.svg";
            deleteButton.id = "deleteButton";
            deleteButton.onclick = (e) => {
                cardHolder.outerHTML = "";
                e.stopPropagation();
            };

            let cardButtons = document.createElement("div");
            cardButtons.appendChild(kickButton);
            cardButtons.appendChild(deleteButton);
            cardButtons.classList.add("card-buttons");
            cardHolder.appendChild(cardButtons);
        };
        cardHolder.setAttribute("id", id);
        cardHolder.onclick();
    }

    async function kick(box) {
        if (cards.length == 0) {
            let shownCards = Array.from(
                document.getElementsByClassName("cardHolder"),
            ).map((elem) => parseInt(elem.getAttribute("id")));
            cards = walkTree().filter((id) => !shownCards.includes(id));
        }

        let index = Math.floor(Math.random() * cards.length);
        let id = cards[index];
        cards.splice(index, 1);
        let frontTag = `<div class="frontTag">[Front]</div>`;
        let backTag = `<div class="backTag">[Back]</div>`;
        box.innerHTML = "";

        let fetches = fetchTexts([
            `./${params.get("package")}/front/${id}`,
            `./${params.get("package")}/back/${id}`,
        ]);

        putCard(box, await fetches[0], await fetches[1], id);
    }

    generate.onclick = async () => {
        let url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        params.set("decks", walkDecks().join("$-$"));
        params.set("count", cardNumberInput.valueAsNumber);
        url.search = params;
        window.history.replaceState({}, "", url);

        cards = walkTree();

        let toFetch = [];

        for (
            let i = 0;
            i < cardNumberInput.valueAsNumber && cards.length != 0;
            i++
        ) {
            let index = Math.floor(Math.random() * cards.length);
            toFetch.push(cards[index]);
            cards.splice(index, 1);
        }

        cardScreen.innerText = "Loading...";

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

        cardScreen.innerHTML = "";

        for (let i = 0; i < front.length; i++) {
            let cardHolder = document.createElement("div");
            cardHolder.classList.add("cardHolder");
            cardScreen.appendChild(cardHolder);

            putCard(cardHolder, front[i], back[i], toFetch[i]);
        }
    };

    generate.onclick();
}
