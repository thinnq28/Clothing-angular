import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';

import { AppRoutes, routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TokenService } from './service/token.service';
import { LoginComponent } from './admin/login/login.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AdminAppRoutes } from './admin/app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true

    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    TokenService,
    AppRoutes,
    AdminAppRoutes
  ]
};
