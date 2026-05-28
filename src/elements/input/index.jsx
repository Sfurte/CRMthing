import { useState } from 'react';
import { Input } from 'antd';

export const definition = {
  type: 'Input',
  label: 'Поле ввода',
};

export default function InputElement() {
  const [value, setValue] = useState('');

  return (
    <div
      style={{ width: 280, padding: 4 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Input
        placeholder="Введите текст..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}
