import styles from './Card.module.css';

export const definition = {
  type: 'Card',
  label: 'Карточка',
};

export default function CardElement() {
  return (
    <div className={styles.wrapper}>
      Содержимое карточки
    </div>
  );
}
