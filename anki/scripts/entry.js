window.onload = tick;

// screens:
// packages
// decks{package=id}
function sanitise() {
    let url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    let sanitised = new URLSearchParams();

    switch (params.get("screen")) {
        case "decks":
            sanitised.append("screen", "decks");
            sanitised.append("package", params.get("package"));
            break;
        case "single":
            sanitised.append("screen", "single");
            sanitised.append("package", params.get("package"));
            sanitised.append("deck", params.get("deck"));
            break;
        case "browse":
            sanitised.append("screen", "browse");
            sanitised.append("package", params.get("package"));
            sanitised.append("deck", params.get("deck"));
            break;
        case "shuffle":
            sanitised.append("screen", "shuffle");
            sanitised.append("package", params.get("package"));
            sanitised.append("decks", params.get("decks"));
            sanitised.append(
                "count",
                params.get("count") === null ? 3 : params.get("count"),
            );
            break;
        case "packages":
        default:
            sanitised.append("screen", "packages");
    }

    url.search = sanitised;
    window.history.replaceState({}, "", url);
}

function showScreen() {
    let url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    const allScreen = ["packages", "decks", "single", "browse", "shuffle"];

    for (const scr of allScreen) {
        if (scr == params.get("screen"))
            document.getElementById(scr).removeAttribute("hidden");
        else document.getElementById(scr).hidden = true;
    }
}

function runScreen() {
    const handlers = {
        packages,
        decks,
        single,
        browse,
        shuffle,
    };

    let url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    handlers[params.get("screen")]();
}

function tick() {
    sanitise();
    showScreen();
    runScreen();
}
