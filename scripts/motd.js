let banner = document.getElementById("banner");
let bannerP = banner.getElementsByTagName("p")[0];

function setMotd(data) {
  let p = document.createElement("p");
  p.innerText = data.text;

  if (data.url) {
    let a = document.createElement("a");
    a.href = data.url;
    a.style.textDecoration = "none";
    a.appendChild(p);
    a.target = "_blank";
    p = a;
  }
  banner.removeChild(banner.lastChild);
  renderMathInElement(p);
  banner.appendChild(p);
}

if (localStorage.motdText) {
  bannerP.remove();
  setMotd({
    text: localStorage.motdText,
    url: localStorage.motdUrl,
  });
} else {
  bannerP.innerText = "Loading MOTD...";
}

window.listeners.motd = (res) => {
  let data = JSON.parse(res.content);

  let a = banner.getElementsByTagName("a")[0];

  if (a) {
    a.remove();
  } else {
    bannerP.remove();
  }

  setMotd(data);

  localStorage.motdText = data.text;
  if (data.url) {
    localStorage.motdUrl = data.url;
  } else {
    localStorage.removeItem("motdUrl");
  }
};

window.createIframe(
  `${
    window.env.customFilesUrl ? window.env.customFilesUrl : window.env.filesUrl
  }/index.html?path=./motd.json&type=motd`
);
