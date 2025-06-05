const canvas = document.getElementById("fractal");
const ctx = canvas.getContext("2d");

let expression;

let left = -3;
let right = 1.7;
let up = 1.2;
let iterations = 20;
let intensity = 0.05;
let cutoff = 10000;
let threshold = 2;

let renderID = 0;

const workers = [];

for (let i = 0; i < 16; i++) {
    workers.push(new Worker("./worker.js"));
}

function render() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    renderID++;

    for (let worker of workers) {
        worker.postMessage({
            setRenderId: renderID,
        });
    }

    let currentRender = renderID;

    let scale = (right - left) / canvas.clientWidth;

    let workerIndex = 0;
    let max = canvas.clientHeight;
    let y = 0;
    let start = Date.now();

    for (let i = 0; i < Math.min(max, workers.length); i++) {
        workers[workerIndex].postMessage({
            y: y++,
            scale,
            width: canvas.clientWidth,
            left,
            right,
            up,
            scale,
            expr: expression,
            iterations,
            intensity,
            currentRender,
            cutoff,
            threshold: threshold ** 2,
        });

        workers[workerIndex].onmessage = function (event) {
            let {
                x: pixelX,
                y: pixelY,
                fillStyle,
                currentRender,
                doneRow,
            } = event.data;
            if (doneRow && y >= max) console.log(Date.now() - start);
            if (doneRow && y < max && renderID === currentRender) {
                workers[workerIndex].postMessage({
                    y: y++,
                    scale,
                    width: canvas.clientWidth,
                    left,
                    right,
                    up,
                    scale,
                    expr: expression,
                    iterations,
                    intensity,
                    currentRender,
                    cutoff,
                    threshold: threshold ** 2,
                });
            }
            if (currentRender != renderID) return;
            ctx.fillStyle = fillStyle;
            ctx.fillRect(pixelX, pixelY, 1, 1);
        };

        workerIndex = (workerIndex + 1) % workers.length;
    }
}

let debounce = 1000;
let debounceUntil = 0;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function debounceRender() {
        let now = Date.now();
        debounceUntil = now + debounce;

        function tryRender() {
            let now = Date.now();
            if (debounceUntil == 0) return;
            if (now > debounceUntil) {
                debounceUntil = 0;
                render();
            } else setTimeout(tryRender, debounceUntil - now);
        }

        tryRender();
    }

    debounceRender();
};

{
    let params = new URLSearchParams(window.location.search);
    if (params.get("top") !== null)
        document.getElementById("top").value = params.get("top");
    if (params.get("right") !== null)
        document.getElementById("right").value = params.get("right");
    if (params.get("left") !== null)
        document.getElementById("left").value = params.get("left");
    if (params.get("iterations") !== null)
        document.getElementById("iterations").value = params.get("iterations");
    if (params.get("expression") !== null)
        document.getElementById("formula").value = params.get("expression");
    if (params.get("intensity") !== null)
        document.getElementById("intensity").value = params.get("intensity");
    if (params.get("cutoff") !== null)
        document.getElementById("cutoff").value = params.get("cutoff");
    if (params.get("threshold") !== null)
        document.getElementById("threshold").value = params.get("threshold");
}

(document.getElementById("update").onclick = () => {
    up = parseFloat(document.getElementById("top").value);
    right = parseFloat(document.getElementById("right").value);
    left = parseFloat(document.getElementById("left").value);
    iterations = parseInt(document.getElementById("iterations").value);
    expression = document.getElementById("formula").value;
    intensity = document.getElementById("intensity").value;
    cutoff = document.getElementById("cutoff").value;
    threshold = document.getElementById("threshold").value;

    let params = new URLSearchParams();
    params.set("top", up);
    params.set("right", right);
    params.set("left", left);
    params.set("iterations", iterations);
    params.set("expression", expression);
    params.set("intensity", intensity);
    params.set("cutoff", cutoff);
    params.set("threshold", threshold);
    window.history.replaceState(null, null, `?${params.toString()}`);

    if (renderID == 0) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    } else window.onresize();
})();

document.getElementById("options").classList.add("hover-hide");
