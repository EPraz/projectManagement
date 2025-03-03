import { CircularProgress, Box, Typography } from "@mui/material";
// import { Loader2 } from "lucide-react"
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import {
  LoadingContainer,
  LoadingIcon,
  MessageContainer,
  ProgressDots,
} from "./Loading.styles";
import { LoadingProps } from "../../types";

const Loading: React.FC<LoadingProps> = ({
  message = "Cargando",
  description = "Por favor espere mientras cargamos su contenido",
  variant = "default",
}) => {
  if (variant === "minimal") {
    return (
      <Box display="flex" alignItems="center" gap={2} p={2}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <LoadingContainer
      sx={{
        height: variant === "fullscreen" ? "100vh" : "100%",
        minHeight: variant === "default" ? 400 : "auto",
      }}
    >
      <LoadingIcon>
        <div className="outer-circle" />
        <div className="inner-circle" />
        <HourglassBottomIcon
          sx={{ width: 40, height: 40 }}
          className="spinner"
        />
      </LoadingIcon>

      <MessageContainer>
        <Typography variant="h6" className="primary-text">
          {message}
        </Typography>
        <Typography className="secondary-text">{description}</Typography>
      </MessageContainer>

      <ProgressDots>
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </ProgressDots>
    </LoadingContainer>
  );
};

export default Loading;
