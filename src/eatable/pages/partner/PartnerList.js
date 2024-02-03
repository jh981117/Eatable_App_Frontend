import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../rolecomponents/AuthContext';
import './components/PartnerList.css'; // CSS 파일 import


const Tbody = (p) => {
    const { setAuth } = useAuth();
    const post = p.test;
    return (
        <tr onClick={() => { window.location = `/partnerdetail/${post.id}` }}>
            <td><span>{post.id}</span></td>
            <td><span>{post.storeName}</span></td>
            <td><span>{post.address && post.address.area || ''}</span></td>
            <td><span>{post.partnerName}</span></td>
            <td><span>{post.partnerPhone}</span></td>
            <td><span>{post.storePhone}</span></td>
            <td><span>{post.favorite}</span></td>
            <td><span>{post.regDate}</span></td>
        </tr>
    );
}


const PartnerList = () => {

    const [post, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/partner/list")
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return null;
                }
            })
            .then(data => {
                if (data !== null) {
                    setPosts(data.content);
                }
            })
    }, []);

    return (
        <>
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

            <div className="row">
                <div className="col-12">
                    <Link to="/partnerwrite" className="btn btn-outline-dark partner-write-btn">작성</Link>
                </div>
            </div>
        </>
    );
};

export default PartnerList;
