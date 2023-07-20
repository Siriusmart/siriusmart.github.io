document.getElementById("url").value = "";

function play() {
  let url = document.getElementById("url").value;
  if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    alert("Invalid url");
    return;
  }

  document.getElementById("inputs").classList.add("hide");

  let player = document.getElementById("player");

  player.setAttribute("src", url);
  player.classList.remove("hide");
}

document.getElementById("url").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    play();
  }
});
