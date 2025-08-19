package sp.releasetestbackend.dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sp.releasetestbackend.config.auth.AuthUtils;
import sp.releasetestbackend.dashboard.dto.DashboardResponseDTO;
import sp.releasetestbackend.dashboard.service.DashboardService;

@RestController
@RequestMapping("api/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {
    private final DashboardService dashboardService;
    private final AuthUtils authUtils;

    @GetMapping
    public DashboardResponseDTO getDashboardData(@RequestHeader("Authorization") String token) {
        Long accountId = authUtils.getAccountIdFromToken(token);
        return dashboardService.getDashboardData(accountId);
    }
}
