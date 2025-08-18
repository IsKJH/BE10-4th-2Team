package sp.releasetestbackend.account_profile.controller.request;

import sp.releasetestbackend.account.entity.LoginType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private LoginType loginType;
    private String email;
    private String nickname;
}
