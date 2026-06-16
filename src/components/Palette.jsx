import { useDraggable } from '@dnd-kit/core';

const ITEMS = ['Input', 'Button', 'Table', 'Card'];

export default function Palette() {
  return (
    <div style={{ width: 200, background: '#f7f7f7', borderRight: '1px solid #ccc', padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Components</h3>
      {ITEMS.map((type) => (
        <PaletteItem key={type} type={type} />
      ))}
    </div>
  );
}

function PaletteItem({ type }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  const style = {
    padding: '8px 12px',
    marginBottom: 8,
    background: isDragging ? '#e0e0e0' : '#fff',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'grab',
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 1000 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {type}
    </div>
  );
}