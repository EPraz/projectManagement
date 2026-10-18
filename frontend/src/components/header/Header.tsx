import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MENU_ITEMS } from "../../constants/menuItems";
import {
  HeaderContainer,
  ProjectTitle,
  StyledTab,
  StyledTabs,
  TabsBox,
  TopBar,
} from "./Header.styles";
import { HeaderProps } from "../../types";
import UserMenu from "./userMenu/UserMenu";
import { Breadcrumbs, IconButton, Link, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";

const Header: React.FC<HeaderProps> = ({
  projectName,
  projectId,
  onRefresh,
  refreshing = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const currentTab = pathSegments[pathSegments.length - 1];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    event.stopPropagation();
    if (currentTab !== newValue) {
      navigate(`/projects/${projectId}/${newValue}`, { replace: true });
    }
  };

  const tabs = useMemo(
    () =>
      MENU_ITEMS.map((tab) => (
        <StyledTab
          key={tab.path}
          label={
            <TabsBox>
              {tab.icon && <tab.icon sx={{ fontSize: 18 }} />}
              {tab.text}
            </TabsBox>
          }
          value={tab.path}
          disableRipple
          disabled={tab?.disabled}
        />
      )),
    [],
  );

  const handleBreadcrumbClick = () => {
    // Navegar a la URL base del proyecto
    navigate(`/projects`, { replace: true });
  };

  return (
    <HeaderContainer>
      <TopBar>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component="button"
            type="button"
            aria-label="Back to projects"
            color="inherit"
            onClick={handleBreadcrumbClick}
            underline="hover"
            sx={{ cursor: "pointer" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          </Link>
          <ProjectTitle>{projectName}</ProjectTitle>
        </Breadcrumbs>
        {onRefresh && (
          <Tooltip title="Refresh project">
            <span>
              <IconButton
                aria-label="Refresh project"
                onClick={onRefresh}
                disabled={refreshing}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </TopBar>
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs}
      </StyledTabs>
      <UserMenu />
    </HeaderContainer>
  );
};

export default Header;
