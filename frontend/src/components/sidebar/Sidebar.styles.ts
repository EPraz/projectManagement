import {
  Box,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { StyledDrawerProps } from "../../types";

export const StyledDrawer = styled(Drawer)<StyledDrawerProps>`
  & .MuiDrawer-paper {
    width: ${({ $IsOpen }) => ($IsOpen ? "80px" : "250px")};
    margin: 16px;
    border-radius: 16px;
    background-color: ${({ theme }) => theme.palette.sidebar.background};
    color: ${({ theme }) => theme.palette.sidebar.text};
    box-sizing: border-box;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    height: calc(100% - 32px);
    transition: width 0.3s ease;
    overflow-x: hidden;
    position: relative;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  position: relative;
`;

export const LogoText = styled(Typography)<{ $IsOpen: boolean }>`
  font-weight: bold;
  margin-left: 8px;
  font-size: 18px;
  opacity: ${({ $IsOpen }) => ($IsOpen ? 0 : 1)};
  transition: opacity 0.2s ease;
  white-space: nowrap;
`;

export const StyledListItemButton = styled(ListItemButton)`
  margin: 4px 8px;
  border-radius: 8px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
  &.active {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const StyledListItemIcon = styled(ListItemIcon)`
  min-width: 40px;
  color: #9e9e9e;
`;

export const StyledListItemText = styled(ListItemText)<{
  $IsOpen: boolean;
}>`
  & .MuiListItemText-primary {
    font-size: 14px;
    opacity: ${({ $IsOpen }) => ($IsOpen ? 0 : 1)};
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }
`;

export const UserSection = styled(Box)<{ $IsOpen: boolean }>`
  margin-top: auto;
  display: flex;
  flex-direction: ${({ $IsOpen }) => ($IsOpen ? "column" : "row")};
  align-items: center;
  background-color: #0a1414;
  justify-content: space-between;
  transition: flex-direction 2s;
`;

export const UserBox = styled(Box)<{ $IsOpen: boolean }>`
  // margin-top: auto;
  padding: ${({ $IsOpen }) => ($IsOpen ? "16px 8px" : "16px")};
  display: flex;
  align-items: center;
  background-color: #0a1414;
`;

export const UserInfo = styled(Box)<{ $IsOpen: boolean }>`
  margin-left: 12px;
  opacity: ${({ $IsOpen }) => ($IsOpen ? 0 : 1)};
  transition: opacity 0.2s ease;
  white-space: nowrap;
  display: ${({ $IsOpen }) => ($IsOpen ? "none" : "block")};
`;

export const UserName = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

export const WorkspaceText = styled(Typography)`
  font-size: 12px;
  color: #9e9e9e;
`;

export const ThemeToggle = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.palette.sidebar.text};
  &:hover {
    background-color: ${({ theme }) => theme.palette.sidebar.hover};
  }
`;

export const CollapseButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.palette.sidebar.text};
  &:hover {
    background-color: ${({ theme }) => theme.palette.sidebar.hover};
  }
`;
