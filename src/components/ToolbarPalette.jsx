import { useDraggable } from '@dnd-kit/core';
import { elementDefinitions } from '../elements/registry';
import { useLang } from '../hooks/useLang';

const btnStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 14px',
  gap: 8,
  borderRadius: 8,
  border: 'none',
  cursor: 'grab',
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: 400,
  color: '#202020',
  background: 'transparent',
  userSelect: 'none',
};

export default function ToolbarPalette() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {elementDefinitions.map((def) => (
        <PaletteItem key={def.type} type={def.type} labelKey={def.label} />
      ))}
    </div>
  );
}

function PaletteItem({ type, labelKey }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  const { t } = useLang();

  return (
    <div
      ref={setNodeRef}
      style={{
        ...btnStyle,
        opacity: isDragging ? 0.5 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        zIndex: isDragging ? 1000 : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      {t(labelKey)}
    </div>
  );
}