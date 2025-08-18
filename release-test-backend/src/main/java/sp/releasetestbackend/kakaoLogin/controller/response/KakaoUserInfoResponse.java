package sp.releasetestbackend.kakaoLogin.controller.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoUserInfoResponse {
    private String token;
    private String tempToken;
    private String nickname;
    private String email;
    private Boolean isNewUser;

    public KakaoUserInfoResponse(String token, String tempToken, String nickname, String email, Boolean isNewUser) {
        this.token = token;
        this.tempToken = tempToken;
        this.nickname = nickname;
        this.isNewUser = isNewUser;
        this.email = email;
    }
}
