export const formatStatusName = (name: string): string =>
  name
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
// name.replace(/_/g, " ");

export const formatRoleName = (role: string): string => {
  if (!role) return "No Role";
  return formatStatusName(role);
};

const MAX_TITLE_LENGTH = 16;

export const truncatedTitle = (text: string, maxSize = MAX_TITLE_LENGTH) =>
  text.length > maxSize ? `${text.slice(0, maxSize)}...` : text;
