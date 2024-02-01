import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowPage = () => {
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);

  useEffect(() => {
    // API 엔드포인트를 사용..... 링크가 이게 맞나??
    const API_ENDPOINT = 'https://localhost:8080/api/user/follow';

    // 팔로잉 목록 가져오기
    axios.get(`${API_ENDPOINT}/following`)
      .then(response => {
        setFollowingList(response.data);
      })
      .catch(error => {
        console.error('Error fetching following list:', error);
      });

    // 팔로워 목록 가져오기
    axios.get(`${API_ENDPOINT}/followers`)
      .then(response => {
        setFollowersList(response.data);
      })
      .catch(error => {
        console.error('Error fetching followers list:', error);
      });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h5>팔로잉 목록</h5>
        <ul>
          {followingList.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>

      <div>
        <h5>팔로워 목록</h5>
        <ul>
          {followersList.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowPage;