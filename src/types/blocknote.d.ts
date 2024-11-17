import '@blocknote/react';
import { BlockNoteSchema } from '@blocknote/core';

declare module '@blocknote/react' {
  interface CustomBlockSchema extends BlockNoteSchema {
    blocks: {
      paragraph: any;  // Default block type
      'scene-beat': {  // Our custom block type
        type: 'scene-beat';
        propSchema: {};
        content: 'inline';
      };
    };
  }

  // Extend the createReactBlockSpec to accept our custom types
  export function createReactBlockSpec<T extends keyof CustomBlockSchema['blocks']>(
    blockConfig: CustomBlockSchema['blocks'][T],
    options: any
  ): any;
}
