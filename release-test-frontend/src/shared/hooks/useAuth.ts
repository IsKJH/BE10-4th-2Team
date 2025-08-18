import {useState, useCallback} from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = useCallback(() => {
        setIsLoggedIn(true);
        // 실제로는 API 호출, 토큰 저장 등
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        // 토큰 삭제 등
    }, []);

    const handleLoginModal = useCallback((showLoginModal: () => void) => {
        showLoginModal();
    }, []);

    const socialLogin = useCallback((provider: 'kakao' | 'google' | 'naver') => {
        console.log('socialLogin 함수 호출됨:', provider);
        const url = `http://localhost:8080/${provider}-authentication/front-login`;
        console.log('팝업 URL:', url);

        const popup = window.open(
            url,
            `${provider}Login`,
            'width=500,height=600'
        );

        console.log('팝업 객체:', popup);

        if (!popup) {
            console.error('팝업이 차단되었거나 생성에 실패했습니다.');
            alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
            return;
        }

        // 팝업에서 메시지를 받기 위한 리스너
        const handleMessage = (event: MessageEvent) => {
            // 보안을 위해 origin 체크
            if (event.origin !== 'http://localhost:8080') {
                return;
            }

            console.log('팝업에서 받은 데이터:', event.data);

            if (event.data.type === 'KAKAO_LOGIN_SUCCESS' && event.data.data) {
                const loginData = event.data.data;
                // 토큰을 localStorage에 저장
                localStorage.setItem('accessToken', loginData.token);
                localStorage.setItem('tempToken', loginData.tempToken);
                localStorage.setItem('userInfo', JSON.stringify({
                    loginType: "KAKAO",
                    nickname: loginData.nickname,
                    email: loginData.email,
                    isNewUser: loginData.isNewUser
                }));

                // 팝업 닫기
                popup.close();

                // 메시지 리스너 제거
                window.removeEventListener('message', handleMessage);

                if (!loginData.isNewUser) {
                    setIsLoggedIn(true);
                    window.location.href = 'http://localhost:5173';
                } else {
                    window.location.href = 'http://localhost:5173/signup';
                }

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
    }, []);

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
                
                // 홈으로 이동
                window.location.href = 'http://localhost:5173';
            } else {
                throw new Error(result.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            throw error;
        }
    }, []);

    return {
        isLoggedIn,
        login,
        logout,
        handleLoginModal,
        socialLogin,
        signUp
    };
};