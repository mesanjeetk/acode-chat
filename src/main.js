import plugin from "../plugin.json";
const sideBarApps = acode.require("sidebarApps");


import style from "./style.scss";

class AcodePlugin {
    async init() {
        console.log("hello world");
        this.$style = tag("link", {
            rel: "stylesheet",
            href: this.baseUrl + "main.css"
        });
        document.head.append(this.$style);
        acode.addIcon("chat-icon", this.baseUrl + "icon.png");

        sideBarApps.add(
            "chat-icon",
            plugin.id,
            "Chattu",
            (container) => {
                const content = document.createElement('div');
                content.classList.add("scroll", "chat-container") 
                content.style.maxHeight = '100vh';
                content.style.overflowY = 'auto';

                content.innerHTML = `
                    <header>
                        <h1>Chattu</h1>
                    </header>
                `

                container.appendChild(content);
            },
            false,
            (container) => {
                console.log('App selected');
            }
        )
    }

    async destroy() {
        this.$style.remove()
    }
}

if (window.acode) {
    const acodePlugin = new AcodePlugin();
    acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        acodePlugin.baseUrl = baseUrl;
        await acodePlugin.init($page, cacheFile, cacheFileUrl);
    });
    acode.setPluginUnmount(plugin.id, () => {
        acodePlugin.destroy();
    });
}