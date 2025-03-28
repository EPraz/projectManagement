import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { LeftSection, RightSection, StepperContainer } from "./Register.styles";
import {
  FieldLabel,
  FormFieldContainer,
} from "../../components/dialogForm/DialogForm.styles";
import ReactIcon from "../../assets/react.svg";
import { useAuth } from "../../context";
import { handleRegisterSubmit } from "./Register.helper";
import {
  AuthCard,
  AuthWrapper,
  DiagonalShapes,
  Form,
  Logo,
  LogoBox,
  WelcomeText,
} from "../login/Login.styles";

// const steps = ["Account", "Personal", "Workspace"];
const steps = ["Account", "Personal"];

const Register = () => {
  const { register, loading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  // const [jobTitle, setJobTitle] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    handleRegisterSubmit(
      event,
      email,
      password,
      fullName,
      register,
      setError,
      activeStep,
      steps,
      handleNext
    );
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <LeftSection>
          <LogoBox>
            <Logo src={ReactIcon} alt="Logo" />
          </LogoBox>

          <Typography variant="h5" align="center" gutterBottom fontWeight="600">
            Create your account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            // sx={{ mb: 4 }}
          >
            Join our platform and start managing your projects
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              mb: 4,
              fontStyle: "italic",
              fontSize: "12px",
            }}
          >
            Please do not enter your personal information
          </Typography>

          <StepperContainer>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </StepperContainer>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2, alignItems: "center" }}
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <>
                <FormFieldContainer>
                  <FieldLabel>Email</FieldLabel>
                  <TextField
                    type="email"
                    autoComplete="email"
                    required
                    fullWidth
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormFieldContainer>

                <FormFieldContainer>
                  <FieldLabel>Password</FieldLabel>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormFieldContainer>
              </>
            )}

            {activeStep === 1 && (
              <>
                <FormFieldContainer>
                  <FieldLabel>Full Name</FieldLabel>
                  <TextField
                    required
                    fullWidth
                    autoFocus
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormFieldContainer>

                {/* <FormFieldContainer>
                  <FieldLabel>Job Title</FieldLabel>
                  <TextField
                    fullWidth
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter your job title"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormFieldContainer> */}
              </>
            )}

            {activeStep === 2 && (
              <>
                <FormFieldContainer>
                  <FieldLabel>Workspace Name</FieldLabel>
                  <TextField
                    required
                    fullWidth
                    autoFocus
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormFieldContainer>

                <FormFieldContainer>
                  <FieldLabel>Team Size</FieldLabel>
                  <TextField
                    type="number"
                    fullWidth
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    placeholder="How many team members?"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </FormFieldContainer>
              </>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  "Create Account"
                ) : (
                  "Next"
                )}
              </Button>
            </Box>
          </Form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Want to try it out first?{" "}
              <Link
                to="/auth/instantLogin"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Instant Login
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </LeftSection>

        <RightSection>
          <WelcomeText>
            <h1>Join EPProject Management</h1>
            <p>
              Create your account and start managing your projects more
              efficiently. Our platform helps teams collaborate, track progress,
              and deliver results.
            </p>
          </WelcomeText>
          <DiagonalShapes />
        </RightSection>
      </AuthCard>
    </AuthWrapper>
  );
};

export default Register;
