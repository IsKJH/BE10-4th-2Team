package sp.releasetestbackend.account.service;

import sp.releasetestbackend.account.controller.response.SignUpResponse;
import sp.releasetestbackend.account_profile.controller.request.SignUpRequest;
import sp.releasetestbackend.account.controller.AccountController.UpdateNicknameRequest;

public interface AccountService {
    SignUpResponse signUp(SignUpRequest signUpRequest, String token);
    void updateNickname(UpdateNicknameRequest request, String token);
    void deleteAccount(String token);
}
