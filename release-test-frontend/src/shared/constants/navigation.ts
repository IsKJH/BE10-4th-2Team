// 네비게이션 관련 상수 (Sidebar와 동기화)
export const NAV_ITEMS = [
    { name: "대시보드", path: "/" },
    { name: "오늘 할 일", path: "/today" },
    { name: "내일 할 일", path: "/tomorrow" },
    { name: "중요 업무", path: "/important" },
    { name: "캘린더", path: "/calendar" },
    { name: "완료된 업무", path: "/completed" },
    { name: "마이페이지", path: "/mypage" },
] as const;