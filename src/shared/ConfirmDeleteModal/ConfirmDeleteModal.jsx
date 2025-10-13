import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ConfirmDeleteModal({
  open,
  itemName = "",
  onConfirm,
  onCancel,
  loading = false,
}) {
  // создаём/кешируем контейнер под портал
  const containerRef = useRef(null);
  if (!containerRef.current && typeof document !== "undefined") {
    const el = document.createElement("div");
    el.setAttribute("id", "confirm-delete-root");
    containerRef.current = el;
  }

  // монтируем контейнер один раз
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    document.body.appendChild(el);
    return () => {
      try { document.body.removeChild(el); } catch {}
    };
  }, []);

  // esc для закрытия
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !loading && open && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!containerRef.current) return null;

  // ВАЖНО: структура портала стабильна всегда.
  // Контент показываем/скрываем через style/aria, не меняя типы элементов.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={open ? "false" : "true"}
      onClick={loading ? undefined : onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: open ? "rgba(0,0,0,0.8)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        pointerEvents: open ? "auto" : "none", // когда закрыта — клики не проходят
        transition: "background 180ms ease",
      }}
    >
      <article
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: open ? "scale(1)" : "scale(0.98)",
          opacity: open ? 1 : 0,
          transition: "transform 150ms ease, opacity 150ms ease",
          background: "#fff",
          borderRadius: 12,
          width: 520,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          color: "#22333B",
          boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
        }}
      >
        <h3 style={{ margin: 0, borderBottom: "1px solid #000", paddingBottom: 10 }}>
          Удалить {itemName ? `«${itemName}»` : "элемент"}?
        </h3>

        <p style={{ margin: 0 }}>Действие необратимо. Вы уверены?</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", borderTop: "1px solid #eee", paddingTop: 12 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{ padding: "10px 20px", borderRadius: 8, background: "#D9D9D9", color: "#000", border: "none", cursor: "pointer" }}
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{ padding: "10px 20px", borderRadius: 8, background: "#22333B", color: "#fff", border: "none", cursor: "pointer" }}
          >
            {loading ? "Удаляем…" : "Удалить"}
          </button>
        </div>
      </article>
    </div>,
    containerRef.current
  );
}
