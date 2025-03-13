import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, Avatar, Box } from "@mui/material";
import { MENU_ITEMS } from "../../constants";
import { ThemeToggleModal } from "../themeToggleModal/ThemeToggleModal";
import type { SidebarProps } from "../../types";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import {
  CollapseButton,
  Logo,
  LogoText,
  SidebarPlaceholder,
  StyledDrawer,
  StyledListItemButton,
  StyledListItemIcon,
  StyledListItemText,
  UserBox,
  UserInfo,
  UserName,
  UserSection,
  WorkspaceText,
} from "./Sidebar.styles";

const Sidebar: React.FC<SidebarProps> = ({
  project,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = useMemo(
    () =>
      MENU_ITEMS.map((item) => ({
        text: item.text,
        icon: <item.icon />,
        path: `/projects/${project.id}/${item.path}`,
        disabled: item.disabled,
      })),
    [MENU_ITEMS]
  );

  const toggleCollapse = () => {
    const x = !sidebarOpen;
    setSidebarOpen(x);
    localStorage.setItem("sidebarOpen", x.toString());
  };

  return (
    <>
      <SidebarPlaceholder $IsOpen={sidebarOpen} />
      <StyledDrawer variant="permanent" $IsOpen={sidebarOpen}>
        <Logo>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill="#1E8E3E"
              />
              <path
                d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                fill="#1E8E3E"
              />
              <path
                d="M12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z"
                fill="#1E8E3E"
              />
              <path
                d="M9 12C9 13.1046 8.10457 14 7 14C5.89543 14 5 13.1046 5 12C5 10.8954 5.89543 10 7 10C8.10457 10 9 10.8954 9 12Z"
                fill="#1E8E3E"
              />
              <path
                d="M17 12C17 13.1046 16.1046 14 15 14C13.8954 14 13 13.1046 13 12C13 10.8954 13.8954 10 15 10C16.1046 10 17 10.8954 17 12Z"
                fill="#1E8E3E"
              />
            </svg>
            <LogoText $IsOpen={sidebarOpen}>{project.title}</LogoText>
          </Box>
        </Logo>

        <List sx={{ padding: "8px 0" }}>
          {menuItems.map(({ text, icon, path, disabled }) => (
            <StyledListItemButton
              key={text}
              onClick={() => navigate(path)}
              className={
                path === `/projects/${project.id}/dashboard` ? "active" : ""
              }
              sx={{ justifyContent: sidebarOpen ? "center" : "flex-start" }}
              disabled={disabled}
            >
              <StyledListItemIcon sx={{ minWidth: sidebarOpen ? 0 : 40 }}>
                {icon}
              </StyledListItemIcon>
              <StyledListItemText primary={text} $IsOpen={sidebarOpen} />
            </StyledListItemButton>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <UserSection $IsOpen={sidebarOpen}>
          <UserBox $IsOpen={sidebarOpen}>
            <Avatar
              alt="User"
              src="/placeholder.svg?height=40&width=40"
              sx={{ width: 36, height: 36 }}
            >
              P
            </Avatar>
            <UserInfo $IsOpen={sidebarOpen}>
              <UserName>Phenomenon</UserName>
              <WorkspaceText>Workspace</WorkspaceText>
            </UserInfo>
          </UserBox>
          {sidebarOpen ? (
            <CollapseButton onClick={toggleCollapse}>
              <KeyboardDoubleArrowRightOutlinedIcon />
            </CollapseButton>
          ) : (
            <>
              {/* <ThemeToggle onClick={() => setThemeModalOpen(true)}>
                <DarkModeIcon />
                </ThemeToggle> */}
              <CollapseButton onClick={toggleCollapse}>
                <KeyboardDoubleArrowLeftOutlinedIcon />
              </CollapseButton>
            </>
          )}
        </UserSection>
      </StyledDrawer>

      <ThemeToggleModal
        open={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
