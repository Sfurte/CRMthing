import './Header.css';

export default function Header({ title = 'Dashboard', onBack }) {
  const headerClass = 'header' + (onBack ? ' header--with-back' : ' header--centered');

  return (
    <div className={headerClass}>
      {onBack && (
        <div className="header__left">
          <svg
            className="header__back-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            onClick={onBack}
          >
            <path
              d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
              fill="currentColor"
            />
          </svg>
          <span className="header__back-text" onClick={onBack}>
            Назад
          </span>
        </div>
      )}
      <span className="header__title">{title}</span>
      {onBack && <div className="header__spacer" />}
    </div>
  );
}
