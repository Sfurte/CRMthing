export const textBlock = {
  defaultProps: {
    fontSize: 16,
    bold: false,
    italic: false,
    color: '#000000',
  },
  properties: [
    { name: 'fontSize', label: 'fontSize', type: 'number', min: 8, max: 100, group: 'textStyle' },
    { name: 'bold', label: 'bold', type: 'checkbox', group: 'textStyle' },
    { name: 'italic', label: 'italic', type: 'checkbox', group: 'textStyle' },
    { name: 'color', label: 'textColor', type: 'color', group: 'textStyle' },
  ],
};

export function textStyles(props) {
  return {
    fontSize: Number(props?.fontSize) || 16,
    fontWeight: props?.bold ? 700 : 400,
    fontStyle: props?.italic ? 'italic' : 'normal',
    color: props?.color || '#000000',
  };
}
