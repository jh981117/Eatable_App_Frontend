import { SentimentDissatisfied, SmsOutlined } from '@material-ui/icons';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
const NaverLogin = ({ setGetToken, setUserInfo }) => {
    const [accessToken,setAccessToken] = useState();  
    const navigate = useNavigate();
	const { naver } = window
	const NAVER_CLIENT_ID = 'YsJrZssQT5uMuONnqPfW';
	const NAVER_CALLBACK_URL = 'http://localhost:3000/login';

	const initializeNaverLogin = () => {
		const naverLogin = new naver.LoginWithNaverId({
			clientId: NAVER_CLIENT_ID,
			callbackUrl: NAVER_CALLBACK_URL,                   
			isPopup: false,        
			loginButton: { color: 'green', type: 3, height: 40 },
			
		})
		naverLogin.init()

	}

    const saveTokenToLocalStorage = (accessToken) => {
        // 로컬 스토리지에 토큰 저장 로직을 여기에 구현
        localStorage.setItem("token", accessToken);
        
      };
            const location = useLocation();  

          
    const getNaverToken = () => {
        if (!location.hash) return;
        const accessToken = location.hash.split('=')[1].split('&')[0];
        setAccessToken(accessToken);
        console.log(accessToken);
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
                saveTokenToLocalStorage(data.token); // JWT 저장            
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

	return (
		<>
         {/* // 구현할 위치에 아래와 같이 코드를 입력해주어야 한다. 
         // 태그에 id="naverIdLogin" 를 해주지 않으면 오류가 발생한다! */}
			<div  id="naverIdLogin" />
		</>
	)
}

export default NaverLogin;