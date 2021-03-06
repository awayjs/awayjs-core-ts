export class XmlUtils {

	public static getChildrenWithTag(node: Node, tag: string): NodeList {

		const fragment: DocumentFragment = document.createDocumentFragment();

		if (node) {
			const num: number = node.childNodes.length;
			for (let i: number = 0; i < num; i++) {
				const child: Node = node.childNodes[i];
				if (child != null) {
					if (child.nodeName == tag) {
						fragment.appendChild(child);
					}
				}
			}
		}

		return fragment.childNodes;
	}

	public static filterListByParam(nodes: NodeList, paramName: string, paramValue): NodeList {

		const fragment: DocumentFragment = document.createDocumentFragment();

		if (nodes) {
			const num: number = nodes.length;
			for (let i: number = 0; i < num; i++) {
				const child: any = nodes[i];
				if (child != null) {
					if (child.attributes.getNamedItem(paramName).value == paramValue) {
						fragment.appendChild(child);
					}
				}
			}
		}

		return fragment.childNodes;
	}

	public static strToXml(str: string): Node {
		const parser: DOMParser = new DOMParser();
		const node: Node = parser.parseFromString(str, 'text/xml');
		return node;
	}

	public static nodeToString(node: Node): string {
		if (!node) return '';
		const str = (new XMLSerializer()).serializeToString(node);
		return str;
	}

	public static readAttributeValue(node: any, attrName: string): string {
		const attrs = node.attributes;
		if (attrs == undefined) {
			return '';
		}
		const attribute: Attr = attrs.getNamedItem(attrName);
		if (!attribute) {
			//console.log("XmlUltils - readAttributeValue() - name: " + attrName + ", attribute does not exist.";
			return '';
		}
		//console.log("XmlUltils - readAttributeValue() - name: " + attrName + ", value: " + attribute.value);
		return attribute.value;
	}

	public static writeAttributeValue(node: any, attrName: string, attrValue: string) {
		let attribute: Attr = document.createAttribute(attrName);
		attribute.value = attrValue;
		attribute = node.attributes.setNamedItem(attribute);
		console.log('XmlUltils - writeAttributeValue() - name: ' + attribute.name + ', value: ' + attribute.value);
	}

	public static hasAttribute(node: any, attrName: string): boolean {
		const attrs = node.attributes;
		if (attrs == undefined) {
			return false;
		}
		const attribute: Attr = attrs.getNamedItem(attrName);
		return attribute != null;
	}
}
