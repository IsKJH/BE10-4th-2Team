import React, { useState } from 'react';
import LoginModal from '../../modals/LoginModal';

const LoginRequired: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const openLoginModal = () => {
        setShowLoginModal(true);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* 아이콘 */}
                    <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    {/* 제목 */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        로그인이 필요합니다
                    </h1>

                    {/* 로그인 버튼 */}
                    <button
                        onClick={openLoginModal}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 font-medium cursor-pointer"
                    >
                        로그인하기
                    </button>

                    {/* 추가 안내 */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            아직 계정이 없으신가요?<br />
                            간단하게 소셜로그인으로 가입하세요!
                        </p>
                    </div>
                </div>
            </div>

            {/* 로그인 모달 */}
            {showLoginModal && <LoginModal closeLoginModal={closeLoginModal} />}
        </div>
    );
};

export default LoginRequired;