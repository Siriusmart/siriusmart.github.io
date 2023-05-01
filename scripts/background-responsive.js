let background = document.getElementById("main-screen");
let projects = document.getElementById("projects");
let resources = document.getElementById("resources");
let lastKnownPositions = {
  scroll: window.scrollY,
  mouseX: 0,
  mouseY: 0,
};

let maxLength = Math.sqrt(
  Math.pow(screen.width / 2, 2) + Math.pow(screen.height, 2)
);

window.addEventListener(
  "load",
  backgroundMouseUpdate({
    pageX: Math.random() * screen.width,
    pageY: Math.random() * screen.height,
  })
);
window.addEventListener("mousemove", backgroundMouseUpdate);
window.addEventListener("scroll", scrollUpdate);

function backgroundMouseUpdate(e) {
  // console.table({ x: e.pageX, y: e.pageY, mouseX: lastKnownPositions.mouseX });
  lastKnownPositions.mouseX = e.pageX;
  lastKnownPositions.mouseY = e.pageY;
  let x = lastKnownPositions.mouseX - screen.width / 2;
  let y = lastKnownPositions.mouseY;
  let rad = -Math.atan(x / (y + 500)) / 2;
  background.style.setProperty("--rad", rad + "rad");
  background.style.setProperty(
    "--length",
    ((Math.abs(Math.tan(rad) / 2) + 0.5) *
      Math.sqrt(Math.pow(x, 2) + Math.pow(y + 100, 2))) /
      2 +
      maxLength / 2 +
      "px"
  );

  projects.style.setProperty("--x", e.pageX + "px");
  projects.style.setProperty(
    "--y",
    e.pageY - (window.pageYOffset + projects.getBoundingClientRect().top) + "px"
  );

  let offset =
    y -
    (window.pageYOffset + resources.getBoundingClientRect().top) +
    screen.height;

  resources.style.setProperty(
    "--length",
    // screen.width / 2 / Math.tan(-0.5) +
    Math.sqrt(Math.pow(screen.width / 2, 2) + Math.pow(offset, 2)) -
      screen.height +
      x / 4 +
      "px"
  );
  resources.style.setProperty(
    "--rad",
    (offset * 1.5) / screen.height + "rad"
  );
}

function scrollUpdate() {
  lastKnownPositions.mouseY += window.scrollY - lastKnownPositions.scroll;
  lastKnownPositions.scroll = window.scrollY;

  backgroundMouseUpdate({
    pageX: lastKnownPositions.mouseX,
    pageY: lastKnownPositions.mouseY,
  });
}
