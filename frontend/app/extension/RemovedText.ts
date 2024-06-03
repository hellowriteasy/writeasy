import { Mark } from '@tiptap/core';

const AddedText = Mark.create({
  name: 'addedText',

  addAttributes() {
    return {
      class: {
        default: 'bg-lightgreen underline',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span.bg-lightgreen.underline' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
});

export default AddedText;
