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
import { Breadcrumbs, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const Header: React.FC<HeaderProps> = ({ projectName, projectId }) => {
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
    []
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
            color="inherit"
            onClick={handleBreadcrumbClick}
            underline="hover"
            sx={{ cursor: "pointer" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          </Link>
          <ProjectTitle>{projectName}</ProjectTitle>
        </Breadcrumbs>
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
