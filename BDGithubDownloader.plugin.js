/**
 * @name BDGithubDownloader
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 2.0.2
 * @invite SgKSKyh9gY
 * @description Download BetterDiscord Plugin/Theme by right clicking on message containing github link.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDGithubDownloader.plugin.js
 */
/*@cc_on
@if (@_jscript)
// Offer to self-install for clueless users that try to run this directly.
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
var pathSelf = WScript.ScriptFullName;
// Put the user at ease by addressing them in the first person
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
// Show the user where to put plugins in the future
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (_ => {
    const config = {
        info: {
            name: "BDGithubDownloader",
            authors: [{
                    name: "Ahlawat",
                    discord_id: "887483349369765930",
                    github_username: "Tharki-God",
                }, {
                    name: "Kirai",
                    discord_id: "872383230328832031",
                    github_username: "HiddenKirai",
                },
            ],
            version: "2.0.2",
            description:
            "Download BetterDiscord Plugin/Theme by right clicking on message containing github link.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDGithubDownloader.plugin.js",
        },
        changelog: [{
                title: "v0.0.1",
                items: [
                    "Idea in mind"
                ]
            }, {
                title: "v0.0.5",
                items: [
                    "Base Model"
                ]
            }, {
                title: "Initial Release v1.0.0",
                items: [
                    "This is the initial release of the plugin :)",
                    "Couldn't Have been possible without my sis, Thank you Kirai",
                    "No Incest but you are great",
                    "btw guys get those illegal plugins easily (>'-'<)"
                ]
            }, {
                title: "v2.0.0",
                items: [
                    "Better Code",
                    "Theme Support"
                ]
            },
        ],
        main: "BDPluginDownloader.plugin.js",
    };
    return !global.ZeresPluginLibrary
     ? class {
        constructor() {
            this._config = config;
        }
        getName() {
            return config.info.name;
        }
        getAuthor() {
            return config.info.authors.map((a) => a.name).join(", ");
        }
        getDescription() {
            return config.info.description;
        }
        getVersion() {
            return config.info.version;
        }
        load() {
            try {
                global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
            } catch (err) {
                console.error(this.getName(), "Plugin Updater could not be reached.", err);
            }
            BdApi.showConfirmationModal(
                "Library Missing",
`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get(
                        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                        async(error, response, body) => {
                        if (error) {
                            return BdApi.showConfirmationModal("Error Downloading",
                                [
                                    "Library plugin download failed. Manually install plugin library from the link below.",
                                    BdApi.React.createElement("a", {
                                        href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                                        target: "_blank"
                                    }, "Plugin Link")
                                ], );
                        }
                        await new Promise((r) =>
                            require("fs").writeFile(
                                require("path").join(
                                    BdApi.Plugins.folder,
                                    "0PluginLibrary.plugin.js"),
                                body,
                                r));
                    });
                },
            });
        }
        start() {}
        stop() {}
    }
     : (([Plugin, Library]) => {
        const {
            Patcher,
            ContextMenu,
            Settings,
            Toasts,
            DiscordModules: {
                React
            }
        } = Library;
        const Download = (width, height) => React.createElement('svg', {
            viewBox: '0 0 24 24',
            width,
            height
        }, React.createElement('path', {
                style: {
                    fill: 'currentColor'
                },
                d: 'M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z'
            }));
        const isGithubUrl = new RegExp('(?:git|https?|git@)(?:\\:\\/\\/)?github.com[/|:][A-Za-z0-9-]+?');
        const isGithubRawUrl = new RegExp('(?:git|https?|git@)(?:\\:\\/\\/)?raw.githubusercontent.com[/|:][A-Za-z0-9-]+?');
			const nameRegex = /@name\s+([^\t^\r^\n]+)|\/\/\**META.*["']name["']\s*:\s*["'](.+?)["']'/g; 
        const fs = require("fs").promises;
        return class BDGithubDownloader extends Plugin {
            getLinks(message) {
                var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
                return message.match(urlRegex)
            }
            async loadSetting() {
                this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;
                this.autoEnablePlugin = BdApi.loadData(config.info.name, "autoEnablePlugin") ?? true;
                this.showPluginDownload = BdApi.loadData(config.info.name, "showPluginDownload") ?? true;
                this.autoEnableTheme = BdApi.loadData(config.info.name, "autoEnableTheme") ?? true;
                this.showThemeDownload = BdApi.loadData(config.info.name, "showThemeDownload") ?? true;
                this.menu = await ContextMenu.getDiscordMenu("MessageContextMenu");
            }
            async onStart() {
                await this.loadSetting();
                if (this.showPluginDownload)
                    this.addPluginDownload();
                if (this.showThemeDownload)
                    this.addThemeDownload();
            }
            addPluginDownload() {
                Patcher.after(
                    this.menu,
                    "default",
                    (_, [props], ret) => {
                    const message = props.message;
                    let links = this.getLinks(message.content);
                    links = links?.filter((c, index) => {
                        if ((c.endsWith(".plugin.js") && links.indexOf(c) === index) && (isGithubUrl.test(c) || isGithubRawUrl.test(c)))
                            return true;
                    });
                    if (links?.length) {
                        ret.props.children.splice(3, 0, ContextMenu.buildMenuItem({
                                name: 'Download Plugin',
                                separate: true,
                                id: 'download-plugin',
                                label: 'Download Plugin',
                                icon: () => Download('20', '20'),
                                action: async() => {
                                    for (let plugin of links) {
                                        if (isGithubUrl.test(plugin)) {
                                            plugin = `https://raw.githubusercontent.com/${plugin.split("github.com/")[1]}`.replace("/blob/", "/");
                                            this.downloadPlugin(plugin);
                                        } else if (isGithubRawUrl.test(plugin)) {
                                            this.downloadPlugin(plugin);
                                        } else {
                                            if (this.showToast)
                                                Toasts.show(`Link Type Not Supported`, {
                                                    icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
                                                    timeout: 5000,
                                                    type: 'error'
                                                });
                                        }
                                    }
                                }
                            }, true));
                    }
                });
            }
            async addThemeDownload() {
                Patcher.after(
                    this.menu,
                    "default",
                    (_, [props], ret) => {
                    const message = props.message;
                    let links = this.getLinks(message.content);
                    links = links?.filter((c, index) => {
                        if ((c.endsWith(".theme.css") && links.indexOf(c) === index) && (isGithubUrl.test(c) || isGithubRawUrl.test(c)))
                            return true;
                    });
                    if (links?.length) {
                        ret.props.children.splice(3, 0, ContextMenu.buildMenuItem({
                                name: 'Download Theme',
                                separate: true,
                                id: 'download-theme',
                                label: 'Download Theme',
                                icon: () => Download('20', '20'),
                                action: async() => {
                                    for (let theme of links) {
                                        if (isGithubUrl.test(theme)) {
                                            theme = `https://raw.githubusercontent.com/${theme.split("github.com/")[1]}`.replace("/blob/", "/");
                                            this.downloadTheme(theme);
                                        } else if (isGithubRawUrl.test(plugin)) {
                                                this.downloadTheme(theme);
                                        } else {
                                            if (this.showToast)
                                                Toasts.show(`Link Type Not Supported`, {
                                                    icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
                                                    timeout: 5000,
                                                    type: 'error'
                                                });
                                        }
                                    }
                                }
                            }, true));
                    }
                });
            }
            async downloadPlugin(plugin) {                
                await fetch(plugin).then((response) => {
                    return response.text();
                }).then(async(data) => {
				let name = (/@name\s+([^\t^\r^\n]+)|\/\/\**META.*["']name["']\s*:\s*["'](.+?)["']/i.exec(data) || []).filter(n => n)[1];
				if (this.showToast)
                    Toasts.show(`Downloading Plugin: ${name}`, {
                        icon: 'https://cdn.discordapp.com/attachments/991059796759310386/991736504273621062/ic_fluent_arrow_download_24_filled.png?size=4096',
                        timeout: 5000,
                        type: 'error'
                    });
                    await fs.writeFile(require("path").join(
                            BdApi.Plugins.folder,
                            name),
                        data,
                        (err) => {
                        if (err) {
                            if (this.showToast) {
                                Toasts.show(` Error: ${err}.`, {
                                    icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
                                    timeout: 5000,
                                    type: 'error'
                                });
                            }
                            console.log(err);
                        }
                    }).then(() => {
                        if (this.autoEnablePlugin) {
                            setTimeout(() => {
                                BdApi.Plugins.enable(name)
                            }, 2000);
                        }
                    })
                }).catch((err) => {
                    if (this.showToast) {
                        Toasts.show(` Error: ${err}.`, {
                            icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
                            timeout: 5000,
                            type: 'error'
                        });
                    }
                    console.warn('Something went wrong.', err);
                });
            }
            async downloadTheme(theme) {                
                await fetch(theme).then((response) => {
                    return response.text();
                }).then(async(data) => {
				let name = (/@name\s+([^\t^\r^\n]+)|\/\/\**META.*["']name["']\s*:\s*["'](.+?)["']/i.exec(data) || []).filter(n => n)[1];
				if (this.showToast)
                    Toasts.show(`Downloading Theme: ${name}`, {
                        icon: 'https://cdn.discordapp.com/attachments/991059796759310386/991736504273621062/ic_fluent_arrow_download_24_filled.png?size=4096',
                        timeout: 5000,
                        type: 'error'
                    });
                    await fs.writeFile(require("path").join(
                            BdApi.Themes.folder,
                            name),
                        data,
                        (err) => {
                        if (err) {
                            if (this.showToast) {
                                Toasts.show(` Error: ${err}.`, {
                                    icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
                                    timeout: 5000,
                                    type: 'error'
                                });
                            }
                            console.log(err);
                        }
                    }).then(() => {
                        if (this.autoEnableTheme) {
                            setTimeout(() => {
                                BdApi.Themes.enable(name)
                            }, 2000);
                        }
                    })
                }).catch((err) => {
                    if (this.showToast) {
                        Toasts.show(` Error: ${err}.`, {
                            icon: 'https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096',
                            timeout: 5000,
                            type: 'error'
                        });
                    }
                    console.warn('Something went wrong.', err);
                });
            }
            onStop() {
                Patcher.unpatchAll();
            }
            getSettingsPanel() {
                return Settings.SettingPanel.build(this.saveSettings.bind(this),
                    new Settings.Switch("Popup/Toast", "Display error/success popup", this.showToast, (e) => {
                        this.showToast = e;
                    }),
                    new Settings.SettingGroup("Plugins", {
                        collapsible: true,
                        shown: false
                    }).append(
                        new Settings.Switch("Show Option", "Weather to option to download plugins.", this.showPluginDownload, (e) => {
                            this.showPluginDownload = e;
                        }),
                        new Settings.Switch("Auto Enable", "Weather to Automatically Enable the plugin after download.", this.autoEnablePlugin, (e) => {
                            this.autoEnablePlugin = e;
                        })),
                    new Settings.SettingGroup("Themes", {
                        collapsible: true,
                        shown: false
                    }).append(
                        new Settings.Switch("Show Option", "Weather to option to download themes.", this.showThemeDownload, (e) => {
                            this.showThemeDownload = e;
                        }),
                        new Settings.Switch("Auto Enable", "Weather to Automatically Enable the themes after download.", this.autoEnableTheme, (e) => {
                            this.autoEnableTheme = e;
                        })))
            }
            saveSettings() {
                BdApi.saveData(config.info.name, "showToast", this.showToast);
                BdApi.saveData(config.info.name, "autoEnablePlugin", this.autoEnablePlugin);
                BdApi.saveData(config.info.name, "showPluginDownload", this.showPluginDownload);
                BdApi.saveData(config.info.name, "autoEnableTheme", this.autoEnableTheme);
                BdApi.saveData(config.info.name, "showThemeDownload", this.showThemeDownload);
            }
        };
        return plugin(Plugin, Library);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/