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
        />
      )),
    []
  );

  return (
    <HeaderContainer>
      <TopBar>
        <ProjectTitle>{projectName}</ProjectTitle>
      </TopBar>
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs}
      </StyledTabs>
    </HeaderContainer>
  );
};

export default Header;
