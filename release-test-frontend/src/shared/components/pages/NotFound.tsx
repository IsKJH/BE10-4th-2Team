import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-300">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
                <p className="text-gray-500 mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default NotFound;