import React, {useState, useEffect} from "react";
import {useAuth} from "@/auth/hooks/useAuth";
import {Input, Button} from "@/shared/components/ui";

const SignUp: React.FC = () => {
    const {signUp} = useAuth();
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [loginType, setLoginType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 동의 상태
    const [agreements, setAgreements] = useState({
        serviceTerms: false,      // 서비스 이용약관 (필수)
        privacyPolicy: false,     // 개인정보처리방침 (필수)
        marketing: false,         // 마케팅 정보 수신 (선택)
    });
    const [allAgreed, setAllAgreed] = useState(false);

    useEffect(() => {
        // localStorage에서 카카오 로그인 정보 가져오기
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setEmail(parsedUserInfo.email || "");
            setNickname(parsedUserInfo.nickname || "");
            setLoginType(parsedUserInfo.loginType || "");
        }
    }, []);

    // 전체 동의 상태 업데이트
    useEffect(() => {
        const requiredAgreements = [agreements.serviceTerms, agreements.privacyPolicy];
        const optionalAgreements = [agreements.marketing];
        const allRequiredAgreed = requiredAgreements.every(agreed => agreed);
        const allOptionalAgreed = optionalAgreements.every(agreed => agreed);

        setAllAgreed(allRequiredAgreed && allOptionalAgreed);
    }, [agreements]);

    // 개별 동의 체크박스 핸들러
    const handleAgreementChange = (key: keyof typeof agreements) => {
        setAgreements(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // 전체 동의 체크박스 핸들러
    const handleAllAgreementChange = () => {
        const newValue = !allAgreed;
        setAgreements({
            serviceTerms: newValue,
            privacyPolicy: newValue,
            marketing: newValue,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nickname.trim() || !email.trim()) {
            alert("닉네임과 이메일을 모두 입력해주세요.");
            return;
        }

        // 필수 동의 항목 검증
        if (!agreements.serviceTerms || !agreements.privacyPolicy) {
            alert("필수 동의 항목을 모두 체크해주세요.");
            return;
        }

        setIsLoading(true);
        try {
            await signUp({nickname, email, loginType: loginType.toUpperCase()});
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold" style={{color: 'var(--gray-900)'}}>
                        회원가입
                    </h1>
                    <p className="mt-2 text-sm" style={{color: 'var(--gray-600)'}}>
                        서비스 이용을 위한 추가 정보를 입력해주세요
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-lg rounded-xl" style={{borderColor: 'var(--gray-200)', border: '1px solid'}}>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="이메일"
                            value={email}
                            disabled={true}
                            variant="filled"
                            size="md"
                            fullWidth
                        />

                        <Input
                            id="nickname"
                            name="nickname"
                            type="text"
                            label="닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            placeholder="닉네임을 입력하세요"
                            size="md"
                            fullWidth
                        />

                        <div>
                            <fieldset>
                                <legend className="text-sm font-medium text-gray-900 mb-4">약관 동의</legend>

                                <div className="space-y-4">
                                    {/* 전체 동의 */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="relative flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="all-agreements"
                                                    type="checkbox"
                                                    checked={allAgreed}
                                                    onChange={handleAllAgreementChange}
                                                    className="h-4 w-4 rounded transition-colors"
                                    style={{
                                        accentColor: 'var(--primary-500)',
                                        borderColor: 'var(--gray-300)'
                                    }}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="all-agreements" className="font-medium" style={{color: 'var(--gray-700)'}}>
                                                    전체 동의
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 개별 동의 항목들 */}
                                    <div className="space-y-3">
                                        {/* 서비스 이용약관 (필수) */}
                                        <div className="relative flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="service-terms"
                                                    type="checkbox"
                                                    checked={agreements.serviceTerms}
                                                    onChange={() => handleAgreementChange('serviceTerms')}
                                                    className="h-4 w-4 rounded transition-colors"
                                    style={{
                                        accentColor: 'var(--primary-500)',
                                        borderColor: 'var(--gray-300)'
                                    }}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm flex-1 flex justify-between items-center">
                                                <label htmlFor="service-terms" style={{color: 'var(--gray-700)'}}>
                                                    <span className="text-danger">[필수]</span> 서비스 이용약관
                                                </label>
                                                <button
                                                    type="button"
                                                    className="text-primary hover:text-primary text-sm underline transition-colors"
                                                    onClick={() => window.open('/terms/service', '_blank')}
                                                >
                                                    보기
                                                </button>
                                            </div>
                                        </div>

                                        {/* 개인정보처리방침 (필수) */}
                                        <div className="relative flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="privacy-policy"
                                                    type="checkbox"
                                                    checked={agreements.privacyPolicy}
                                                    onChange={() => handleAgreementChange('privacyPolicy')}
                                                    className="h-4 w-4 rounded transition-colors"
                                    style={{
                                        accentColor: 'var(--primary-500)',
                                        borderColor: 'var(--gray-300)'
                                    }}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm flex-1 flex justify-between items-center">
                                                <label htmlFor="privacy-policy" style={{color: 'var(--gray-700)'}}>
                                                    <span className="text-danger">[필수]</span> 개인정보처리방침
                                                </label>
                                                <button
                                                    type="button"
                                                    className="text-primary hover:text-primary text-sm underline transition-colors"
                                                    onClick={() => window.open('/terms/privacy', '_blank')}
                                                >
                                                    보기
                                                </button>
                                            </div>
                                        </div>

                                        {/* 마케팅 정보 수신 (선택) */}
                                        <div className="relative flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="marketing"
                                                    type="checkbox"
                                                    checked={agreements.marketing}
                                                    onChange={() => handleAgreementChange('marketing')}
                                                    className="h-4 w-4 rounded transition-colors"
                                    style={{
                                        accentColor: 'var(--primary-500)',
                                        borderColor: 'var(--gray-300)'
                                    }}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="marketing" style={{color: 'var(--gray-700)'}}>
                                                    <span style={{color: 'var(--gray-500)'}}>[선택]</span> 마케팅 정보 수신 동의
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={isLoading || !agreements.serviceTerms || !agreements.privacyPolicy}
                                loading={isLoading}
                                variant="primary"
                                size="md"
                                fullWidth
                            >
                                {isLoading ? "회원가입 중..." : "회원가입"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;