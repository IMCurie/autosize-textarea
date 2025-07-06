import React from "react";

export interface UseAutosizeTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  minRows?: number;
  maxRows?: number;
}

export interface UseAutosizeTextareaResult {
  ref: React.RefObject<HTMLTextAreaElement>;
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export interface AutosizeTextareaProps extends UseAutosizeTextareaProps {}
