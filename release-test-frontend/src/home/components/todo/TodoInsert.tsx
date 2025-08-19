import React, { useState, useCallback } from 'react';
import '../../style/todo/TodoInsert.css';

interface TodoInsertProps { onInsert: (text: string) => void; }

const TodoInsert: React.FC<TodoInsertProps> = ({ onInsert }) => {
    const [value, setValue] = useState('');
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);
    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onInsert(value);
        setValue('');
    }, [onInsert, value]);

    return (
        <form className="TodoInsert" onSubmit={onSubmit}>
            <input
                placeholder="예: 프로젝트 회의"
                value={value}
                onChange={onChange}
                autoFocus // 모달이 뜨면 바로 입력할 수 있도록 포커스
            />
            <button type="submit">추가</button>
        </form>
    );
};
export default TodoInsert;