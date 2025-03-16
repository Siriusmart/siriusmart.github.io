// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> Overview</a></li><li class="chapter-item expanded "><a href="installation.html"><strong aria-hidden="true">2.</strong> Installation</a></li><li class="chapter-item expanded "><a href="basic_usage.html"><strong aria-hidden="true">3.</strong> Basic usage</a></li><li class="chapter-item expanded "><a href="commands.html"><strong aria-hidden="true">4.</strong> Commands</a></li><li class="chapter-item expanded affix "><li class="part-title">Customisation guide</li><li class="chapter-item expanded "><a href="config/index.html"><strong aria-hidden="true">5.</strong> Config files</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="config/main.html"><strong aria-hidden="true">5.1.</strong> main</a></li><li class="chapter-item expanded "><a href="config/commands.html"><strong aria-hidden="true">5.2.</strong> commands</a></li><li class="chapter-item expanded "><a href="config/keybindings.html"><strong aria-hidden="true">5.3.</strong> keybindings</a></li><li class="chapter-item expanded "><a href="config/commandbindings.html"><strong aria-hidden="true">5.4.</strong> commandbindings</a></li><li class="chapter-item expanded "><a href="config/pages.html"><strong aria-hidden="true">5.5.</strong> pages</a></li><li class="chapter-item expanded "><a href="config/appearance.html"><strong aria-hidden="true">5.6.</strong> appearance</a></li><li class="chapter-item expanded "><a href="config/search.html"><strong aria-hidden="true">5.7.</strong> search</a></li><li class="chapter-item expanded "><a href="config/cmdefine.html"><strong aria-hidden="true">5.8.</strong> cmdefine</a></li><li class="chapter-item expanded "><a href="config/remap.html"><strong aria-hidden="true">5.9.</strong> remap</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Contributing</li><li class="chapter-item expanded "><a href="explaination/how_it_works.html"><strong aria-hidden="true">6.</strong> How it works</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="explaination/framework.html"><strong aria-hidden="true">6.1.</strong> Framework</a></li><li class="chapter-item expanded "><a href="explaination/event-loop.html"><strong aria-hidden="true">6.2.</strong> Event loop</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.3.</strong> Invidious and loading videos</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.4.</strong> Caching and library</div></li></ol></li><li class="chapter-item expanded "><a href="changelogs.html"><strong aria-hidden="true">7.</strong> Changelogs</a></li><li class="chapter-item expanded "><a href="contributors.html"><strong aria-hidden="true">8.</strong> Contributors</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
