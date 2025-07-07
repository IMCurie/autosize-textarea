import { useRef, useLayoutEffect, useState, useCallback } from "react";
import type {
  UseAutosizeTextareaProps,
  UseAutosizeTextareaResult,
  CachedStyles,
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
  const cacheStyle = useRef<CachedStyles | null>(null);

  const getCachedStyles = useCallback(
    (textarea: HTMLTextAreaElement): CachedStyles => {
      if (cacheStyle.current) {
        return cacheStyle.current;
      }

      const cs = window.getComputedStyle(textarea);
      const styles: CachedStyles = {
        boxSizing: cs.boxSizing,
        lineHeight: parseFloat(cs.lineHeight),
        pT: parseFloat(cs.paddingTop),
        pB: parseFloat(cs.paddingBottom),
        bT: parseFloat(cs.borderTopWidth),
        bB: parseFloat(cs.borderBottomWidth),
      };

      cacheStyle.current = styles;
      return styles;
    },
    []
  );

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    const styles = getCachedStyles(textarea);

    // scrollHeight 包含 content + padding，不含 border
    const contentHeight = textarea.scrollHeight - styles.pT - styles.pB;

    const contentRows = Math.min(
      maxRows,
      Math.max(minRows, Math.floor(contentHeight / styles.lineHeight))
    );
    setRows(contentRows);

    /**
     * 根据 box-sizing 决定 height 应该写什么
     * box-border, height = contentHeight + pT + pB + bT + bB
     * content-box, height = contentHeight
     */
    const finalHeight =
      styles.boxSizing === "border-box"
        ? contentRows * styles.lineHeight +
          styles.pT +
          styles.pB +
          styles.bT +
          styles.bB
        : contentRows * styles.lineHeight;

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
