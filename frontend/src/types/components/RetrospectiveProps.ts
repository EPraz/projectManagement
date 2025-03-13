import { Theme } from "@mui/material";
import { RetroTypes } from "../../constants";
import { RetroCard, Sprint } from "../models";

export type RetrospectiveContainerProps = {
  sprint: Sprint | null;
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  isAnonymous: boolean;
  setIsAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenAddDialog: (typeColumn: RetroTypes) => void;
};

export type RetrospectiveColumnsContainerProps = {
  retroCards: RetroCard[];
  handleOpenAddDialog: (typeColumn: RetroTypes) => void;
  getUserNamesByIds: (userIds: string[]) => string[];
  currentTab: number;
  isAnonymous: boolean;
  theme: Theme;
  handleMenuClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  handleLikeToggle: (card: RetroCard) => Promise<void>;
};

export type RetrospectiveColumnProps = {
  retroCards: RetroCard[];
  type: RetroTypes;
  icon: React.ReactNode;
  title: string;
  color: "success" | "error" | "warning";
  handleOpenAddDialog: (typeColumn: RetroTypes) => void;
  getUserNamesByIds: (userIds: string[]) => string[];
  currentTab: number;
  isAnonymous: boolean;
  theme: Theme;
  handleMenuClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  handleLikeToggle: (card: RetroCard) => Promise<void>;
};

export type RetrospectiveCardProps = {
  card: RetroCard;
  getUserNamesByIds: (userIds: string[]) => string[];
  currentTab: number;
  isAnonymous: boolean;
  theme: Theme;
  handleMenuClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  handleLikeToggle: (card: RetroCard) => Promise<void>;
};
