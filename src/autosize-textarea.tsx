import { forwardRef, useCallback } from "react";
import { useAutosizeTextarea } from "./use-autosize-textarea";
import { AutosizeTextareaProps } from "./types";

export const AutosizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutosizeTextareaProps
>(function AutosizeTextarea(props, externalRef) {
  const { ref: innerRef, textareaProps } = useAutosizeTextarea(props);

  const mergedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof externalRef === "function") {
        externalRef(node);
      } else if (externalRef) {
        externalRef.current = node;
      }
    },
    [externalRef]
  );

  return <textarea {...textareaProps} ref={mergedRef} />;
});

AutosizeTextarea.displayName = "AutosizeTextarea";
