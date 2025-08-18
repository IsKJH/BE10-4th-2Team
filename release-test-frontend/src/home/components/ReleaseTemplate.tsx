import React from 'react';
import '../style/ReleaseTemplate.css';

const ReleaseTemplate: React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <div className="ReleaseTemplate">
            <div className="app-title">To Do Lists</div>
            <div className="content">{children}</div>
        </div>
    );
};
export default ReleaseTemplate;