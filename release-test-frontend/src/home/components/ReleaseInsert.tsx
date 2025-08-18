import React, { useState, useCallback } from "react";
import '../style/ReleaseInsert.css';

interface ReleaseInsertProps {
    onInsert: (text: string) => void;
}

const ReleaseInsert: React.FC<ReleaseInsertProps> = ({ onInsert }) => {
    const [value, setValue] = useState('');

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        onInsert(value);
        setValue('');
        e.preventDefault();
    }, [onInsert, value]);

    return (
        <form className="ReleaseInsert" onSubmit={onSubmit}>
            <input placeholder="Add yout release..." value={value} onChange={onChange} />
            <button type="submit">추가</button>
        </form>
    );
};
export default ReleaseInsert;