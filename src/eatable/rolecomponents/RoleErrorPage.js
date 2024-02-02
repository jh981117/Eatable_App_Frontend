import React from "react";
import { Link, useNavigate } from "react-router-dom";

const RoleErrorPage = () => {




  return (
    <div>
      <h1>403 Forbidden</h1>
      <p>죄송합니다. 이 페이지에 접근할 권한이 없습니다.</p>
      <Link to="/login" className="btn btn-primary">
        홈
      </Link>
    </div>
  );
};

export default RoleErrorPage;
