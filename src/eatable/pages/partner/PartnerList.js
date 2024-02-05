import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../rolecomponents/AuthContext';

const Tbody = ({ test }) => {
    return (
        <tr>
            <td><span>{test.id}</span></td>
            <td><span><Link to={`/partnerdetail/${test.id}`}>{test.storeName}</Link></span></td>
            <td><span>{test.address?.area || ''}</span></td>
            <td><span>{test.partnerName}</span></td>
            <td><span>{test.partnerPhone}</span></td>
            <td><span>{test.storePhone}</span></td>
            <td><span>{test.favorite}</span></td>
            <td><span>{test.regDate}</span></td>
        </tr>
    );
}

const PartnerList = () => {
    const [post, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    console.log("포스트", post);

    useEffect(() => {
        fetch("http://localhost:8080/api/partner/list")
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('데이터를 불러오는데 실패했습니다.'); // 에러를 throw하여 아래 catch 블록으로 이동
                }
            })
            .then(data => {
                if (data !== null) {
                    setPosts(data.content);
                } else {
                    throw new Error('데이터가 없습니다.'); // 에러를 throw하여 아래 catch 블록으로 이동
                }
            })
            .catch(error => {
                console.error(error);
                setPosts([]); // 에러 발생 시 빈 배열로 처리
            })
            .finally(() => {
                setLoading(false); // 로딩 상태 변경
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>; // 로딩 중일 때 렌더링
    }


     console.log("포스트", post);

    return (
        <>
            {post.length === 0 ? (
                <p>No data available.</p> // 데이터가 없을 경우 메시지 표시
            ) : (
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
                        {post.map(p => (
                            <Tbody test={p} key={p.id} />
                        ))}
                    </tbody>
                </Table>
            )}

            <div className="row">
                <div className="col-12">
                    <Link to="/partnerwrite" className="btn btn-outline-dark">작성</Link>
                </div>
            </div>
        </>
    );
};

export default PartnerList;
