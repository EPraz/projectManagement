export type SnackbarContextType = {
  showSnackbarMessage: (
    message: string,
    type?: "success" | "error" | "info"
  ) => void;
};
