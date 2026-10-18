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
import { useAuth } from "../../../../context/authContext";
import { getInitials } from "../../../../helpers";

const RetrospectiveCard = ({
  card,
  getUserNamesByIds,
  currentTab,
  hideNames,
  theme,
  handleMenuClick,
  handleLikeToggle,
  isPending,
}: RetrospectiveCardProps) => {
  const { user } = useAuth();
  const cardColor = getCardColor(card.type);
  const cardIcon = getCardIcon(card.type);
  const likedByNames =
    !hideNames && card.likedBy ? getUserNamesByIds(card.likedBy) : [];

  return (
    <RetroCardStyled
      role="article"
      aria-label="Retrospective card"
      key={card.id}
      elevation={0}
      isBlurred={currentTab === 1}
    >
      {!hideNames && (
        <CardHeader>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.action.selected,
              color: theme.palette.text.primary,
            }}
            alt={card.author.name}
          >
            {getInitials(card.author.name)}
          </Avatar>
          <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
            <Typography className="content" variant="body2" fontWeight={600}>
              {card.author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(card.timestamp).toLocaleString()}
            </Typography>
          </Box>
          <IconButton
            size="small"
            aria-label="Card actions"
            disabled={isPending(card.id)}
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e, card.id);
            }}
            sx={{ ml: "auto", minWidth: 44, minHeight: 44 }}
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
            ) : hideNames || card.likes > 0 ? (
              `${card.likes} reactions`
            ) : (
              "Be the first to like"
            )
          }
          arrow
        >
          <LikeButton
            aria-label="Like feedback"
            aria-pressed={card.likedBy.includes(user?.id ?? "")}
            disabled={isPending(card.id)}
            size="small"
            startIcon={cardIcon}
            variant="text"
            color={cardColor}
            onClick={() => handleLikeToggle(card)}
          >
            {card.likes || 0}
          </LikeButton>
        </Tooltip>
        {hideNames && (
          <IconButton
            size="small"
            aria-label="Card actions"
            disabled={isPending(card.id)}
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e, card.id);
            }}
            sx={{ ml: "auto", minWidth: 44, minHeight: 44 }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </CardFooter>
    </RetroCardStyled>
  );
};

export default RetrospectiveCard;
