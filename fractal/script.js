const canvas = document.getElementById("fractal");
const ctx = canvas.getContext("2d");

let expression;

let left = -2.5;
let right = 1.5;
let up = 1.5;
let iterations = 10;

let renderID = 0;

const workers = [];

for (let i = 0; i < 128; i++) {
    workers.push(new Worker("./worker.js"));
}

function render() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    renderID++;
    let currentRender = renderID;

    let scale = (right - left) / canvas.clientWidth;

    let workerIndex = 0;
    let max = canvas.clientHeight;
    let y = 0;

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
        });

        workers[workerIndex].onmessage = function (event) {
            let { x: pixelX, y: pixelY, fillStyle } = event.data;
            ctx.fillStyle = fillStyle;
            ctx.fillRect(pixelX, pixelY, 1, 1);

            if (y < max && renderID === currentRender) {
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
                });
            }
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

(document.getElementById("update").onclick = () => {
    up = parseFloat(document.getElementById("top").value);
    right = parseFloat(document.getElementById("right").value);
    left = parseFloat(document.getElementById("left").value);
    iterations = parseInt(document.getElementById("iterations").value);
    expression = document.getElementById("formula").value;
    window.onresize();
})();
