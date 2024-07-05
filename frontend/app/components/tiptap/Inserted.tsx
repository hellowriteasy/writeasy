import { Mark } from "@tiptap/core";
import { markInputRule } from "@tiptap/core";

const InsertedText = Mark.create({
  name: "insertedText",

  addAttributes() {
    return {
      style: {
        default: "text-decoration: underline; color: green;",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style="text-decoration: underline; color: green;"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      { ...HTMLAttributes, style: "text-decoration: underline; color: green;" },
      0,
    ];
  },

  addInputRules() {
    return [
      markInputRule({
        find: /(?:\+\+)([^+]+)(?:\+\+)$/,
        type: this.type,
      }),
    ];
  },
});

export default InsertedText;
