import { SentimentDissatisfied, SmsOutlined } from '@material-ui/icons';
import axios from 'axios';
import { useEffect, useState,useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
const NaverLogin = ({ setGetToken, setUserInfo }) => {
    const [accessToken,setAccessToken] = useState();  
    const navigate = useNavigate();
	const { naver } = window
    const naverRef = useRef()
	const initializeNaverLogin = () => {
		const naverLogin = new naver.LoginWithNaverId({
			clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
			callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,                   
			isPopup: false,        
			loginButton: { color: 'green', type: 3, height: 40},
			
		})
		naverLogin.init()

	}


// 기존 로그인 버튼이 아닌 커스텀을 진행한 로그인 버튼만 나타내기 위해 작성
const NaverIdLogin = styled.div`
	display: none;
`

const NaverLoginBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 460px; 
  height: 56px;
  background-color: #03c75a;
  border-radius: 6px;
  margin: auto; 
  margin-top: 20px; 
  transition: background-color 0.3s; 
  &:hover {
    background-color: gray;
  }
`;

const NaverIcon = styled.span`
  margin-right: 16px;
  color: #fff;
`;

const NaverLoginTitle = styled.span`
  flex: 1;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #fff;
`;

    const location = useLocation();  
          
    const getNaverToken = () => {
        if (!location.hash) return;
        const accessToken = location.hash.split('=')[1].split('&')[0];
        setAccessToken(accessToken);
        console.log(location);
        };      
    
        const sendToken = (accessToken) => {
            fetch('http://localhost:8080/oauth2/naverlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${accessToken}` // AccessToken을 Bearer 토큰으로 추가
                },               
            })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // JSON 형태로 응답 데이터 파싱
                } else {
                    throw new Error('네이버 로그인에 실패했습니다.');
                }
            })
            .then((data) => {
                console.log(data);
                console.log("네이버 로그인 성공", data);
                alert("네이버 로그인 성공!");
                localStorage.setItem("token", data.token);// JWT 저장      
                localStorage.removeItem("com.naver.nid.access_token"); // 토큰 삭제
                localStorage.removeItem("com.naver.nid.oauth.state_token"); // 토큰 삭제      
                navigate("/");
                document.documentElement.style.display = 'none';
                window.location.reload();
            })
            .catch((error) => {
                console.error('네이버 로그인 오류:', error.message);
                alert('네이버 로그인에 실패했습니다. 다시 시도해주세요.');
            });
        };
        
    
  
	useEffect(() => {
		initializeNaverLogin()
		getNaverToken()
	}, [])

    useEffect(() => {
        if (accessToken) {
            sendToken(accessToken);
        }
    }, [accessToken]);

    const handleNaverLogin = () => {
		naverRef.current.children[0].click()
	}  

	return (
		<>
       <NaverIdLogin ref={naverRef} id="naverIdLogin" />
        <NaverLoginBtn onClick={handleNaverLogin}>
            <NaverIcon>N</NaverIcon>
            <NaverLoginTitle>네이버로 로그인</NaverLoginTitle>
        </NaverLoginBtn>
		</>
	)
}

export default NaverLogin;