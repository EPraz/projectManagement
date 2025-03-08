export const handleInstantLoginSubmit = async (
  event: React.FormEvent,
  email: string,
  instantLogin: (email: string) => Promise<void>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  event.preventDefault();

  if (!email) {
    setError("Please enter both email and password");
    return;
  }

  try {
    setError("");
    await instantLogin(email);
    // No need to navigate here as the AuthProvider handles navigation
  } catch (err) {
    console.error("Login error:", err);
    setError(
      err instanceof Error
        ? err.message
        : "Failed to login. Please check your credentials."
    );
  }
};
