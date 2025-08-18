package sp.releasetestbackend.googleLogin.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Repository;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Repository
public class GoogleLoginRepository {
    private final String grantType = "authorization_code";
    private final String loginUrl;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final String tokenRequestUri;
    private final String userInfoRequestUri;

    private final RestTemplate restTemplate;

    public GoogleLoginRepository(
            @Value("${google.login-url}") String loginUrl,
            @Value("${google.client-id}") String clientId,
            @Value("${google.client-secret}") String clientSecret,
            @Value("${google.redirect-uri}") String redirectUri,
            @Value("${google.token-request-uri}") String tokenRequestUri,
            @Value("${google.user-info-request-uri}") String userInfoRequestUri,
            RestTemplate restTemplate) {
        this.loginUrl = loginUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.tokenRequestUri = tokenRequestUri;
        this.userInfoRequestUri = userInfoRequestUri;

        this.restTemplate = restTemplate;
    }

    public String getAccessCode() {
        return String.format("%s?client_id=%s&redirect_uri=%s&response_type=code&scope=openid%%20email%%20profile",
                loginUrl, clientId, redirectUri);
    }

    public Map<String, Object> getAccessToken(String code) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("code", code);
        formData.add("grant_type", grantType);
        formData.add("redirect_uri", redirectUri);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(formData, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                tokenRequestUri, HttpMethod.POST, entity, Map.class);

        return response.getBody();
    }

    public Map<String, Object> getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                userInfoRequestUri, HttpMethod.GET, entity, Map.class);

        return response.getBody();
    }
}
