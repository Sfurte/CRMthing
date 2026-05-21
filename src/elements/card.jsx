export const definition = {
  type: 'Card',
  label: 'Карточка',
};

export default function CardElement() {
  return (
    <div style={{
      width: 220,
      padding: 12,
      background: '#FFFFFF',
      border: '1px solid #D4D4D4',
      borderRadius: 8,
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: '20px',
      color: '#525252',
      boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
    }}>
      Содержимое карточки
    </div>
  );
}