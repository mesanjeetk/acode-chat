import plugin from "../plugin.json";
const sideBarApps = acode.require("sidebarApps");


import style from "./style.scss";

class AcodePlugin{
    async init() {
        console.log("hello world");
        this.$style = tag("style",{
            rel: "stylesheet",
            href: this.baseUrl + "main.css"
        });
        document.head.append(this.$style);
        acode.addIcon("chat-icon", this.baseUrl + "icon.png");

        console.log(style)


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