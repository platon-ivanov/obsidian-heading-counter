import { NumberGenerator } from "./numberGenerator";
import { syntaxTree } from "@codemirror/language";
import { Extension, RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";
import CountPlugin from "./main";
// import yaml from "yaml";
// npm install yaml
const {
	parse: parseYaml,
	stringify: stringifyYaml
} = require('yaml')


const className = "HyperMD-header_HyperMD-header-";

export class CountWidget extends WidgetType {
	constructor(private count: string) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");

		div.innerText = this.count;
		div.classList.add("custom-heading-count");

		return div;
	}
}

export function headingCountPlugin(plugin: CountPlugin) {
	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged) {
					this.decorations = this.buildDecorations(update.view);
				}
			}

			destroy() {}

			buildDecorations(view: EditorView): DecorationSet {
				const builder = new RangeSetBuilder<Decoration>();
				const numGen = new NumberGenerator(plugin);
				const doc = view.state.doc.toString();
                const frontmatterEnd = doc.indexOf('---', 3);
                const frontmatterString = doc.slice(0, frontmatterEnd);
				const frontmatter = parseYaml(frontmatterString);
				let frontmatterDirectiveKey: string = plugin.settings.frontmatterDirectiveKey; // "is-show-visually-numbered-headings");
				// let isShowVisualNumbering: boolean = frontmatter[frontmatterDirectiveKey] === undefined ? plugin.isDefaultShowVisualNumbering() : frontmatter[frontmatterDirectiveKey];
				let isShowVisualNumbering: boolean =
					typeof frontmatter[frontmatterDirectiveKey] === 'string' ?
					frontmatter[frontmatterDirectiveKey].toLowerCase() === 'true' :
					frontmatter[frontmatterDirectiveKey] ?? plugin.isDefaultShowVisualNumbering();

				if (isShowVisualNumbering) {
					syntaxTree(view.state).iterate({
						enter(node) {
							const nodeName = node.type.name;

							if (nodeName.startsWith(className)) {
								const hRef = node;
								const hLevel = Number(nodeName.split(className)[1]);

								builder.add(
									hRef.from,
									hRef.from,
									Decoration.widget({
										widget: new CountWidget(
											numGen.nextNum(hLevel)
										),
									})
								);
							}
						},
					});
				}

				return builder.finish();
			}
		},
		{ decorations: (v) => v.decorations }
	);
}

export function cmPlugin(plugin: CountPlugin): Extension {
	const baseTheme = EditorView.baseTheme({
		".custom-heading-count": {
			opacity: 0.5,
		},
		// ".tree-item-children": {
		// 	"counter-reset": "multi-counters",
		// },
		// ".tree-item-inner::before": {
		// 	"counter-increment": "multi-counters",
		// 	content: `counters(multi-counters, "${plugin.settings.joinSymbol}") "${plugin.settings.endSymbol} "`,
		// },
	});

	return [baseTheme, headingCountPlugin(plugin)];
}
