export const newGuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const sixteen = 16;
    const ox3 = 0x3;
    const ox8 = 0x8;
    const r = Math.random() * sixteen | 0;
    const v = c === 'x' ? r : ((r & ox3) | ox8);
    return v.toString(sixteen);
  });
};
