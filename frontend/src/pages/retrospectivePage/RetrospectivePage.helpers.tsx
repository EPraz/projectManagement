import { RetroTypes } from "../../constants";
import { ThumbUp, ThumbDown, Lightbulb } from "@mui/icons-material";

const cardStyles = {
  [RetroTypes.POSITIVE]: { color: "success", Icon: ThumbUp },
  [RetroTypes.NEGATIVE]: { color: "error", Icon: ThumbDown },
  [RetroTypes.IMPROVEMENT]: { color: "warning", Icon: Lightbulb }
} as const;

export const getCardColor = (type: RetroTypes) => cardStyles[type].color;
export const getCardIcon = (type: RetroTypes) => {
  const { Icon, color } = cardStyles[type];
  return <Icon color={color} />;
};
