import {Route, Routes} from "react-router-dom";
import React from "react";
import Home from "../../home/pages/Home.tsx";
import SignUp from "../components/pages/SignUp.tsx";

const Router: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/signup" element={<SignUp/>}/>
            </Routes>
        </>
    );
}
export default Router