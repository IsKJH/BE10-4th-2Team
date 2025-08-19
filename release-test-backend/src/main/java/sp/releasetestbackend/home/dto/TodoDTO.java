package sp.releasetestbackend.home.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import sp.releasetestbackend.home.entity.Priority;


public class TodoDTO {

    @Getter
    @Setter
    public static class Create { // 할 일을 생성할 때 받을 데이터
        private String text;
        private Priority priority;
        private LocalDate dueDate;
    }

    @Getter
    @Setter
    public static class Update { // 할 일을 수정할 때 받을 데이터
        private String text;
        private Priority priority;
    }
}