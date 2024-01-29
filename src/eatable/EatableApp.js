import React from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/user/SignupPage";
import LoginPage from "./pages/user/LoginPage";
import UserMyPage from "./pages/user/UserMyPage";
import PartnerWrite from "./pages/partner/PartnerWrite";
import PartnerList from "./pages/partner/PartnerList";
import PartnerUpdate from "./pages/partner/PartnerUpdate";
import PartnerDetail from "./pages/partner/PartnerDetail";
import ApplyList from "./pages/admin/ApplyList";
import ApplyReq from "./pages/admin/ApplyList";
import CanselReq from "./pages/admin/CancelReq";

const EatableApp = () => {
  return (
    <div>
      <Container>
        <Routes>
          <Route path="/" Component={HomePage}></Route>
          <Route path="/home" Component={HomePage}></Route>

          {/* 유저 */}
          <Route path="/signup" Component={SignupPage}></Route>
          <Route path="/login" Component={LoginPage}></Route>
          <Route path="/usermypage" Component={UserMyPage}></Route>

          {/* 파트너 */}
          <Route path="/partnerwrite" Component={PartnerWrite}></Route>
          <Route path="/partnerlist" Component={PartnerList}></Route>
          <Route path="/partnerupdate:id" Component={PartnerUpdate}></Route>
          <Route path="/partnerdetail:id" Component={PartnerDetail}></Route>

          {/* 어드민 */}
          <Route path="/applylist" Component={ApplyList}></Route>
          <Route path="/applyreq" Component={ApplyReq}></Route>
          <Route path="/cancelreq:id" Component={CanselReq}></Route>
        </Routes>
      </Container>
    </div>
  );
};

export default EatableApp;
