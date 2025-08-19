// import React from 'react';
// import ReleaseListItem from "./ReleaseListItem";
// import type {Release} from "../types/release";
// import '../style/TodoList.css';
//
// interface ReleaseListProps {
//     releases: Release[];
//     onRemove: (id: number) => void;
//     onToggle: (id: number) => void;
// }
//
// const ReleaseList:React.FC<ReleaseListProps> = ({ releases, onRemove, onToggle }) => {
//     return (
//         <div className="ReleaseList">
//             {releases.map(release => (
//                 <ReleaseListItem release={release} key={release.id} onRemove={onRemove} onToggle={onToggle} />
//             ))}
//         </div>
//     );
// };
// export default ReleaseList;