# Visual heading numbering for Obsidian

This plugin adds heading numeration to your Obsidian views.

It adds the headings only **visually** and _doesn't modify your files_! 🎉

-   All 6 heading levels

![Screenshot of headings with added numbers](imgs/screenshot.png)

It also works in the ouline pane:

![image](https://user-images.githubusercontent.com/100810261/208636544-34256930-f36a-4539-9582-398588e281dd.png)


## Installation

The plugin is not yet available in Obsidian community plugin list, so it has to be installed manually for now.

### From GitHub

1. **Download** the [latest release zip file](https://github.com/platon-ivanov/obsidian-visual-numbered-headings/releases/latest)
2. **Extract** the whole `obsidian-visually-numbered-headings` folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/obsidian-visual-numbered-headings`
    > **Note**: On some machines the `.obsidian` folder may be hidden by default.
3. **Enable** the plugin in the `Community plugins` tab
    > **Note**: You might be prompted about [Restricted Mode](https://help.obsidian.md/Advanced+topics/Community+plugins#Safe+Mode). You can disable it and enable the plugin. Another way is to head to Settings → Community plugins. Disable Restricted mode and enable the plugin from there.

### Usage

The visually-numbered headings can be enabled or disabled globally by default under the plugin settings.

The numbering can be enabled or disabled on a note-by-note basis by setting the appropriate frontmatter YAML metadata property, `visually-numbered-headings` to either `true` or `false`.
