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
  const shadowRef = useRef<HTMLTextAreaElement>(null);
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

  const shadowDom = useCallback((textarea: HTMLTextAreaElement) => {
    if (!shadowRef.current) {
      const shadow = textarea.cloneNode(false) as HTMLTextAreaElement;
      shadow.setAttribute("aria-hidden", "true");
      shadow.style.position = "absolute";
      shadow.style.top = "0";
      shadow.style.left = "-9999px";
      shadow.style.height = "0";
      shadow.style.overflow = "hidden";
      shadow.style.visibility = "hidden";
      shadow.style.whiteSpace = "pre-wrap";
      shadow.style.wordBreak = "break-word";

      const styles = window.getComputedStyle(textarea);
      const stylesToCopy = [
        "width",
        "fontSize",
        "fontFamily",
        "fontWeight",
        "lineHeight",
        "paddingTop",
        "paddingBottom",
        "paddingLeft",
        "paddingRight",
        "borderTopWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "boxSizing",
        "wordWrap",
        "wordBreak",
        "whiteSpace",
      ];

      stylesToCopy.forEach((style) => {
        shadow.style[style as any] = styles[style as any];
      });

      textarea.parentNode?.appendChild(shadow);
      shadowRef.current = shadow;
    }

    return shadowRef.current;
  }, []);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    // 缓存获取样式
    const styles = getCachedStyles(textarea);

    // 创建影子元素
    const shadow = shadowDom(textarea);
    shadow.value = textarea.value;

    // scrollHeight 包含 content + padding，不含 border
    const contentHeight = shadow.scrollHeight - styles.pT - styles.pB;

    const contentRows = Math.min(
      maxRows,
      Math.max(minRows, Math.ceil(contentHeight / styles.lineHeight))
    );

    if (contentRows !== rows) {
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
    }
  }, [value, minRows, maxRows, getCachedStyles, shadowDom, rows]);

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
