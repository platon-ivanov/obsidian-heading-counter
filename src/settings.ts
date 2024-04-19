import CountPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface CountPluginSettings {
	joinSymbol: string;
	endSymbol: string;
	countStartLvl: number;
	frontmatterDirectiveKey: string;
	isShowByDefault: boolean;
}

export const DEFAULT_SETTINGS: Partial<CountPluginSettings> = {
	joinSymbol: ".",
	endSymbol: ". ",
	countStartLvl: 1,
	frontmatterDirectiveKey: "visually-numbered-headings",
	isShowByDefault: false,
};

export class SettingTab extends PluginSettingTab {
	plugin: CountPlugin;

	constructor(app: App, plugin: CountPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Join symbol")
			.setDesc("Symbol used between numbers")
			.addText((text) =>
				text
					.setPlaceholder(".")
					.setValue(this.plugin.settings.joinSymbol)
					.onChange(async (value) => {
						await this.plugin.updateSettings({ joinSymbol: value });
					})
			);

		new Setting(containerEl)
			.setName("Ending symbol")
			.setDesc("Symbol after the counter")
			.addText((text) =>
				text
					.setPlaceholder(". ")
					.setValue(this.plugin.settings.endSymbol)
					.onChange(async (value) => {
						await this.plugin.updateSettings({ endSymbol: value });
					})
			);

		new Setting(containerEl)
			.setName("Starting level")
			.setDesc("Which heading level to start counting from")
			.addDropdown((el) => {
				el.addOptions({
					"1": "1",
					"2": "2",
					"3": "3",
					"4": "4",
					"5": "5",
					"6": "6",
				}).onChange(async (value) => {
					await this.plugin.updateSettings({
						countStartLvl: Number(value),
					});
				});
			});

		new Setting(containerEl)
			.setName("Local note setting property name")
			.setDesc("Frontmatter property name that overrides global default")
			.addText(text => text
				.setPlaceholder("visually-numbered-headings")
				.setValue(this.plugin.settings.frontmatterDirectiveKey)
				.onChange(async (value) => {
					await this.plugin.updateSettings({ frontmatterDirectiveKey: value });
				})
			);

		new Setting(containerEl)
			.setName("Show visually numbered headings by default")
			.setDesc("Enable to show numbered headings by default without requiring frontmatter directive")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.isShowByDefault)
				.onChange(async (value) => {
					await this.plugin.updateSettings({ isShowByDefault: value });
				})
			);
	}
}

