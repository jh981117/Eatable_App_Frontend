import React, { useEffect, useState } from "react";
import { Table, Pagination } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../rolecomponents/AuthContext";
import "./components/PartnerList.css";

const Tbody = (p) => {
  const { setAuth } = useAuth();
  const post = p.test;

  const navigate = useNavigate();
  const partnerDetail = () => {
    // Navigate to the partner detail page with the post id as a URL parameter
    navigate(`/partnerdetail/${post.id}`);
  };
  return (
    <tr onClick={partnerDetail}>
      <td>
        <span>{post.id}</span>
      </td>
      <td>
        <span>{post.storeName}</span>
      </td>
      <td>
        <span>{(post.address && post.address.area) || ""}</span>
      </td>
      <td>
        <span>{post.partnerName}</span>
      </td>
      <td>
        <span>{post.partnerPhone}</span>
      </td>
      <td>
        <span>{post.storePhone}</span>
      </td>
      <td>
        <span>{post.favorite}</span>
      </td>
      <td>
        <span>{post.regDate}</span>
      </td>
    </tr>
  );
};

const PartnerList = () => {

    const [post, setPosts] = useState([]);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchKeyword, setSearchKeyword] = useState('');

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
                    placeholder="검색어를 입력하세요"
                />
            </div>

            <Table bordered hover className="partner-table mt-4">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>매장이름</th>
                        <th>매장주소</th>
                        <th>관리자이름</th>
                        <th>관리자연락처</th>
                        <th>매장연락처</th>
                        <th>업종</th>
                        <th>작성일</th>
                    </tr>
                </thead>

                <tbody>
                    {post.map(
                        p =>
                            <Tbody test={p} key={p.id} />
                    )}
                </tbody>
            </Table>

            <div >
                <div className="d-flex justify-content-end my-2">
                    <Link to="/partnerwrite" className="btn btn-outline-dark partner-write-btn">작성</Link>
                </div>
            </div>

            <div className="justify-content-center" style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
                    {Array.from(Array(totalPages).keys()).map(pageNumber => (
                        <Pagination.Item key={pageNumber} active={pageNumber === page} onClick={() => handlePageChange(pageNumber)}>
                            {pageNumber + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
                </Pagination>
            </div>
        </>
    );
};

export default PartnerList;