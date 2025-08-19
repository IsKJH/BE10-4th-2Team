import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TermsService from "./shared/terms/TermsService.tsx";
import PrivacyPolicy from "./shared/terms/PrivacyPolicy.tsx";
import DashboardPage from "./home/pages/DashboardPage.tsx";
function App() {
    const isLoggedIn = true;

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* 헤더 없는 약관 페이지들 */}
                    <Route path="/terms/service" element={<TermsService/>}/>
                    <Route path="/terms/privacy" element={<PrivacyPolicy/>}/>
                    <Route path="/" element={isLoggedIn ? <DashboardPage /> : <div>로그인 페이지</div>} />
                    {/* 헤더 있는 일반 페이지들 */}
                    {/*<Route path="/*" element={*/}
                    {/*    <Layout>*/}
                    {/*        <Router/>*/}
                    {/*    </Layout>*/}
                    {/*}/>*/}
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
