import { useEffect, useRef } from 'react';

const useOnOutsideClick = (
  $ignoredElementRefs: any,
  isListening: boolean,
  onOutsideClick: () => void,
  $listeningElementRef: any,
) => {
  const $mouseDownTargetRef = useRef();
  const $ignoredElementRefsMemoized = [$ignoredElementRefs].flat();

  useEffect(() => {
    const handleMouseDown = (event: any) => {
      $mouseDownTargetRef.current = event.target;
    };

    const handleMouseUp = (event: any) => {
      if (typeof $ignoredElementRefsMemoized !== 'undefined') {
        const isAnyIgnoredElementAncestorOfTarget = $ignoredElementRefsMemoized.some(($elementRef: any) => {
          if ($elementRef && $elementRef.current) {
            return (
              $elementRef.current.contains($mouseDownTargetRef.current) || $elementRef.current.contains(event.target)
            );
          }
          return false;
        });
        if (event.button === 0 && !isAnyIgnoredElementAncestorOfTarget) {
          onOutsideClick();
        }
      }
    };

    const $listeningElement = ($listeningElementRef || {}).current || document;

    if (isListening) {
      $listeningElement.addEventListener('mousedown', handleMouseDown);
      $listeningElement.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      $listeningElement.removeEventListener('mousedown', handleMouseDown);
      $listeningElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [$ignoredElementRefsMemoized, $listeningElementRef, isListening, onOutsideClick]);
};

export default useOnOutsideClick;
