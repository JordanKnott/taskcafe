export const moveItemWithinArray = (arr: any, item: any, newIndex: number) => {
  const arrClone = [...arr];
  const oldIndex = arrClone.indexOf(item);
  arrClone.splice(newIndex, 0, arrClone.splice(oldIndex, 1)[0]);
  return arrClone;
};

export const insertItemIntoArray = (arr: any, item: any, index: number) => {
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
};

export const updateArrayItemById = (arr: any, itemId: any, fields: any) => {
  const arrClone = [...arr];
  const item = arrClone.find(({ id }) => id === itemId);
  if (item) {
    const itemIndex = arrClone.indexOf(item);
    arrClone.splice(itemIndex, 1, { ...item, ...fields });
  }
  return arrClone;
};
