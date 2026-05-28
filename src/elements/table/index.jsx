import styles from './Table.module.css';

export const definition = {
  type: 'Table',
  label: 'Таблица',
};

export default function TableElement() {
  return (
    <div className={styles.wrapper}>
      Таблица
    </div>
  );
}
