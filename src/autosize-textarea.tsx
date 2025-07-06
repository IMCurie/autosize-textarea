import { forwardRef, useImperativeHandle } from "react";
import { useAutosizeTextarea } from "./use-autosize-textarea";
import { UseAutosizeTextareaProps } from "./types";

export const AutosizeTextarea = forwardRef<
  HTMLTextAreaElement,
  UseAutosizeTextareaProps
>(function AutosizeTextarea({ className, ...props }, externalRef) {
  const { ref: innerRef, textareaProps } = useAutosizeTextarea(props);

  useImperativeHandle(
    externalRef,
    () => {
      return innerRef.current!;
    },
    [innerRef]
  );

  return <textarea {...textareaProps} ref={innerRef} className={className} />;
});

AutosizeTextarea.displayName = "AutosizeTextarea";
