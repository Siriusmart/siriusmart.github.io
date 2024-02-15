const good = ["bedfont cafe", "hatton cross station", "cisco cafe"];

function search() {
    let value = document.getElementById("searchbar").value.toLowerCase();
    
    if (value === "places near me to dine") {
        value = "cisco cafe"
    }

    if (good.includes(value)) {
        window.location.href = `./search-${value.replaceAll(" ", "")}.html?q=${encodeURIComponent(value)}`;
    } else {
        window.location.href = `./searchnotfound.html?q=${encodeURIComponent(value)}`;
    }
}

document.getElementById("magnifying-glass").onclick = search;

function getQueryParam() {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const qParam = urlParams.get("q");

    return qParam;
}

function capitalizeFirstLetters(str) {
    const words = str.split(" ");

    const capitalizedWords = words.map((word) => {
        const firstChar = word.charAt(0).toUpperCase();
        const restOfWord = word.slice(1);
        return firstChar + restOfWord;
    });

    const capitalizedStr = capitalizedWords.join(" ");

    return capitalizedStr;
}

let param = getQueryParam();

if (param !== null) {
    document.getElementById("searchbar").value = capitalizeFirstLetters(param);
}

document.querySelector("#searchbar").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        search();
    }
});
