import { useState } from 'react';
import styles from './Input.module.css';

export const definition = {
  type: 'Input',
  label: 'Поле ввода',
};

export default function InputElement() {
  const [value, setValue] = useState('');

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Текст</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Введите текст..."
        className={styles.field}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
