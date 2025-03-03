// helpers/format.ts

export const formatStatusName = (name: string): string =>
  name.replace(/_/g, " ");

const MAX_TITLE_LENGTH = 16;

export const truncatedTitle = (text: string, maxSize = MAX_TITLE_LENGTH) =>
  text.length > maxSize ? `${text.slice(0, maxSize)}...` : text;
