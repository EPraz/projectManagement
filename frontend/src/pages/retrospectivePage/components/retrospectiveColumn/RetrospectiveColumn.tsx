import { Add as AddIcon } from "@mui/icons-material";
import {
  Column,
  ColumnContent,
  ColumnHeader,
  ColumnTitle,
  EmptyColumnMessage,
} from "../../RetrospectivePage.styles";
import { Button, Tooltip, Typography } from "@mui/material";
import { RetrospectiveColumnProps } from "../../../../types";
import RetrospectiveCard from "../retrospectiveCard/RetrospectiveCard";

const RetrospectiveColumn = ({
  retroCards,
  type,
  icon,
  title,
  color,
  handleOpenAddDialog,
  getUserNamesByIds,
  currentTab,
  isAnonymous,
  theme,
  handleMenuClick,
  handleLikeToggle,
}: RetrospectiveColumnProps) => {
  const columnCards = retroCards.filter((card) => card.type === type);
  return (
    <Column elevation={0}>
      <ColumnHeader>
        <ColumnTitle>
          {icon}
          <Typography variant="subtitle1" fontWeight="medium">
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: `${color}.soft`,
            }}
          >
            {columnCards.length}
          </Typography>
        </ColumnTitle>
        <Tooltip title={`Add ${title.toLowerCase()} feedback`}>
          <Button
            startIcon={<AddIcon />}
            size="small"
            color={color}
            variant="outlined"
            onClick={() => handleOpenAddDialog(type)}
          >
            Add card
          </Button>
        </Tooltip>
      </ColumnHeader>
      <ColumnContent>
        {columnCards.length > 0 ? (
          columnCards
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .map((card, index) => (
              <RetrospectiveCard
                key={index}
                card={card}
                currentTab={currentTab}
                getUserNamesByIds={getUserNamesByIds}
                handleLikeToggle={handleLikeToggle}
                handleMenuClick={handleMenuClick}
                isAnonymous={isAnonymous}
                theme={theme}
              />
            ))
        ) : (
          <EmptyColumnMessage>
            <Typography variant="body2" gutterBottom>
              No cards yet
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Add your first card to this column
            </Typography>
            <Button
              startIcon={<AddIcon />}
              size="small"
              color={color}
              variant="outlined"
              onClick={() => handleOpenAddDialog(type)}
              sx={{ mt: 1 }}
            >
              Add card
            </Button>
          </EmptyColumnMessage>
        )}
      </ColumnContent>
    </Column>
  );
};

export default RetrospectiveColumn;
