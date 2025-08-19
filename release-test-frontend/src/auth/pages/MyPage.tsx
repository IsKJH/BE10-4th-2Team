import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { apiClient } from '../../shared/utils/api/Api.tsx';
import { showSuccessAlert, showErrorAlert, showConfirmAlert, showDeleteConfirmAlert } from '../../shared/utils/sweetAlert';

interface UserInfo {
    nickname: string;
    email: string;
    loginType: string;
    isNewUser: boolean;
}

const MyPage: React.FC = () => {
    const { logout } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNickname, setEditedNickname] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
            setEditedNickname(parsedUserInfo.nickname || '');
        }
    }, []);

    const handleEditNickname = () => {
        setIsEditing(true);
    };

    const handleSaveNickname = async () => {
        if (!editedNickname.trim()) {
            showErrorAlert('입력 오류', '닉네임을 입력해주세요.');
            return;
        }

        if (editedNickname === userInfo?.nickname) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            // apiClient를 사용하여 닉네임 업데이트
            await apiClient.put('/account/nickname', {
                nickname: editedNickname
            });
            
            // localStorage의 userInfo도 업데이트
            if (userInfo) {
                const updatedUserInfo = { ...userInfo, nickname: editedNickname };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                setUserInfo(updatedUserInfo);
                
                // 커스텀 이벤트 발생으로 다른 컴포넌트에 닉네임 변경 알림
                window.dispatchEvent(new CustomEvent('userInfoChange'));
            }
            
            setIsEditing(false);
            showSuccessAlert('변경 완료', '닉네임이 성공적으로 변경되었습니다.');
        } catch (error) {
            console.error('닉네임 변경 실패:', error);
            showErrorAlert('변경 실패', '닉네임 변경에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = useCallback(() => {
        setEditedNickname(userInfo?.nickname || '');
        setIsEditing(false);
    }, [userInfo?.nickname]);

    // ESC 키로 편집 취소
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isEditing) {
                handleCancelEdit();
            }
            // Enter 키로 저장
            if (event.key === 'Enter' && isEditing) {
                event.preventDefault();
                handleSaveNickname();
            }
        };

        if (isEditing) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditing, handleCancelEdit]);

    const getLoginTypeDisplay = (loginType: string) => {
        switch (loginType.toUpperCase()) {
            case 'KAKAO':
                return '카카오';
            case 'GOOGLE':
                return '구글';
            case 'NAVER':
                return '네이버';
            default:
                return loginType;
        }
    };

    if (!userInfo) {
        return (
            <div className="h-full bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50 py-12 px-4 content-center">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* 헤더 */}
                    <div className="bg-indigo-600 px-6 py-8">
                        <div className="flex items-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {userInfo.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-6">
                                <h1 className="text-3xl font-bold text-white">마이페이지</h1>
                                <p className="text-indigo-100 mt-2">계정 정보 관리</p>
                            </div>
                        </div>
                    </div>

                    {/* 사용자 정보 */}
                    <div className="p-6 space-y-6">
                        {/* 닉네임 */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-200">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    닉네임
                                </label>
                                {isEditing ? (
                                    <>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={editedNickname}
                                                onChange={(e) => setEditedNickname(e.target.value)}
                                                className="text-lg text-gray-900 border border-gray-300 rounded-md px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                                placeholder="닉네임을 입력하세요"
                                                aria-label="닉네임 편집"
                                                autoFocus
                                                maxLength={20}
                                                disabled={isSaving}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                                {editedNickname.length}/20
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            💡 ESC키: 취소 | Enter키: 저장
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-lg text-gray-900">{userInfo.nickname}</p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSaveNickname}
                                            disabled={isSaving || !editedNickname.trim() || editedNickname === userInfo?.nickname}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                            aria-label="닉네임 저장"
                                        >
                                            {isSaving && (
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {isSaving ? '저장 중...' : '저장'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            aria-label="편집 취소"
                                        >
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditNickname}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                        aria-label="닉네임 수정"
                                    >
                                        수정
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 이메일 */}
                        <div className="py-4 border-b border-gray-200">
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                이메일
                            </label>
                            <p className="text-lg text-gray-900">{userInfo.email}</p>
                        </div>

                        {/* 로그인 방식 */}
                        <div className="py-4 border-b border-gray-200">
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                로그인 방식
                            </label>
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    {getLoginTypeDisplay(userInfo.loginType)}
                                </span>
                            </div>
                        </div>

                        {/* 계정 관리 */}
                        <div className="py-4">
                            <label className="text-sm font-medium text-gray-700 block mb-3">
                                계정 관리
                            </label>
                            <div className="space-y-3">
                                <button
                                    onClick={async () => {
                                        const result = await showConfirmAlert('로그아웃', '정말 로그아웃하시겠습니까?');
                                        if (result.isConfirmed) {
                                            logout();
                                        }
                                    }}
                                    className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                                    aria-label="로그아웃"
                                >
                                    로그아웃
                                </button>
                                <button
                                    onClick={async () => {
                                        const firstConfirm = await showDeleteConfirmAlert('⚠️ 계정 삭제 경고', '계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.\n\n정말로 계정을 삭제하시겠습니까?');
                                        if (firstConfirm.isConfirmed) {
                                            const finalConfirm = await showDeleteConfirmAlert('마지막 확인', '계정 삭제를 진행하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.');
                                            if (finalConfirm.isConfirmed) {
                                                try {
                                                    // apiClient를 사용하여 계정 삭제
                                                    await apiClient.delete('/account');

                                                    // 로컬 스토리지 정리
                                                    localStorage.removeItem('accessToken');
                                                    localStorage.removeItem('tempToken');
                                                    localStorage.removeItem('userInfo');
                                                    
                                                    await showSuccessAlert('삭제 완료', '계정이 성공적으로 삭제되었습니다.');
                                                    
                                                    // 홈페이지로 이동
                                                    window.location.href = '/';
                                                } catch (error) {
                                                    console.error('계정 삭제 실패:', error);
                                                    showErrorAlert('삭제 실패', '계정 삭제에 실패했습니다.');
                                                }
                                            }
                                        }
                                    }}
                                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                                    aria-label="계정 삭제"
                                >
                                    계정 삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;