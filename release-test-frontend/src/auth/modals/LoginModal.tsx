import React, {useEffect} from "react";
import KakaoLogin from "@/assets/kakao_login.png"
import {useAuth} from "@/auth/hooks/useAuth";

interface LoginModalProps {
    closeLoginModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({closeLoginModal}) => {
    const {socialLogin} = useAuth();

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeLoginModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeLoginModal]);
    return (
        <>
            <div className="modal-overlay" onClick={closeLoginModal}>
                <div className="modal-content animate-slide-in-up" style={{maxWidth: '460px'}}
                     onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header text-center">
                        <h2 className="modal-title">로그인</h2>
                        <p className="modal-description mt-2">환영합니다! 간편하게 로그인하고 서비스를 이용해보세요</p>
                    </div>
                    <div className="modal-body">
                        <div className="flex flex-col gap-3">
                            <img
                                onClick={() => socialLogin("kakao")}
                                src={KakaoLogin}
                                alt="카카오 로그인"
                                className="w-full cursor-pointer transition-all duration-200 hover:brightness-90 hover:scale-105 hover:shadow-lg rounded-lg"
                            />
                            <button
                                onClick={() => socialLogin("google")}
                                className="w-full bg-white rounded-lg flex items-center font-medium hover:brightness-90 hover:scale-105 hover:shadow-lg transition-all duration-200 border shadow-sm"
                                style={{
                                    fontFamily: 'Roboto, arial, sans-serif',
                                    height: 'auto',
                                    aspectRatio: '600/90',
                                    fontSize: '18px',
                                    color: 'var(--gray-800)'
                                }}
                            >
                                <div className="ml-3 mr-3 flex-shrink-0">
                                    <svg width="25" height="25" viewBox="0 0 48 48" className="block">
                                        <path fill="#EA4335"
                                              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4"
                                              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05"
                                              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853"
                                              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                </div>
                                <span className="flex-1 text-center pr-8">Google 로그인</span>
                            </button>
                            <button
                                onClick={() => socialLogin("naver")}
                                className="w-full rounded-lg flex items-center font-medium text-white hover:brightness-90 hover:scale-105 hover:shadow-lg transition-all duration-200 border shadow-sm"
                                style={{
                                    fontFamily: 'Roboto, arial, sans-serif',
                                    height: 'auto',
                                    aspectRatio: '600/90',
                                    fontSize: '18px',
                                    backgroundColor: '#03C75A'
                                }}
                            >
                                <div className="ml-4 mr-3 flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" className="block">
                                        <path fill="white"
                                              d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                                    </svg>
                                </div>
                                <span className="flex-1 text-center pr-8">네이버 로그인</span>
                            </button>
                        </div>

                        <div className="flex items-center my-6">
                            <div className="flex-1" style={{borderTop: '1px solid var(--gray-200)'}}></div>
                            <span className="px-4 text-sm" style={{color: 'var(--gray-500)'}}>또는</span>
                            <div className="flex-1" style={{borderTop: '1px solid var(--gray-200)'}}></div>
                        </div>

                        <div className="flex justify-center items-center">
                            <span
                                className="text-secondary-600 font-medium cursor-pointer hover:text-secondary-700 transition-colors duration-200">
                                이메일로 로그인
                            </span>
                        </div>
                    </div>
                    <div className="modal-footer justify-center">
                        <p className="text-xs leading-relaxed" style={{color: 'var(--gray-400)'}}>
                            로그인 시 <span className="text-primary cursor-pointer"
                                        onClick={() => window.open('/terms/service', '_blank')}>서비스 이용약관</span> 및 <span
                            className="text-primary cursor-pointer"
                            onClick={() => window.open('/terms/privacy', '_blank')}>개인정보처리방침</span>에 동의한 것으로 간주됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default LoginModal;