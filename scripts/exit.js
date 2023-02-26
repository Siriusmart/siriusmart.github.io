function exit(url) {
  let currentUrl = new URL(document.URL);
  let currentParams = new URLSearchParams(currentUrl.search);

  let targetUrl;

  if (url.startsWith("../")) {
    targetUrl = new URL(
      url.replace(
        "../",
        `${currentUrl.origin}${currentUrl.pathname
          .split("/")
          .slice(0, -2)
          .join("/")}/`
      )
    );
  } else if (url.startsWith("./")) {
    targetUrl = new URL(
      url.replace(
        "./",
        `${currentUrl.origin}${currentUrl.pathname
          .split("/")
          .slice(0, -1)
          .join("/")}/`
      )
    );
  } else {
    targetUrl = new URL(url);
  }

  let targetParams = new URLSearchParams(targetUrl.search);

  let customNotes = currentParams.get("notes");
  if (customNotes) {
    targetParams.append("notes", customNotes);
  }

  let customFiles = currentParams.get("files");
  if (customFiles) {
    targetParams.append("files", customFiles);
  }

  let customOutReq = currentParams.get("out-req");
  if (customOutReq) {
    targetParams.append("out-req", customOutReq);
  }

  let customStyle = currentParams.get("style");
  if (customStyle) {
    targetParams.append("style", customStyle);
  }

  for (const [before, after] of Object.entries(window.transitionclasses)) {
    let items = document.getElementsByClassName(before);
    for (const item of items) {
      item.classList.add(after);
    }
  }

  setTimeout(
    () =>
      (window.location.href = `${currentUrl.origin}${targetUrl.pathname}?${targetParams}`),
    500
  );
}
