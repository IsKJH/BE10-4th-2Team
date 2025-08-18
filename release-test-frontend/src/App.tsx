import './App.css'
import Layout from "./shared/components/layouts/Layout.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Router from "./shared/routers/Router";
import TermsService from "./shared/terms/TermsService.tsx";
import PrivacyPolicy from "./shared/terms/PrivacyPolicy.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* 헤더 없는 약관 페이지들 */}
                    <Route path="/terms/service" element={<TermsService/>}/>
                    <Route path="/terms/privacy" element={<PrivacyPolicy/>}/>
                    
                    {/* 헤더 있는 일반 페이지들 */}
                    <Route path="/*" element={
                        <Layout>
                            <Router/>
                        </Layout>
                    }/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
