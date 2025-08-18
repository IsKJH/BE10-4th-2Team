package sp.releasetestbackend.account.service;

import sp.releasetestbackend.account.controller.response.SignUpResponse;
import sp.releasetestbackend.account_profile.controller.request.SignUpRequest;

public interface AccountService {
    SignUpResponse signUp(SignUpRequest signUpRequest, String token);
}
