import RetrospectiveColumn from "./RetrospectiveColumn";
import { ColumnsContainer } from "./RetrospectivePage.styles";
import { RetrospectiveColumnsContainerProps } from "../../../types";
import { RetroTypes } from "../../../constants";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";

const RetrospectiveColumnsContainer = ({
  retroCards,
  handleOpenAddDialog,
  getUserNamesByIds,
  currentTab,
  isAnonymous,
  theme,
  handleMenuClick,
  handleLikeToggle,
}: RetrospectiveColumnsContainerProps) => {
  return (
    <ColumnsContainer>
      <RetrospectiveColumn
        color={"success"}
        type={RetroTypes.POSITIVE}
        title={"What went well"}
        icon={<ThumbUpIcon color="success" />}
        currentTab={currentTab}
        getUserNamesByIds={getUserNamesByIds}
        handleLikeToggle={handleLikeToggle}
        handleMenuClick={handleMenuClick}
        handleOpenAddDialog={handleOpenAddDialog}
        isAnonymous={isAnonymous}
        retroCards={retroCards}
        theme={theme}
      />
      <RetrospectiveColumn
        color={"error"}
        type={RetroTypes.NEGATIVE}
        title={"What didn't go well"}
        icon={<ThumbDownIcon color="error" />}
        currentTab={currentTab}
        getUserNamesByIds={getUserNamesByIds}
        handleLikeToggle={handleLikeToggle}
        handleMenuClick={handleMenuClick}
        handleOpenAddDialog={handleOpenAddDialog}
        isAnonymous={isAnonymous}
        retroCards={retroCards}
        theme={theme}
      />
      <RetrospectiveColumn
        color={"warning"}
        type={RetroTypes.IMPROVEMENT}
        title={"What we can improve"}
        icon={<LightbulbIcon color="warning" />}
        currentTab={currentTab}
        getUserNamesByIds={getUserNamesByIds}
        handleLikeToggle={handleLikeToggle}
        handleMenuClick={handleMenuClick}
        handleOpenAddDialog={handleOpenAddDialog}
        isAnonymous={isAnonymous}
        retroCards={retroCards}
        theme={theme}
      />
    </ColumnsContainer>
  );
};

export default RetrospectiveColumnsContainer;
