import React from "react";
import Navbar from "./Navbar";
import Banner from "./Banner";
import ClickSparkWrapper from "../reactbit/ClickSparkWrapper/ClickSparkWrapper";
import ScrollHideNavbarWrapper from "./Navbar/ScrollHideNavbarWrapper";

const Header = () => {
  return (
    <>
      <ClickSparkWrapper>
        <ScrollHideNavbarWrapper>
          <Navbar />
        </ScrollHideNavbarWrapper>
      </ClickSparkWrapper>
    </>
  );
};

export default Header;
