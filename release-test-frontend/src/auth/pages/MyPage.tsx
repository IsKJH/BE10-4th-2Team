import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { apiClient } from '@/shared/utils/api/Api';
import { showSuccessAlert, showErrorAlert, showConfirmAlert, showDeleteConfirmAlert } from '@/shared/utils/sweetAlert';
import { Button, Input } from '@/shared/components/ui';
import { FiUser, FiMail, FiShield, FiEdit3, FiSave, FiX, FiLogOut, FiTrash2 } from 'react-icons/fi';

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
            <div className="view-container">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>마이페이지</h1>
                <p>계정 정보를 관리할 수 있습니다</p>
            </header>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* 프로필 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br bg-amber-500 from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                            {userInfo.nickname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{userInfo.nickname}</h2>
                            <p className="text-gray-500">{userInfo.email}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* 닉네임 카드 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <FiUser className="text-secondary-600" />
                                <h3 className="font-medium text-gray-900">닉네임</h3>
                            </div>
                            {isEditing ? (
                                <div className="space-y-3">
                                    <Input
                                        value={editedNickname}
                                        onChange={(e) => setEditedNickname(e.target.value)}
                                        placeholder="닉네임을 입력하세요"
                                        disabled={isSaving}
                                        maxLength={20}
                                        fullWidth
                                        autoFocus
                                    />
                                    <div className="text-xs text-gray-400 text-right">
                                        {editedNickname.length}/20
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={handleSaveNickname}
                                            disabled={isSaving || !editedNickname.trim() || editedNickname === userInfo?.nickname}
                                            loading={isSaving}
                                            fullWidth
                                        >
                                            <FiSave className="mr-2" />
                                            저장
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            fullWidth
                                        >
                                            <FiX className="mr-2" />
                                            취소
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        💡 ESC: 취소 | Enter: 저장
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-lg font-medium text-gray-900">{userInfo.nickname}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleEditNickname}
                                        fullWidth
                                    >
                                        <FiEdit3 className="mr-2" />
                                        수정하기
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* 이메일 카드 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <FiMail className="text-secondary-600" />
                                <h3 className="font-medium text-gray-900">이메일</h3>
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-3">{userInfo.email}</p>
                            <div className="text-sm text-gray-500">
                                이메일은 변경할 수 없습니다
                            </div>
                        </div>

                        {/* 로그인 방식 카드 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <FiShield className="text-secondary-600" />
                                <h3 className="font-medium text-gray-900">로그인 방식</h3>
                            </div>
                            <div className="mb-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800">
                                    {getLoginTypeDisplay(userInfo.loginType)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                소셜 로그인으로 가입됨
                            </div>
                        </div>
                    </div>
                </div>

                {/* 계정 관리 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">계정 관리</h3>
                    
                    <div className="space-y-4">
                        {/* 로그아웃 */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <FiLogOut className="text-red-600" size={18} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">로그아웃</h4>
                                    <p className="text-sm text-gray-500">현재 세션을 종료합니다</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={async () => {
                                    const result = await showConfirmAlert('로그아웃', '정말 로그아웃하시겠습니까?');
                                    if (result.isConfirmed) {
                                        logout();
                                    }
                                }}
                            >
                                로그아웃
                            </Button>
                        </div>

                        {/* 계정 삭제 */}
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <FiTrash2 className="text-red-600" size={18} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-red-900">계정 삭제</h4>
                                    <p className="text-sm text-red-600">모든 데이터가 영구적으로 삭제됩니다</p>
                                </div>
                            </div>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={async () => {
                                    const firstConfirm = await showDeleteConfirmAlert('⚠️ 계정 삭제 경고', '계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.\n\n정말로 계정을 삭제하시겠습니까?');
                                    if (firstConfirm.isConfirmed) {
                                        const finalConfirm = await showDeleteConfirmAlert('마지막 확인', '계정 삭제를 진행하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.');
                                        if (finalConfirm.isConfirmed) {
                                            try {
                                                await apiClient.delete('/account');
                                                localStorage.removeItem('accessToken');
                                                localStorage.removeItem('tempToken');
                                                localStorage.removeItem('userInfo');
                                                await showSuccessAlert('삭제 완료', '계정이 성공적으로 삭제되었습니다.');
                                                window.location.href = '/';
                                            } catch (error) {
                                                console.error('계정 삭제 실패:', error);
                                                showErrorAlert('삭제 실패', '계정 삭제에 실패했습니다.');
                                            }
                                        }
                                    }
                                }}
                            >
                                삭제하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;