import { useRef, useLayoutEffect, useState } from "react";
import type {
  UseAutosizeTextareaProps,
  UseAutosizeTextareaResult,
} from "./types";

export function useAutosizeTextarea(
  props: UseAutosizeTextareaProps
): UseAutosizeTextareaResult {
  const {
    value,
    onChange,
    minRows = 1,
    maxRows = Infinity,
    style,
    ...rest
  } = props;
  const ref = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(minRows);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const cs = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(cs.lineHeight);
    const pT = parseFloat(cs.paddingTop);
    const pB = parseFloat(cs.paddingBottom);
    const bT = parseFloat(cs.borderTopWidth);
    const bB = parseFloat(cs.borderBottomWidth);

    // scrollHeight 包含 content + padding，不含 border
    const contentHeight = textarea.scrollHeight - pT - pB;

    const contentRows = Math.min(
      maxRows,
      Math.max(minRows, Math.floor(contentHeight / lineHeight))
    );

    console.log(contentRows); // 添加调试信息
    console.log({
      scrollHeight: textarea.scrollHeight,
      contentHeight,
      lineHeight,
      contentRows,
      value: value?.length || 0,
    });
    setRows(contentRows);

    /**
     * 根据 box-sizing 决定 height 应该写什么
     * box-border, height = contentHeight + pT + pB + bT + bB
     * content-box, height = contentHeight
     */
    const boxSizing = cs.boxSizing;
    const finalHeight =
      boxSizing === "border-box"
        ? contentRows * lineHeight + pT + pB + bT + bB
        : contentRows * lineHeight;

    textarea.style.height = `${finalHeight}px`;
  }, [value, minRows, maxRows]);

  return {
    ref,
    textareaProps: {
      ...rest,
      value,
      onChange,
      rows,
      style: {
        ...style,
        resize: "none",
        overflow: "auto",
      },
    },
  };
}
