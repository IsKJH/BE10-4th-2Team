import React, {useState, useEffect} from "react";
import {useAuth} from "../../hooks/useAuth";

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
            await signUp({nickname, email, loginType: loginType});
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        회원가입
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        서비스 이용을 위한 추가 정보를 입력해주세요
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    disabled={true}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                                닉네임
                            </label>
                            <div className="mt-1">
                                <input
                                    id="nickname"
                                    name="nickname"
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="닉네임을 입력하세요"
                                />
                            </div>
                        </div>

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
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="all-agreements" className="font-medium text-gray-700">
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
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm flex-1 flex justify-between items-center">
                                                <label htmlFor="service-terms" className="text-gray-700">
                                                    <span className="text-red-600">[필수]</span> 서비스 이용약관
                                                </label>
                                                <button
                                                    type="button"
                                                    className="text-indigo-600 hover:text-indigo-500 text-sm underline cursor-pointer"
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
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm flex-1 flex justify-between items-center">
                                                <label htmlFor="privacy-policy" className="text-gray-700">
                                                    <span className="text-red-600">[필수]</span> 개인정보처리방침
                                                </label>
                                                <button
                                                    type="button"
                                                    className="text-indigo-600 hover:text-indigo-500 text-sm underline cursor-pointer"
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
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="marketing" className="text-gray-700">
                                                    <span className="text-gray-500">[선택]</span> 마케팅 정보 수신 동의
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !agreements.serviceTerms || !agreements.privacyPolicy}
                                className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isLoading ? "회원가입 중..." : "회원가입"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;