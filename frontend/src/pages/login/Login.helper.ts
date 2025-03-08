export const handleLoginSubmit = async (
  event: React.FormEvent,
  email: string,
  password: string,
  login: (email: string, password: string) => Promise<void>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  event.preventDefault();

  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  try {
    setError("");
    await login(email, password);
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
