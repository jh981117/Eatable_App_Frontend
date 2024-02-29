import React, { useEffect, useState } from "react";
import { Table, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../rolecomponents/AuthContext";
import "./components/PartnerList.css";
import { useNavigate } from "react-router-dom/dist";

const Tbody = (p) => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const post = p.test;

  return (
    <tr
      onClick={() => {
        navigate("/partnerdetail/" + post.id);
      }}
    >
      <td>
        <small>{post.id}</small>
      </td>
      <td>
        <small>{post.storeName}</small>
      </td>
      <td>
        <small>{(post.address && post.address.area) || ""}</small>
      </td>
      <td>
        <small>{post.partnerName}</small>
      </td>
      <td>
        <small>{post.partnerPhone}</small>
      </td>
      <td>
        <small>{post.storePhone}</small>
      </td>
      <td>
        {!post.favorite ? <small>--</small> : <small>{post.favorite}</small>}
      </td>
      <td>
        <small>{post.createdAt}</small>
      </td>
      <td>
        {post.createdAt === post.updatedAt ? (
          <small>--</small>
        ) : (
          <small>{post.updatedAt}</small>
        )}
      </td>
    </tr>
  );
};

const PartnerList = () => {
  const [post, setPosts] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [page, searchKeyword]);

  const fetchPosts = () => {
    let url = `http://localhost:8080/api/partner/list?page=${page}`;
    if (searchKeyword) {
      url += `&keyword=${searchKeyword}`;
    }

    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (data !== null) {
          console.log(data);
          setPosts(data.content);
          setTotalPages(data.totalPages);
        }
      })
      .catch((error) => console.error("Error fetching search results:", error));
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <>
      <div className="search-container mt-3">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="매장찾기"
        />
      </div>

      <Table bordered hover className="partner-table mt-4">
        <thead>
          <tr>
            <th>
              <small>id</small>
            </th>
            <th>
              <small>매장이름</small>
            </th>
            <th>
              <small>매장주소</small>
            </th>
            <th>
              <small>관리자</small>
            </th>
            <th>
              <small>관리자연락처</small>
            </th>
            <th>
              <small>매장연락처</small>
            </th>
            <th>
              <small>업종</small>
            </th>
            <th>
              <small>작성일</small>
            </th>
            <th>
              <small>수정일</small>
            </th>
          </tr>
        </thead>

        <tbody>
          {post.map((p) => (
            <Tbody test={p} key={p.id} />
          ))}
        </tbody>
      </Table>

      <div>
        {/* <div className="d-flex justify-content-end my-2">
          <Link
            to="/partnerwrite"
            className="btn btn-outline-dark partner-write-btn"
          >
            작성
          </Link>
        </div> */}
      </div>

      <div
        className="justify-content-center"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          />
          {Array.from(Array(totalPages).keys()).map((pageNumber) => (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === page}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
          />
        </Pagination>
      </div>
    </>
  );
};

export default PartnerList;
