/**
 * Calls `callback` when a click/tap occurs outside the given ref's element.
 * Used by dropdowns and popups to close themselves.
 */
import { useEffect } from 'react';

export default function useClickOutside(ref, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, callback]);
}
