import TodoInsert from "./TodoInsert.tsx";


interface TodoModalProps {
    onClose: () => void;
    onInsert: (text: string) => void;
}

const TodoModal: React.FC<TodoModalProps> = ({onClose, onInsert}) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>새로운 할 일 추가</h3>
                <p>오늘의 할 일을 입력해 주세요.</p>
                <TodoInsert onInsert={onInsert} />
                <button className="close-btn" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default TodoModal;