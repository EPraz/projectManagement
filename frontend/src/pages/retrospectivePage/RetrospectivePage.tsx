"use client";

import type React from "react";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";
import {
  CardContent,
  CardFooter,
  CardHeader,
  Column,
  ColumnContent,
  ColumnHeader,
  ColumnsContainer,
  ColumnTitle,
  Container,
  Header,
  RetroCard,
} from "./RetrospectivePage.styles";

interface RetroCard {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  type: "positive" | "negative";
  likes?: number;
}

const mockData: RetroCard[] = [
  {
    id: "1",
    content:
      "Team collaboration was excellent this sprint. We managed to complete all our tasks ahead of schedule and the quality of work was outstanding.",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    timestamp: "Dec 28, 2023 10:30 am",
    type: "positive",
    likes: 5,
  },
  {
    id: "2",
    content:
      "We had some communication problems this sprint that led to duplicate work. We should improve our daily stand-ups and documentation.",
    author: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    timestamp: "Dec 28, 2023 11:15 am",
    type: "negative",
    likes: 3,
  },
];

const RetrospectivePage = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const { positiveCards, negativeCards } = useMemo(
    () => ({
      positiveCards: mockData.filter((card) => card.type === "positive"),
      negativeCards: mockData.filter((card) => card.type === "negative"),
    }),
    []
  );

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    cardId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCard(cardId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
  };

  return (
    <Container>
      <Header elevation={0}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            Sprint 1 Retrospective
          </Typography>
          <Tabs
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
            sx={{
              ml: 2,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: "0.875rem",
              },
            }}
          >
            <Tab label="Team Discussion" />
            <Tab label="Anonymous Feedback" />
          </Tabs>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={isAnonymous ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onClick={() => setIsAnonymous(!isAnonymous)}
          >
            {isAnonymous ? "Show Names" : "Hide Names"}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add new card
          </Button>
        </Box>
      </Header>

      <ColumnsContainer>
        <Column elevation={0}>
          <ColumnHeader>
            <ColumnTitle>
              <ThumbUpIcon color="success" />
              <Typography variant="subtitle1" fontWeight="medium">
                What went well
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: "success.soft",
                }}
              >
                {positiveCards.length}
              </Typography>
            </ColumnTitle>
            <Tooltip title="Add positive feedback">
              <Button startIcon={<AddIcon />} size="small" color="success">
                Add card
              </Button>
            </Tooltip>
          </ColumnHeader>
          <ColumnContent>
            {positiveCards.map((card) => (
              <RetroCard
                key={card.id}
                elevation={0}
                isBlurred={currentTab === 1}
              >
                <CardHeader className="content">
                  {!isAnonymous && (
                    <>
                      <Avatar src={card.author.avatar} alt={card.author.name} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {card.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {card.timestamp}
                        </Typography>
                      </Box>
                    </>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, card.id)}
                    sx={{ ml: "auto" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </CardHeader>
                <CardContent>
                  <Typography className="content">{card.content}</Typography>
                </CardContent>
                <CardFooter>
                  <Button
                    size="small"
                    startIcon={<ThumbUpIcon />}
                    variant="text"
                    color="success"
                  >
                    {card.likes}
                  </Button>
                </CardFooter>
              </RetroCard>
            ))}
          </ColumnContent>
        </Column>

        <Column elevation={0}>
          <ColumnHeader>
            <ColumnTitle>
              <ThumbDownIcon color="error" />
              <Typography variant="subtitle1" fontWeight="medium">
                What didn't go well
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: "error.soft",
                }}
              >
                {negativeCards.length}
              </Typography>
            </ColumnTitle>
            <Tooltip title="Add improvement feedback">
              <Button startIcon={<AddIcon />} size="small" color="error">
                Add card
              </Button>
            </Tooltip>
          </ColumnHeader>
          <ColumnContent>
            {negativeCards.map((card) => (
              <RetroCard
                key={card.id}
                elevation={0}
                isBlurred={currentTab === 1}
              >
                <CardHeader className="content">
                  {!isAnonymous && (
                    <>
                      <Avatar src={card.author.avatar} alt={card.author.name} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {card.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {card.timestamp}
                        </Typography>
                      </Box>
                    </>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, card.id)}
                    sx={{ ml: "auto" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </CardHeader>
                <CardContent>
                  <Typography className="content">{card.content}</Typography>
                </CardContent>
                <CardFooter>
                  <Button
                    size="small"
                    startIcon={<ThumbUpIcon />}
                    variant="text"
                    color="error"
                  >
                    {card.likes}
                  </Button>
                </CardFooter>
              </RetroCard>
            ))}
          </ColumnContent>
        </Column>
      </ColumnsContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        elevation={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default RetrospectivePage;
