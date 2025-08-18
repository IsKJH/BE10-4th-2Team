import React from "react";
import MobileNav from "./MobileNav.tsx";
import DeskTopNav from "./DeskTopNav.tsx";
import {Link} from 'react-router-dom';

interface HeaderProps {
    showLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({showLoginModal}) => {
    return (
        <div className="relative flex w-full border-b border-gray-200 shadow-sm">
            <header className="sticky top-0 z-40 w-full">
                <div className=" mx-auto px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                            <h1 className="text-2xl font-bold">
                                <Link to="/">
                                    오늘 뭐할까?
                                </Link>
                            </h1>
                        </div>

                        {/* 데스크탑 */}
                        <DeskTopNav showLoginModal={showLoginModal}/>

                        {/* 모바일 */}
                        <MobileNav showLoginModal={showLoginModal}/>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;