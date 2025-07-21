"use client";
import { useState } from "react";

export function useActionVisibility() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleItemHover = (id: string) => {
    setHoveredItem(id);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  const handleItemClick = (id: string) => {
    setClickedItem(prev => prev === id ? null : id);
  };

  const shouldShowActions = (id: string) => {
    return hoveredItem === id || clickedItem === id;
  };

  const clearAll = () => {
    setHoveredItem(null);
    setClickedItem(null);
  };

  return {
    hoveredItem,
    clickedItem,
    handleItemHover,
    handleItemLeave,
    handleItemClick,
    shouldShowActions,
    clearAll,
  };
}
