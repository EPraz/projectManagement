export const handleRegisterSubmit = async (
  event: React.FormEvent,
  email: string,
  password: string,
  name: string,
  register: (email: string, password: string, name: string) => Promise<void>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  activeStep: number,
  steps: string[],
  handleNext: () => void
) => {
  event.preventDefault();

  // Validate current step
  if (activeStep === 0) {
    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }
  } else if (activeStep === 1) {
    if (!name) {
      setError("Please enter your full name");
      return;
    }
    // } else if (activeStep === 2) {
    //   if (!workspaceName) {
    //     setError("Please enter a workspace name");
    //     return;
    //   }
  }

  setError("");

  if (activeStep === steps.length - 1) {
    // Final step - submit the form
    register(email, password, name);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  } else {
    // Move to next step
    handleNext();
  }
};
