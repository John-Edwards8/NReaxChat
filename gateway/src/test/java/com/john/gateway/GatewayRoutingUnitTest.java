package com.john.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.route.RouteLocator;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

@SpringBootTest(
        classes = GatewayApplication.class,
        properties = {
                "AUTH_URL=http://auth.test",
                "CHAT_URL=http://chat.test",
                "FRONTEND_URL=http://front.prod",
                "FRONTEND_URL_DEV=http://front.dev"
        }
)
class GatewayRoutingUnitTest {

    @Autowired
    private RouteLocator routeLocator;

    @Test
    void shouldContainAuthAndChatRoutes() {
        Flux<Route> routes = routeLocator.getRoutes();

        StepVerifier.create(routes.map(Route::getUri))
                .expectNextMatches(uri -> uri.getHost().equals("auth.test") && uri.getPort() == 80)
                .expectNextMatches(uri -> uri.getHost().equals("chat.test") && uri.getPort() == 80)
                .thenCancel()
                .verify();
    }

    @Test
    void shouldHaveCorrectRouteIdsAndPredicates() {
        Flux<Route> routes = routeLocator.getRoutes();

        StepVerifier.create(routes)
                .expectNextMatches(route ->
                        "auth-service".equals(route.getId())
                                && route.getPredicate().toString().contains("/auth/**")
                )
                .expectNextMatches(route ->
                        "chat-service".equals(route.getId())
                                && route.getPredicate().toString().contains("/chat/**")
                )
                .thenCancel()
                .verify();
    }
}
