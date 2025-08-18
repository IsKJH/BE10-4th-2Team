import {useState, useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const checkLoginStatus = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
        return !!token;
    }, []);

    // 컴포넌트 마운트 시 토큰 확인
    useEffect(() => {
        checkLoginStatus();
        
        // localStorage 변경 감지
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                checkLoginStatus();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        // 커스텀 이벤트 리스너 (같은 탭 내에서의 변경 감지)
        const handleAuthChange = () => {
            checkLoginStatus();
        };
        
        window.addEventListener('authChange', handleAuthChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, [checkLoginStatus]);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tempToken');
        localStorage.removeItem('userInfo');
        
        // 커스텀 이벤트 발생으로 다른 컴포넌트에 상태 변경 알림
        window.dispatchEvent(new CustomEvent('authChange'));
        
        navigate('/');
    }, [navigate]);

    const handleLoginModal = useCallback((showLoginModal: () => void) => {
        showLoginModal();
    }, []);

    const socialLogin = useCallback((provider: 'kakao' | 'google' | 'naver') => {
        console.log('socialLogin 함수 호출됨:', provider);
        const url = `http://localhost:8080/${provider}-authentication/login`;
        console.log('팝업 URL:', url);

        // 화면 중앙에 팝업 위치 계산
        const width = 500;
        const height = 600;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        const popup = window.open(
            url,
            `${provider}Login`,
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        console.log('팝업 객체:', popup);

        if (!popup) {
            console.error('팝업이 차단되었거나 생성에 실패했습니다.');
            alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
            return;
        }

        // 로그인 성공 처리 공통 함수
        const handleLoginSuccess = (loginData: any, loginType: string) => {
            console.log(`${loginType} 로그인 데이터:`, loginData);
            
            // 기존 사용자인 경우 JWT 토큰(tempToken)을, 신규 사용자인 경우 tempToken을 저장
            if (!loginData.isNewUser) {
                // 기존 사용자 - JWT 토큰 저장 (백엔드에서 tempToken으로 전송됨)
                localStorage.setItem('accessToken', loginData.tempToken);
            } else {
                // 신규 사용자 - tempToken 저장  
                localStorage.setItem('tempToken', loginData.tempToken);
            }
            
            localStorage.setItem('userInfo', JSON.stringify({
                loginType: loginType,
                nickname: loginData.nickname,
                email: loginData.email,
                isNewUser: loginData.isNewUser
            }));

            // 팝업 닫기 및 리스너 제거
            popup.close();
            window.removeEventListener('message', handleMessage);

            // 페이지 이동
            if (!loginData.isNewUser) {
                setIsLoggedIn(true);
                // 커스텀 이벤트 발생으로 다른 컴포넌트에 상태 변경 알림
                window.dispatchEvent(new CustomEvent('authChange'));
                
                // 약간의 지연을 주어 상태 업데이트 보장
                setTimeout(() => {
                    navigate('/');
                }, 100);
            } else {
                navigate('/signup');
            }
        };

        // 팝업에서 메시지를 받기 위한 리스너
        const handleMessage = (event: MessageEvent) => {
            // 보안을 위해 origin 체크
            if (event.origin !== 'http://localhost:8080') {
                return;
            }

            console.log('팝업에서 받은 데이터:', event.data);

            const { type, data } = event.data;
            
            if (type === 'KAKAO_LOGIN_SUCCESS' && data) {
                handleLoginSuccess(data, 'kakao');
            } else if (type === 'GOOGLE_LOGIN_SUCCESS' && data) {
                handleLoginSuccess(data, 'google');
            } else if (type === 'NAVER_LOGIN_SUCCESS' && data) {
                handleLoginSuccess(data, 'naver');
            }
        };

        // 메시지 리스너 등록
        window.addEventListener('message', handleMessage);

        // 팝업이 닫혔을 때 리스너 정리
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                window.removeEventListener('message', handleMessage);
                clearInterval(checkClosed);
            }
        }, 1000);
    }, [navigate]);

    const signUp = useCallback(async (userData: { nickname: string; email: string; loginType: string }) => {
        try {
            const tempToken = localStorage.getItem('tempToken');
            if (!tempToken) {
                throw new Error('임시 토큰이 없습니다.');
            }

            const response = await fetch('http://localhost:8080/account/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tempToken}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('회원가입에 실패했습니다.');
            }

            const result = await response.json();

            if (result.success) {
                // 회원가입 성공 시 실제 JWT 토큰으로 교체
                localStorage.setItem('accessToken', result.data.userToken);
                localStorage.removeItem('tempToken');

                // 사용자 정보 업데이트
                localStorage.setItem('userInfo', JSON.stringify({
                    id: result.data.id,
                    nickname: result.data.nickname,
                    email: result.data.email,
                    isNewUser: false
                }));

                setIsLoggedIn(true);
                
                // 커스텀 이벤트 발생으로 다른 컴포넌트에 상태 변경 알림
                window.dispatchEvent(new CustomEvent('authChange'));

                // 홈으로 이동
                navigate('/');
            } else {
                throw new Error(result.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            throw error;
        }
    }, [navigate]);

    return {
        isLoggedIn,
        logout,
        handleLoginModal,
        socialLogin,
        signUp,
        checkLoginStatus
    };
};