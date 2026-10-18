import { Theme } from "@mui/material";
import { RetroTypes } from "../../constants";
import { RetroCard, Sprint } from "../models";

export type RetrospectiveContainerProps = {
  sprint: Sprint | null;
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  hideNames: boolean;
  setHideNames: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenAddDialog: (typeColumn: RetroTypes) => void;
};

export type RetrospectiveColumnsContainerProps = {
  retroCards: RetroCard[];
  handleOpenAddDialog: (typeColumn: RetroTypes) => void;
  getUserNamesByIds: (userIds: string[]) => string[];
  currentTab: number;
  hideNames: boolean;
  theme: Theme;
  handleMenuClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  handleLikeToggle: (card: RetroCard) => Promise<void>;
  isPending: (id: string) => boolean;
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
  hideNames: boolean;
  theme: Theme;
  handleMenuClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  handleLikeToggle: (card: RetroCard) => Promise<void>;
  isPending: (id: string) => boolean;
};

export type RetrospectiveCardProps = {
  card: RetroCard;
  getUserNamesByIds: (userIds: string[]) => string[];
  currentTab: number;
  hideNames: boolean;
  theme: Theme;
  handleMenuClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  handleLikeToggle: (card: RetroCard) => Promise<void>;
  isPending: (id: string) => boolean;
};
