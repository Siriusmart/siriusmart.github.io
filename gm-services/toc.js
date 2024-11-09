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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> Overview</a></li><li class="chapter-item expanded "><a href="accounts/index.html"><strong aria-hidden="true">2.</strong> Accounts</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="accounts/v1/index.html"><strong aria-hidden="true">2.1.</strong> v1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="accounts/v1/create.html"><strong aria-hidden="true">2.1.1.</strong> create</a></li><li class="chapter-item expanded "><a href="accounts/v1/delete.html"><strong aria-hidden="true">2.1.2.</strong> delete</a></li><li class="chapter-item expanded "><a href="accounts/v1/login.html"><strong aria-hidden="true">2.1.3.</strong> login</a></li><li class="chapter-item expanded "><a href="accounts/v1/regeneratetoken.html"><strong aria-hidden="true">2.1.4.</strong> regeneratetoken</a></li><li class="chapter-item expanded "><a href="accounts/v1/rename.html"><strong aria-hidden="true">2.1.5.</strong> rename</a></li><li class="chapter-item expanded "><a href="accounts/v1/change-password.html"><strong aria-hidden="true">2.1.6.</strong> change-password</a></li><li class="chapter-item expanded "><a href="accounts/v1/change-email.html"><strong aria-hidden="true">2.1.7.</strong> change-email</a></li><li class="chapter-item expanded "><a href="accounts/v1/resend-verify.html"><strong aria-hidden="true">2.1.8.</strong> resend-verify</a></li><li class="chapter-item expanded "><a href="accounts/v1/set-status.html"><strong aria-hidden="true">2.1.9.</strong> set-status</a></li><li class="chapter-item expanded "><a href="accounts/v1/access.html"><strong aria-hidden="true">2.1.10.</strong> access</a></li><li class="chapter-item expanded "><a href="accounts/v1/accessto.html"><strong aria-hidden="true">2.1.11.</strong> accessto</a></li><li class="chapter-item expanded "><a href="accounts/v1/allow.html"><strong aria-hidden="true">2.1.12.</strong> allow</a></li><li class="chapter-item expanded "><a href="accounts/v1/disallow.html"><strong aria-hidden="true">2.1.13.</strong> disallow</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="storage/index.html"><strong aria-hidden="true">3.</strong> Storage</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="storage/v1/index.html"><strong aria-hidden="true">3.1.</strong> v1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="storage/v1/copy.html"><strong aria-hidden="true">3.1.1.</strong> copy</a></li><li class="chapter-item expanded "><a href="storage/v1/delete.html"><strong aria-hidden="true">3.1.2.</strong> delete</a></li><li class="chapter-item expanded "><a href="storage/v1/delete-multiple.html"><strong aria-hidden="true">3.1.3.</strong> delete-multiple</a></li><li class="chapter-item expanded "><a href="storage/v1/exists.html"><strong aria-hidden="true">3.1.4.</strong> exists</a></li><li class="chapter-item expanded "><a href="storage/v1/diritems.html"><strong aria-hidden="true">3.1.5.</strong> diritems</a></li><li class="chapter-item expanded "><a href="storage/v1/tree.html"><strong aria-hidden="true">3.1.6.</strong> tree</a></li><li class="chapter-item expanded "><a href="storage/v1/file.html"><strong aria-hidden="true">3.1.7.</strong> file</a></li><li class="chapter-item expanded "><a href="storage/v1/mkdir.html"><strong aria-hidden="true">3.1.8.</strong> mkdir</a></li><li class="chapter-item expanded "><a href="storage/v1/mkdir-multiple.html"><strong aria-hidden="true">3.1.9.</strong> mkdir-multiple</a></li><li class="chapter-item expanded "><a href="storage/v1/move.html"><strong aria-hidden="true">3.1.10.</strong> move</a></li><li class="chapter-item expanded "><a href="storage/v1/visibility.html"><strong aria-hidden="true">3.1.11.</strong> visibility</a></li><li class="chapter-item expanded "><a href="storage/v1/touch.html"><strong aria-hidden="true">3.1.12.</strong> touch</a></li><li class="chapter-item expanded "><a href="storage/v1/upload.html"><strong aria-hidden="true">3.1.13.</strong> upload</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="usercontent/index.html"><strong aria-hidden="true">4.</strong> Usercontent</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="usercontent/v1/index.html"><strong aria-hidden="true">4.1.</strong> v1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="usercontent/v1/exists.html"><strong aria-hidden="true">4.1.1.</strong> exists</a></li><li class="chapter-item expanded "><a href="usercontent/v1/diritems.html"><strong aria-hidden="true">4.1.2.</strong> diritems</a></li><li class="chapter-item expanded "><a href="usercontent/v1/tree.html"><strong aria-hidden="true">4.1.3.</strong> tree</a></li><li class="chapter-item expanded "><a href="usercontent/v1/file.html"><strong aria-hidden="true">4.1.4.</strong> file</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="triggers/index.html"><strong aria-hidden="true">5.</strong> Triggers</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="triggers/v1/index.html"><strong aria-hidden="true">5.1.</strong> v1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="triggers/v1/use.html"><strong aria-hidden="true">5.1.1.</strong> use</a></li><li class="chapter-item expanded "><a href="triggers/v1/revoke.html"><strong aria-hidden="true">5.1.2.</strong> revoke</a></li><li class="chapter-item expanded "><a href="triggers/v1/peek.html"><strong aria-hidden="true">5.1.3.</strong> peek</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="jobs/index.html"><strong aria-hidden="true">6.</strong> Jobs</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="jobs/v1/index.html"><strong aria-hidden="true">6.1.</strong> v1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="jobs/v1/jobs.html"><strong aria-hidden="true">6.1.1.</strong> jobs</a></li><li class="chapter-item expanded "><a href="jobs/v1/unqueue.html"><strong aria-hidden="true">6.1.2.</strong> unqueue</a></li></ol></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
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
