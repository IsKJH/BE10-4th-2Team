import './App.css'
import Layout from "./shared/components/layouts/Layout";
import Router from "./shared/routers/Router";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TermsService from "./shared/terms/TermsService";
import PrivacyPolicy from "./shared/terms/PrivacyPolicy";

function App() {

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    {/* 헤더 없는 약관 페이지들 */}
                    <Route path="/terms/service" element={<TermsService/>}/>
                    <Route path="/terms/privacy" element={<PrivacyPolicy/>}/>
                    {/*사이드바 있는 일반 페이지들*/}
                    <Route path="/*" element={
                        <Layout>
                            <Router/>
                        </Layout>
                    }/>
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App
