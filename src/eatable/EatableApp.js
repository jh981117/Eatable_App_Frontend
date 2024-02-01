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
import ApplyReq from "./pages/admin/ApplyReq";
import CancelReq from "./pages/admin/CancelReq";

import ApplyReqUpdate from "./pages/admin/ApplyReqUpdate";

import UserDetail from "./pages/userDetails/UserDetail";
import Reservation from "./pages/userDetails/reservation/Reservation";
import ReservationOk from "./pages/userDetails/reservation/ReservationOk";
import ProvisionPage from "./pages/user/ProvisionPage";


const EatableApp = () => {
  return (
    <div>
      <Container>
        <Routes>
          <Route path="/" Component={HomePage}></Route>
          <Route path="/home" Component={HomePage}></Route>

          {/* 유저 */}
          <Route path="/provision" Component={ProvisionPage}></Route>
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
          <Route path="/applyrequpdate" Component={ApplyReqUpdate}></Route>
          <Route path="/cancelreq:id" Component={CancelReq}></Route>



          {/* 유저디테일 */}
          <Route path="/userDetail" Component={UserDetail}></Route>
          <Route path="/reservation" Component={Reservation}></Route>
          <Route path="/reservationOk" Component={ReservationOk}></Route>
        </Routes>
      </Container>
    </div>
  );
};

export default EatableApp;
