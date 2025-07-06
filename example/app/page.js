"use client";

import { useState } from "react";
import { AutosizeTextarea } from "auto-resize-textarea";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <div className="p-4">
      <h1>Auto Resize Textarea</h1>
      <AutosizeTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        minRows={1}
        maxRows={2}
        className="border border-gray-300"
      />
      <p>Current text length: {text.length}</p>
    </div>
  );
}
