import './ResizableElement.css';

export default function ResizableElement({ children }) {
  return (
    <div className="resizable">
      {children}
    </div>
  );
}
