"use client"; // this registers <Editor> as a Client Component
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";



// Our <Editor> component we can reuse later
export default function NoteEditor({Sidebar}: {Sidebar: boolean}) {
  // Creates a new editor instance.
  type Link = {
    type: "link";
    href: string;
    children: [{ type: "text", content: string }];
  };
  
  
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "New Note",
      },
      {
        type: "heading",
        props: {
          level: 3,
        },
        content: "Reccomended Resources",
         
      },
      {
        type: "paragraph",
        content: "This is a paragraph",
        
      },
    ],
  });

  // Renders the editor instance using a React component with a style that breaks text.
  return (
    <div style={{ wordWrap: "break-word", maxWidth: "80%", paddingTop: "20px", paddingBottom: "5px", marginLeft: "auto", marginRight: "250px" }}>
      <BlockNoteView editor={editor} data-theming-css-variables-demo/>
    </div>
  );
}

