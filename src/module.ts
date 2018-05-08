import * as QuillTypes from 'quill';
import {default as ParchmentTypes} from 'parchment';

import getMuiIconBlot from './blot';
import { ModuleOptions } from './type-options';

export interface ModuleType {
    new(quill: QuillTypes.Quill, options: ModuleOptions): any
};

export default function getMuiIconsModule(Quill: QuillTypes.Quill): ModuleType {
    const Parchment: typeof ParchmentTypes = Quill.import('parchment');
    const MuiIconBlot = getMuiIconBlot(Quill);
    Quill.register(MuiIconBlot);

    class MuiIconModule {
        private icons: Array<string>;

        constructor(private quill: QuillTypes.Quill, options: ModuleOptions) {
            this.icons = options.icons;
            MuiIconBlot.className = options.className || 'ql-mui-icon';

            this.quill.getModule('toolbar').addHandler('placeholder', this.toolbarHandler);
            this.quill.root.addEventListener('click', <EventListener>this.onClick);
            this.quill.on('text-change', this.onTextChange);
        }

        onTextChange = (_: any, oldDelta: QuillTypes.DeltaStatic, source: QuillTypes.Sources) => {
            if (source === Quill.sources.USER) {
                const currrentContents = this.quill.getContents();
                const delta = currrentContents.diff(oldDelta);

                const shouldRevert = delta.ops.filter(op => op.insert &&
                    op.insert.placeholder && op.insert.placeholder.required).length;

                if (shouldRevert) {
                    this.quill.updateContents(delta, Quill.sources.SILENT);
                }
            }
        };

        onClick = (ev: QuillTypes.EditorEvent) => {
            const blot = Parchment.find(ev.target.parentNode);

            if (blot instanceof MuiIconBlot) {
                const index = this.quill.getIndex(blot);
                this.quill.setSelection(index, blot.length(), Quill.sources.USER);
            }
        };

        toolbarHandler = (identifier: string) => {
            const selection = this.quill.getSelection();
            const placeholder = this.icons.filter((pl: string) => pl === identifier)[0];
            if (!placeholder) throw new Error(`Missing mui-icon for ${identifier}`);

            this.quill.deleteText(selection.index, selection.length);
            this.quill.insertEmbed(selection.index, 'mui-icon', placeholder, Quill.sources.USER);
            this.quill.setSelection(selection.index + 1, 0);
        };
    }

    return MuiIconModule;
};
