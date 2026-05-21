/**
 * Toolbar – the horizontal bar between Header and Canvas.
 * Contains the Add Component dropdown, filter buttons, and zoom control.
 */
import AddComponentDropdown from './AddComponentDropdown';
import ZoomControl from './ZoomControl';

const dividerStyle = {
  width: 0,
  height: 18,
  border: '1px solid #ACACAC',
};

const btnStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 14px',
  gap: 8,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: 400,
  color: '#202020',
  background: 'transparent',
};

const chevronStyle = {
  width: 20,
  height: 20,
};

const ITEMS = [
  { text: 'Layout' },
  { text: 'Данные' },
  { text: 'Desktop' },
];

export default function Toolbar() {
  return (
    <div
      style={{
        height: 44,
        background: '#FFFFFF',
        borderBottom: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '4px 20px',
        gap: 8,
      }}
    >
      <AddComponentDropdown />
      <div style={dividerStyle} />
      {ITEMS.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={btnStyle}>
            {item.text}
            <svg style={chevronStyle} viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="#202020" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {i < ITEMS.length - 1 && <div style={dividerStyle} />}
        </div>
      ))}
      <div style={dividerStyle} />
      <ZoomControl />
    </div>
  );
}
