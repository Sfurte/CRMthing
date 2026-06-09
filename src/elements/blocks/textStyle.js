export const textBlock = {
  defaultProps: {
    fontSize: 16,
    bold: false,
    italic: false,
    color: '#000000',
  },
  properties: [
    { name: 'fontSize', label: 'Размер шрифта', type: 'number', min: 8, max: 100, group: 'Оформление текста' },
    { name: 'bold', label: 'Полужирный', type: 'checkbox', group: 'Оформление текста' },
    { name: 'italic', label: 'Курсив', type: 'checkbox', group: 'Оформление текста' },
    { name: 'color', label: 'Цвет текста', type: 'color', group: 'Оформление текста' },
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
