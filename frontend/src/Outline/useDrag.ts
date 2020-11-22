import React, { useContext } from 'react';

type DragContextData = {
  impact: null | { zone: ImpactZone; depthTarget: number };
  outline: React.MutableRefObject<OutlineData>;
  setNodeDimensions: (
    nodeID: string,
    ref: { entry: React.RefObject<HTMLElement>; children: React.RefObject<HTMLElement> | null },
  ) => void;
  setImpact: (data: ImpactData | null) => void;
};

export const DragContext = React.createContext<DragContextData | null>(null);

export const useDrag = () => {
  const ctx = useContext(DragContext);
  if (ctx) {
    return ctx;
  }
  throw new Error('context is null');
};
