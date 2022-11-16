function exit(url) {
  let search_params_obj = {};
  if (window.env.customNotesUrl) {
    search_params_obj.notes = window.env.customNotesUrl;
  }

  if (window.env.customFilesUrl) {
    search_params_obj.files = window.env.customFilesUrl;
  }

  if (window.env.customOutReqUrl) {
    search_params_obj.outreq = window.env.customOutReqUrl;
  }

  let search_params = new URLSearchParams(search_params_obj).toString();

  if (Object.keys(search_params_obj).length === 0) {
  } else if (url.split("/").pop().includes("?")) {
    url += "&" + search_params;
  } else {
    url += "?" + search_params;
  }

  for (const [before, after] of Object.entries(window.transitionclasses)) {
    let items = document.getElementsByClassName(before);
    for (const item of items) {
      item.classList.add(after);
    }
  }

  setTimeout(() => (window.location.href = url), 500);
}
