import React from 'react';
import { getDimensions } from './utils';
import { DragIndicatorBar } from './Styles';

type DragIndicatorProps = {
  container: React.RefObject<HTMLDivElement>;
  zone: ImpactZone;
  depthTarget: number;
};

const DragIndicator: React.FC<DragIndicatorProps> = ({ container, zone, depthTarget }) => {
  let top = 0;
  let width = 0;
  if (zone.below === null) {
    if (zone.above) {
      const entry = getDimensions(zone.above.dimensions.entry);
      const children = getDimensions(zone.above.dimensions.children);
      if (children) {
        top = children.top;
        width = children.width - depthTarget * 35;
      } else if (entry) {
        top = entry.bottom;
        width = entry.width - depthTarget * 35;
      }
    }
  } else if (zone.below) {
    const entry = getDimensions(zone.below.dimensions.entry);
    if (entry) {
      top = entry.top;
      width = entry.width - depthTarget * 35;
    }
  }
  let left = 0;
  if (container && container.current) {
    left = container.current.getBoundingClientRect().left + (depthTarget - 1) * 35;
    width = container.current.getBoundingClientRect().width - depthTarget * 35;
  }
  return <DragIndicatorBar top={top} left={left} width={width} />;
};

export default DragIndicator;
