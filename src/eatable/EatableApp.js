import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
import ApplyReq from "./pages/admin/ApplyReq";
import AdminRoute from "./rolecomponents/AdminRoute";
import RoleErrorPage from "./rolecomponents/RoleErrorPage";
import MemberRoute from "./rolecomponents/MemberRoute";
import MyHeader from "./pages/fregment/MyHeader";
import Reservation from "./pages/userDetails/reservation/Reservation";
import { AuthProvider } from "./rolecomponents/AuthContext";
import ProvisionPage from "./pages/user/ProvisionPage";
import UserDetail from "./pages/userDetails/UserDetail";
import AdminPage from "./pages/admin/AdminPage";
import ReviewList from "./pages/userreview/ReviewList";
import EatableTimeLine from "./pages/userreview/EatableTimeLine";
import DetailTab from "./pages/userreview/DetailTab";
import ReviewImg from "./pages/userreview/ReviewImg";
import ReviewWrite from "./pages/userreview/ReviewWrite";
import ReviewDetail from "./pages/userreview/ReviewDetail";
import GoogleMap from "./pages/partner/GoogleMaps";
import UserPartnerPage from "./pages/user/UserPartnerPage";
import AutoComplete from "./pages/partner/AutoComplete";
import SearchPage from "./pages/partner/SearchPage";

import "./EatableApp.css";
import StoreReviewList from "./pages/userreview/StoreReviewList";

import PartnerWaitingPage from "./pages/userDetails/waiting/partnerWaitingPage";

import Out from "./pages/user/Out";
import UserInfoPage from "./pages/user/UserInfoPage";
import UserPageAccess from "./rolecomponents/UserPageAccess";


const EatableApp = () => {
  return (
    <div>
      <AuthProvider>
        {/* AuthProvider를 사용하여 로그인 상태를 전역적으로 관리 */}
        <MyHeader />
        {/* MyHeader 컴포넌트에서는 useAuth를 사용하여 로그인 상태 접근 */}
        <Container>
          <Routes>
            <Route path="/" Component={HomePage}></Route>
            <Route path="/home" Component={HomePage}></Route>

            {/* 유저 */}
            <Route path="/provision" Component={ProvisionPage}></Route>
            <Route path="/signup" Component={SignupPage}></Route>
            <Route path="/login" Component={LoginPage}></Route>
            <Route path="/out" Component={Out}></Route>
            <Route
              path="/usermypage"
              element={
                <UserPageAccess>
                  <UserInfoPage />
                </UserPageAccess>
              }
            ></Route>

            {/* 파트너페이지 어드민권환 */}
            <Route
              path="/googleMap"
              element={
                // <AdminRoute>
                <GoogleMap />
                // </AdminRoute>
              }
            ></Route>

            <Route
              path="/SearchPage"
              element={
                // <AdminRoute>
                <SearchPage />
                // </AdminRoute>
              }
            ></Route>

            <Route
              path="/AutoComplete"
              element={
                // <AdminRoute>
                <AutoComplete />
                // </AdminRoute>
              }
            ></Route>

            <Route
              path="/partnerwrite/:userId"
              element={
                // <AdminRoute>
                <PartnerWrite />
                // </AdminRoute>
              }
            ></Route>
            <Route
              path="/partnerlist"
              element={
                // <AdminRoute>
                <PartnerList />
                // </AdminRoute>
              }
            ></Route>
            <Route
              path="/partnerupdate/:id"
              element={
                // <AdminRoute>
                <PartnerUpdate />
                // </AdminRoute>
              }
            ></Route>
            <Route
              path="/partnerdetail/:id"
              element={
                // <AdminRoute>
                <PartnerDetail />
                // </AdminRoute>
              }
            ></Route>





            {/* 어드민 */}
            <Route
              path="/applylist"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/applyreq"
              element={
                <MemberRoute>
                  {" "}
                  <ApplyReq />
                </MemberRoute>
              }
            ></Route>
            <Route
              path="/applyrequpdate"
              element={
                <AdminRoute>
                  {" "}
                  <ApplyReq />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/cancelreq/:id"
              element={
                <AdminRoute>
                  {" "}
                  <ApplyReq />
                </AdminRoute>
              }
            ></Route>
            <Route
            path="/adminpage" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }>
              
            </Route>






            {/* 에러페이지 */}
            <Route path="/roleErrorPage" Component={RoleErrorPage}></Route>

            {/* 유저디테일   스토어디테일  유저권한 */}
            <Route
              path="/userDetail/:id"
              element={
                <MemberRoute>
                  <UserDetail />
                </MemberRoute>
              }
            ></Route>

            {/* 예약 페이지 유저권한  */}
            <Route
              path="/reservation/:id"
              element={
                <MemberRoute>
                  <Reservation />
                </MemberRoute>
              }
            ></Route>


            {/* 민호 */}
            <Route path="/reviewlist" Component={ReviewList}></Route>
            <Route path="/eatabletimeline" Component={EatableTimeLine}></Route>
            <Route path="/detailtab" Component={DetailTab}></Route>
            <Route path="/reviewimg" Component={ReviewImg}></Route>
            <Route path="/reviewwrite" Component={ReviewWrite}></Route>
            <Route path="/reviewdetail" Component={ReviewDetail}></Route>
            <Route path="/userpartnerpage" Component={UserPartnerPage}></Route>
            <Route
              path="/storeReviewList/:id"
              Component={StoreReviewList}
            ></Route>
          </Routes>
        </Container>
      </AuthProvider>
    </div>
  );
};

export default EatableApp;
