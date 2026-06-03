/**
 * Returns a single callback ref that sets multiple refs at once.
 * Accepts ref objects (useRef), callback refs, and null.
 * Usage: const ref = useCombinedRef(ref1, ref2, setNodeRef);
 */
import { useCallback } from 'react';

export default function useCombinedRef(...refs) {
  return useCallback((node) => {
    refs.forEach((r) => {
      if (!r) return;
      if (typeof r === 'function') {
        r(node);
      } else {
        r.current = node;
      }
    });
  }, refs);
}
