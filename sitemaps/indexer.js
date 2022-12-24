const fs = require("fs");
const https = require("https");

const local = "https://siriusmart.github.io";
const notes = "https://notes.siriusmart.repl.co";

function scan(path) {
  let files = [];

  fs.readdirSync(path).forEach((file) => {
    if (file.endsWith(".html")) {
      files.push(`${path}/${file}`);
    }
  });

  return files;
}

function write(arr, name) {
  fs.writeFileSync(name, arr.map((item) => `${local}/${item}`).join("\n"));
}

let staticPages = [
  "about.html",
  "help.html",
  "posts.html",
  "resources.html",
  "ytdl.html",
  "",
  "notes",
];
let school = ["school", "school/physics", "school/physics/lens.html"];
let youtubeTui = scan("youtube-tui")
  .map((item) => {
    if (item === "youtube-tui/index.html") {
      return "youtube-tui";
    } else {
      return item;
    }
  })
  .concat(scan("youtube-tui/config"));

write(staticPages, "./sitemaps/static.txt");
write(school, "./sitemaps/school.txt");
write(youtubeTui, "./sitemaps/youtube-tui.txt");
