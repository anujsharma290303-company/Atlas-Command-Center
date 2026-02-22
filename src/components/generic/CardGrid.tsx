import React from "react";

export interface CardGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
}

function CardGrid<T>({ items, renderItem, onItemClick }: CardGridProps<T>) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          className="cursor-pointer"
          key={index}
          onClick={() => onItemClick?.(item)}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
export default CardGrid;
