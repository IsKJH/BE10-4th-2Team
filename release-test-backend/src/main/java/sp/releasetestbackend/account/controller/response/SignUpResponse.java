package sp.releasetestbackend.account.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignUpResponse {
    private boolean success;
    private String message;
    private SignUpData data;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SignUpData {
        private Long id;
        private String email;
        private String nickname;
        private String userToken;
    }

    public SignUpResponse(boolean success, String message, SignUpData data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
