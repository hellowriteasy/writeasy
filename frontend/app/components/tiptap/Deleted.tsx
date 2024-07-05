import { Mark } from "@tiptap/core";
import { markInputRule } from "@tiptap/core";

const DeletedText = Mark.create({
  name: "deletedText",

  addAttributes() {
    return {
      style: {
        default: "text-decoration: line-through; color: red;",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style="text-decoration: line-through; color: red;"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        style: "text-decoration: line-through; color: red;",
      },
      0,
    ];
  },

  addInputRules() {
    return [
      markInputRule({
        find: /(?:~~)([^~]+)(?:~~)$/,
        type: this.type,
      }),
    ];
  },
});

export default DeletedText;
