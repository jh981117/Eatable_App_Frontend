import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../rolecomponents/AuthContext';


const Tbody = (p) => {
    const { setAuth } = useAuth();
    const post = p.test;
    return (
        <tr>
            <td><span >{post.id}</span></td>
            <td><span><Link to={`/partnerdetail/${post.id}`}>{post.storeName}</Link></span> </td>
            <td><span >{post.address && post.address.area || ''}</span></td>
            <td><span >{post.partnerName}</span></td>
            <td><span >{post.partnerPhone}</span></td>
            <td><span >{post.storePhone}</span></td>
            <td><span >{post.favorite}</span></td>
            <td><span >{post.regDate}</span></td>
        </tr>
    );
}


const PartnerList = () => {

    const [post, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/partner/list")
            .then(response => {
                if (response.status === 200) {
                    return response.json(); //비동기 작업을 수행하는데, 이 작업이 성공하면 Promise가 완료되고, 그 결과로 JSON 데이터를 얻게 됩니다
                }
                else {
                    return null;
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log(data)
                    // const sortedPosts = data.sort((a, b) => new Date(b.regDate) - new Date(a.regDate)); //비교 함수는 배열의 요소를 정렬할 때 사용됩니다.
                    setPosts(data);
                }
            })
    }, []);

    // useEffect(() => {

    //     console.log('=====================================================');
    //     console.log(post);
    //     console.log('=====================================================');

    // }, [post]);

    return (
        <>
            <Table>
                <thead className="table-success">
                    <tr>
                        <th>매장id</th>
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
                    <Link to="/partnerwrite" className="btn btn-outline-dark">작성</Link>
                </div>
            </div>
        </>
    );
};

export default PartnerList;