document.getElementById("jscheck").remove();

let instances = document.getElementById("instances-container");
let instance = document.getElementById("instances");
instances.classList.add("unblurred");

let videoName = undefined;
let inputs = document.getElementById("inputs");
let messages = document.getElementById("messages");
let url = document.getElementById("url");
let inputsContainer = document.getElementsByClassName("nourl")[0];
let downloads = null;
url.value = "";
inputs.classList.add("unblurred");

let button = document.getElementById("convert");

function extractId(url) {
  if (url.length === 11) {
    return url;
  }

  let id = undefined;

  let patterns = ["e/", "v/", "v=", "vi=", "vi/", "embed/"];

  for (const pattern of patterns) {
    let index = url.indexOf(pattern);
    if (index !== -1) {
      id = url.substring(index + pattern.length, +index + pattern.length + 11);
    }
  }

  return id;
}

url.addEventListener("focus", () => {
  inputsContainer.classList.remove("withurl");
  inputsContainer.classList.add("nourl");
});

url.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    convert();
  }
});

function convert() {
  inputsContainer.classList.remove("withurl");
  inputsContainer.classList.add("nourl");
  let toRemoves = document.getElementsByClassName("info");

  for (let i = 0; i < toRemoves.length; i++) {
    let item = toRemoves[i];
    item.classList.add("float-in-left-reverse");
  }

  setTimeout(() => {
    while (toRemoves.length) {
      toRemoves[0].remove();
    }
  }, 500);

  if (!url.value) {
    messages.innerText = "No url provided";
    messages.style.color = "red";
    return;
  }

  let id = extractId(url.value);

  if (id === undefined) {
    messages.innerText = "Invalid url format";
    messages.style.color = "red";
    return;
  } else {
    messages.innerText = "Converting...";
    messages.style.color = "cyan";
  }

  window.createIframe(
    `${
      window.env.customOutReqUrl
        ? window.env.customOutReqUrl
        : window.env.outReqUrl
    }?url=${instance.value}/api/v1/videos/${id}&type=video`
  );
}

function process(data) {
  let thumbnail = data.videoThumbnails[0].url;
  let video = [];
  let audioOnly = [];
  let videoOnly = [];
  let captions = [];

  for (const file of data.formatStreams) {
    video.push({
      url: file.url,
      format: file.container,
      fps: file.fps,
      resolution: file.resolution,
    });
  }

  for (const file of data.adaptiveFormats) {
    if (file.container === undefined) {
      continue;
    }
    let type = file.type.split(";")[0].split("/")[0];
    switch (type) {
      case "audio":
        audioOnly.push({
          url: file.url,
          format: file.container,
          encoding: file.encoding,
          sampleRate: file.audioSampleRate,
          stereo: file.audioChannels > 1,
          bitrate: Math.round(parseInt(file.bitrate) / 1024),
        });
        break;
      case "video":
        videoOnly.push({
          url: file.url,
          format: file.container,
          encoding: file.encoding,
          resolution: file.resolution,
          fps: file.fps,
          bitrate: Math.round(parseInt(file.bitrate) / 1024),
        });
    }
  }

  for (const file of data.captions) {
    captions.push({
      url: `${instance}${file.url}`,
      label: file.label,
    });
  }

  return {
    captions,
    thumbnail,
    video,
    videoOnly,
    audioOnly,
  };
}

function displayInfo(thumbnail) {
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("float-in-right");
  container.classList.add("info");

  let title = document.createElement("h2");
  title.innerText = videoName;

  container.appendChild(title);

  document.body.appendChild(container);

  let img = document.createElement("img");
  let width = container.offsetWidth;
  if (width >= 640) {
    width = 640;
  }
  height = (width * 9) / 16;
  img.src = thumbnail;
  img.width = width;
  img.height = height;
  container.appendChild(img);
}

function displayVideos(videos) {
  if (videos.length === 0) {
    return;
  }
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("float-in-right");
  container.classList.add("info");

  let h3 = document.createElement("h3");
  h3.innerText = "Videos";
  container.appendChild(h3);
  let table = document.createElement("table");

  {
    let tr = document.createElement("tr");
    let format = document.createElement("th");
    format.innerText = "Format";
    let resolution = document.createElement("th");
    resolution.innerText = "Resolution";
    let framerate = document.createElement("th");
    framerate.innerText = "Frame rate";

    tr.appendChild(format);
    tr.appendChild(resolution);
    tr.appendChild(framerate);
    table.appendChild(tr);
  }

  for (const file of videos) {
    let tr = document.createElement("tr");
    let format = document.createElement("th");
    format.innerText = file.format;
    let resolution = document.createElement("th");
    resolution.innerText = file.resolution;
    let framerate = document.createElement("th");
    framerate.innerText = `${file.fps}fps`;

    let a = document.createElement("a");
    a.href = file.url;
    a.download = videoName;
    a.target = "_blank";
    a.style.textDecoration = "none";
    let button = document.createElement("button");
    button.innerText = "Download";
    button.className = "button";
    a.appendChild(button);

    tr.appendChild(format);
    tr.appendChild(resolution);
    tr.appendChild(framerate);
    tr.appendChild(a);
    table.appendChild(tr);
  }

  container.appendChild(table);
  document.body.appendChild(container);
}

function displayAudio(audio) {
  if (audio.length === 0) {
    return;
  }
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("float-in-right");
  container.classList.add("info");

  let h3 = document.createElement("h3");
  h3.innerText = "Audio";
  container.appendChild(h3);
  let table = document.createElement("table");

  {
    let tr = document.createElement("tr");
    let format = document.createElement("th");
    format.innerText = "Format";
    let encoding = document.createElement("th");
    encoding.innerText = "Encoding";
    let sampleRate = document.createElement("th");
    sampleRate.innerText = "Sample rate";
    let bitrate = document.createElement("th");
    bitrate.innerText = "Bitrate";

    tr.appendChild(format);
    tr.appendChild(encoding);
    tr.appendChild(sampleRate);
    tr.appendChild(bitrate);
    table.appendChild(tr);
  }

  for (const file of audio) {
    let tr = document.createElement("tr");
    let format = document.createElement("th");
    format.innerText = file.format;
    let encoding = document.createElement("th");
    encoding.innerText = file.encoding;
    let samplerate = document.createElement("th");
    samplerate.innerText = file.sampleRate;
    let bitrate = document.createElement("th");
    bitrate.innerText = `${file.bitrate}kb/s`;

    let a = document.createElement("a");
    a.href = file.url;
    a.download = videoName;
    a.target = "_blank";
    a.style.textDecoration = "none";
    let button = document.createElement("button");
    button.innerText = "Download";
    button.className = "button";
    a.appendChild(button);

    tr.appendChild(format);
    tr.appendChild(encoding);
    tr.appendChild(samplerate);
    tr.appendChild(bitrate);
    tr.appendChild(a);
    table.appendChild(tr);
  }

  container.appendChild(table);
  document.body.appendChild(container);
}

function displayVideoOnly(video) {
  if (video.length === 0) {
    return;
  }
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("float-in-right");
  container.classList.add("info");

  let h3 = document.createElement("h3");
  h3.innerText = "Video Only";
  container.appendChild(h3);
  let table = document.createElement("table");

  {
    let tr = document.createElement("tr");
    let format = document.createElement("th");
    format.innerText = "Format";
    let encoding = document.createElement("th");
    encoding.innerText = "Encoding";
    let sampleRate = document.createElement("th");
    sampleRate.innerText = "Sample rate";
    let fps = document.createElement("th");
    fps.innerText = "Frame rate";
    let bitrate = document.createElement("th");
    bitrate.innerText = "Bitrate";

    tr.appendChild(format);
    tr.appendChild(encoding);
    tr.appendChild(sampleRate);
    tr.appendChild(fps);
    tr.appendChild(bitrate);
    table.appendChild(tr);
  }

  for (const file of video) {
    let tr = document.createElement("tr");
    let format = document.createElement("th");
    format.innerText = file.format;
    let encoding = document.createElement("th");
    encoding.innerText = file.encoding;
    let resolution = document.createElement("th");
    resolution.innerText = file.resolution;
    let fps = document.createElement("th");
    fps.innerText = `${file.fps}fps`;
    let bitrate = document.createElement("th");
    bitrate.innerText = `${file.bitrate}kb/s`;

    let a = document.createElement("a");
    a.href = file.url;
    a.download = videoName;
    a.target = "_blank";
    a.style.textDecoration = "none";
    let button = document.createElement("button");
    button.innerText = "Download";
    button.className = "button";
    a.appendChild(button);

    tr.appendChild(format);
    tr.appendChild(encoding);
    tr.appendChild(resolution);
    tr.appendChild(fps);
    tr.appendChild(bitrate);
    tr.appendChild(a);
    table.appendChild(tr);
  }

  container.appendChild(table);
  document.body.appendChild(container);
}

function displayCaptions(captions) {
  if (captions.length === 0) {
    return;
  }
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("float-in-right");
  container.classList.add("info");
  let h3 = document.createElement("h3");
  h3.innerText = "Captions";
  container.appendChild(h3);

  let table = document.createElement("table");

  {
    let tr = document.createElement("tr");
    let language = document.createElement("th");
    language.innerText = "Language";

    tr.appendChild(language);
    table.appendChild(tr);
  }

  for (const file of captions) {
    let tr = document.createElement("tr");
    let label = document.createElement("th");
    label.innerText = file.label;

    let a = document.createElement("a");
    a.href = file.url;
    a.download = videoName;
    a.target = "_blank";
    a.style.textDecoration = "none";
    let button = document.createElement("button");
    button.innerText = "Download";
    button.className = "button";
    a.appendChild(button);

    tr.appendChild(label);
    tr.appendChild(a);
    table.appendChild(tr);
  }

  container.appendChild(table);
  document.body.appendChild(container);
}

function displayRecur(arr) {
  if (arr.length === 0) {
    return;
  }
  arr.shift()();

  setTimeout(() => displayRecur(arr), 200);
}

function display(data) {
  setTimeout(() => {
    let arr = [
      () => displayInfo(data.thumbnail),
      () => displayVideos(data.video),
      () => displayAudio(data.audioOnly),
      () => displayVideoOnly(data.videoOnly),
      () => displayCaptions(data.captions),
    ];

    displayRecur(arr);
  }, 500);
}

window.listeners.video = ({ content }) => {
  try {
    content = JSON.parse(window.decodeEntity(content.replace('\\"', "")));
  } catch (e) {
    messages.innerText = "Invalid JSON response";
    messages.style.color = "red";
    return;
  }

  if (content.error) {
    messages.innerText = content.error;
    messages.style.color = "red";
    return;
  }

  if (content.videoThumbnails === undefined) {
    messages.innerText = JSON.stringify(data);
    messages.style.color = "red";
    return;
  }
  url.blur();

  messages.innerText = "Download OK";
  messages.style.color = "#00ff00";
  instances.style.opacity = "0%";
  instances.style.filter = "blur(30px)";

  videoName = content.title;

  content = process(content);

  setTimeout(() => {
    instances.remove();
    inputsContainer.classList.remove("nourl");
    inputsContainer.classList.add("withurl");
    display(content);
  }, 500);
};
