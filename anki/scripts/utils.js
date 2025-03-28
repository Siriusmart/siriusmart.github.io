async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        alert(`Fetch failed ${url}`);
    }
}

async function fetchText(url) {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch (error) {
        alert(`Fetch failed ${url}`);
    }
}

function fetchTexts(urls) {
    return urls.map(fetchText);
}

function loaded() {
    document.getElementById("loading").hidden = true;
}

function downloadDeck(name) {
    const link = document.createElement("a");
    link.href = `./${name}.apkg`;
    link.download = `${name}.apkg`;
    link.click();
}
