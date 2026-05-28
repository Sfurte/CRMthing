import styles from './Button.module.css';

export const definition = {
  type: 'Button',
  label: 'Кнопка',
};

export default function ButtonElement() {
  return (
    <div className={styles.wrapper}>
      Кнопка
    </div>
  );
}
