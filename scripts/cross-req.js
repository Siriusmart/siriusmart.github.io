window.createIframe = (url) => {
  let id = Math.floor(Math.random() * 10000000);
  let iframe = document.createElement("iframe");
  iframe.id = id;
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.contentWindow.location.href = `${url}&iframe-id=${id}`;
};
