import { Node } from "@tiptap/core";

export const Del = Node.create({
  name: "del",

  content: "block*",

  group: "block",

  parseHTML() {
    return [{ tag: "del" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["del", HTMLAttributes, 0];
  },
});

export const Ins = Node.create({
  name: "ins",

  content: "block*",

  group: "block",

  parseHTML() {
    return [{ tag: "ins" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["ins", HTMLAttributes, 0];
  },
});
