import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { RetrospectiveCardProps } from "../../../../types";
import {
  CardContent,
  CardFooter,
  CardHeader,
  LikeButton,
  LikedByTooltip,
  RetroCard as RetroCardStyled,
} from "../../RetrospectivePage.styles";
import { getCardColor, getCardIcon } from "../../RetrospectivePage.helpers";
import { getInitials } from "../../../../helpers";

const RetrospectiveCard = ({
  card,
  getUserNamesByIds,
  currentTab,
  isAnonymous,
  theme,
  handleMenuClick,
  handleLikeToggle,
}: RetrospectiveCardProps) => {
  const cardColor = getCardColor(card.type);
  const cardIcon = getCardIcon(card.type);
  const likedByNames = card.likedBy ? getUserNamesByIds(card.likedBy) : [];

  return (
    <RetroCardStyled key={card.id} elevation={0} isBlurred={currentTab === 1}>
      {!isAnonymous && (
        <CardHeader className="content">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[2],
              bgcolor: theme.palette.secondary.main,
            }}
            alt={card.author.name}
          >
            {getInitials(card.author.name)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {card.author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(card.timestamp).toLocaleString()}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e, card.id);
            }}
            sx={{ ml: "auto" }}
          >
            <MoreVertIcon />
          </IconButton>
        </CardHeader>
      )}
      <CardContent>
        <Typography className="content">{card.content}</Typography>
      </CardContent>
      <CardFooter>
        <Tooltip
          title={
            likedByNames.length > 0 ? (
              <LikedByTooltip>
                <Typography variant="body2">Liked by:</Typography>
                <ul>
                  {likedByNames.map((name) => (
                    <li key={name}>
                      <Typography variant="body2">{name}</Typography>
                    </li>
                  ))}
                </ul>
              </LikedByTooltip>
            ) : (
              "Be the first to like"
            )
          }
          arrow
        >
          <LikeButton
            size="small"
            startIcon={cardIcon}
            variant="text"
            color={cardColor}
            onClick={() => handleLikeToggle(card)}
          >
            {card.likes || 0}
          </LikeButton>
        </Tooltip>
        {isAnonymous && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e, card.id);
            }}
            sx={{ ml: "auto" }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </CardFooter>
    </RetroCardStyled>
  );
};

export default RetrospectiveCard;
