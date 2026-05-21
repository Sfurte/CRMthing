export const definition = {
  type: 'Table',
  label: 'Таблица',
};

export default function TableElement() {
  return (
    <div style={{
      width: 180,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #aaa',
      borderRadius: 8,
      background: '#f9f9f9',
      fontFamily: 'Inter',
      fontSize: 14,
      color: '#666',
      userSelect: 'none',
    }}>
      Таблица
    </div>
  );
}