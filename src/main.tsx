import { debounce, Plugin, MarkdownView } from "obsidian";
import { cmPlugin } from "./cmPlugin";
import { CountPluginSettings, DEFAULT_SETTINGS, SettingTab } from "./settings";
import { Extension } from "@codemirror/state";
import { MarkdownRenderChild } from "obsidian";
import { Cache } from "./cache";
import { NumberGenerator } from "./numberGenerator";

export default class CountPlugin extends Plugin {
	private cmExtension: Extension[];
	public settings: CountPluginSettings;
	public mdNumGenCache = new Cache<NumberGenerator>();

	isInitialLoad = true;

	resetCache = debounce(
		() => {
			this.mdNumGenCache.clearAll();
		},
		1000,
		true
	);

	isDefaultShowVisualNumbering(): boolean {
		return this.settings.isShowByDefault;
	}

	isShowVisualNumbering(): boolean {
		return this.isDefaultShowVisualNumbering();
	}


	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));

		this.updateRefreshSettings();

		this.registerEditorExtension(cmPlugin(this));

		this.registerEvent(
			this.app.workspace.on("editor-change", (file, mdView) => {
				(mdView as MarkdownView).previewMode.rerender(true);
			})
		);

		this.registerEvent(
			this.app.metadataCache.on("changed", () => {
				this.resetCache();
			})
		);

        this.addCommand({
            id: 'refresh-heading-visual-numbering',
            name: 'Refresh heading numbering',
            callback: () => {
                this.resetCache();
            }
        });

		this.registerMarkdownPostProcessor((element, context) => {

			const docId = context.docId;
			const sourcePath = context.sourcePath;
			const frontmatter = context.frontmatter;

			let isShow: boolean = this.settings.isShowByDefault;
			if (frontmatter && frontmatter[this.settings.frontmatterDirectiveKey] !== undefined) {
				isShow = frontmatter[this.settings.frontmatterDirectiveKey];
			}
			if (!isShow) {
				return;
			}
			const headings = element.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6");


			if (!this.mdNumGenCache.exists(docId)) {
				const numGen = new NumberGenerator(this);

				this.mdNumGenCache.set(docId, numGen);
			}

			const numGen = this.mdNumGenCache.get(docId) as NumberGenerator;

			for (const [, h] of headings.entries()) {
				const lastChild = headings.item(
					headings.length - 1
				) as HTMLElement;
				const hLvl = Number(lastChild.tagName[1]);

				if (!lastChild) continue;

				const num = numGen?.nextNum(hLvl);
				context.addChild(new PreviewCount(h, num));
			}
		}, 10);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) ?? {}
		);
	}

	async updateSettings(settings: Partial<CountPluginSettings>) {
		Object.assign(this.settings, settings);
		await this.saveData(this.settings);
		this.updateRefreshSettings();
	}

	private updateRefreshSettings() {
		this.app.workspace.updateOptions();
	}
}

export class PreviewCount extends MarkdownRenderChild {
	text: string;

	constructor(containerEl: HTMLElement, text: string) {
		super(containerEl);

		this.text = text;
	}

	onload() {
		this.containerEl.createSpan({
			text: this.text,
			prepend: true,
			cls: "custom-heading-count",
		});
	}
}
