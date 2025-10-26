import plugin from "../plugin.json";
const sideBarApps = acode.require("sidebarApps");

import "./style.scss"; // ensure bundler emits CSS
// Or if you prefer runtime-loaded CSS, keep the <link> in init()

class AcodePlugin {
  constructor() {
    // Remove existing instance (idempotent)
    if (sideBarApps.get(plugin.id)) {
      sideBarApps.remove(plugin.id);
    }
    this.initSideBar();
  }

  // Accept the props acode provides — clearer for future usage
  async init(baseUrl, $page, { cacheFileUrl, cacheFile } = {}) {
    this.baseUrl = baseUrl && baseUrl.endsWith("/") ? baseUrl : (baseUrl || "") + "/";
    // register icon
    acode.addIcon("chat-icon", this.baseUrl + "icon.png");

    // If your bundler does not inject style automatically, create link
    if (!this.$style) {
      this.$style = tag("link", {
        rel: "stylesheet",
        href: this.baseUrl + "main.css"
      });
      document.head.append(this.$style);
    }
  }

  initSideBar() {
    // Only add once (defensive)
    if (sideBarApps.get(plugin.id)) return;

    sideBarApps.add(
      "chat-icon",
      plugin.id,
      "Chattu",
      (container) => {
        // Wrapper that fills available area (avoid using viewport units)
        const content = document.createElement('div');
        content.classList.add("scroll", "chat-container");
        content.style.height = "100%";
        content.style.minHeight = "100vh";
        content.style.maxHeight = "100vh";
        content.style.overflowY = "auto";
        content.setAttribute("role", "region");
        content.setAttribute("aria-label", "Chattu sidebar");

        // Header
        const header = tag("header", { className: "chat-header" });
        const title = tag("h1", { textContent: "Chattu", className: "chat-title" });
        const search = tag("input", { 
          className: "chat-search", 
          placeholder: "Search users…",
          type: "search",
          'aria-label': 'Search users'
        });

        header.append(title, search);

        // User list
        const userContainer = tag("div", { className: "container", role: "list" });

        // demo users — replace with real data later
        Array.from({ length: 10 }).forEach((_, i) => {
          const userCard = tag("div", {
            className: "user-card",
            textContent: `User ${i + 1}`,
            role: "listitem",
            tabIndex: 0
          });
          userContainer.append(userCard);
        });

        content.append(header, userContainer);

        // optional: simple search filter
        search.addEventListener("input", (e) => {
          const q = e.target.value.toLowerCase().trim();
          Array.from(userContainer.children).forEach(card => {
            const txt = card.textContent.toLowerCase();
            card.style.display = txt.includes(q) ? "" : "none";
          });
        });

        // Empty container before appending (prevent duplicates)
        container.innerHTML = "";
        container.appendChild(content);

        // store references for cleanup
        this._sidebar = { container, content, search, userContainer };
      },
      false,
      (container) => {
        console.log('Chattu selected');
      }
    );
  }

  async destroy() {
    try {
      if (this.$style && this.$style.parentNode) {
        this.$style.remove();
      }
    } catch (err) {
      console.warn("Failed removing style:", err);
    }

    try {
      sideBarApps.remove(plugin.id);
    } catch (err) {
      console.warn("Failed removing sidebar app:", err);
    }

    // Remove any event listeners you added (e.g., search)
    if (this._sidebar && this._sidebar.search) {
      this._sidebar.search.removeEventListener("input", this._sidebar.searchHandler);
    }
    this._sidebar = null;
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, opts) => {
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    await acodePlugin.init(baseUrl, $page, opts);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
