import * as QuillTypes from 'quill';
import {default as ParchmentTypes} from 'parchment';

export default function getMuiIconBlot(Quill: QuillTypes.Quill): any {
    const Embed: typeof ParchmentTypes.Embed = Quill.import('blots/embed');

    class MuiIconBlot extends Embed {
        static blotName = 'mui-icon';
        static tagName = 'span';
        static className: string;
        public domNode: HTMLElement;

        static create(value: string) {
            let node: HTMLElement = <HTMLElement>super.create(value);

            node.setAttribute('data-name', value);
            node.setAttribute('spellcheck', 'false');

            return node;
        }

        static value(domNode: HTMLElement): DOMStringMap {
            return domNode.dataset;
        }

        length(): number {
            return 1;
        }

        deleteAt(index: number, length: number): void {
            if (!this.domNode.dataset.required)
                super.deleteAt(index, length);
        }
    }

    return MuiIconBlot;
}