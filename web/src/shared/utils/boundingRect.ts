export const convertDivElementRefToBounds = ($ref: React.RefObject<HTMLDivElement>) => {
  if ($ref && $ref.current) {
    const bounds = $ref.current.getBoundingClientRect();
    return {
      size: {
        width: bounds.width,
        height: bounds.height,
      },
      position: {
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
      },
    };
  }
  return null;
};

export default convertDivElementRefToBounds;
