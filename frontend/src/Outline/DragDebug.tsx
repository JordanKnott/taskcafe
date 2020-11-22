import React from 'react';
import { DragDebugWrapper } from './Styles';

type DragDebugProps = {
  zone: ImpactZone | null;
  depthTarget: number;
  draggingID: string | null;
};

const DragDebug: React.FC<DragDebugProps> = ({ zone, depthTarget, draggingID }) => {
  let aboveID = null;
  let belowID = null;
  if (zone) {
    aboveID = zone.above ? zone.above.node.id : null;
    belowID = zone.below ? zone.below.node.id : null;
  }
  return (
    <DragDebugWrapper>{`aboveID=${aboveID} / belowID=${belowID} / depthTarget=${depthTarget} draggingID=${draggingID}`}</DragDebugWrapper>
  );
};

export default DragDebug;
