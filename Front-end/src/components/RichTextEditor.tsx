import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Nhập mô tả sản phẩm...",
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class:
          "min-h-[320px] outline-none px-5 py-4 prose max-w-none",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8edf3]">

      {/* Toolbar */}

      <div className="flex flex-wrap gap-2 border-b bg-[#f8fafc] p-3">

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={`rounded-lg px-3 py-2 ${
            editor.isActive("bold")
              ? "bg-emerald-950 text-white"
              : "bg-white"
          }`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={`rounded-lg px-3 py-2 ${
            editor.isActive("italic")
              ? "bg-emerald-950 text-white"
              : "bg-white"
          }`}
        >
          I
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className="rounded-lg bg-white px-3 py-2"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className="rounded-lg bg-white px-3 py-2"
        >
          1. List
        </button>

      </div>

      <EditorContent editor={editor} />

    </div>
  );
}