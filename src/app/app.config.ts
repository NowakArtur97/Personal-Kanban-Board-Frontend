import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { APOLLO_PROVIDERS } from './graphql.provider';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpLink } from 'apollo-angular/http';
import { Apollo } from 'apollo-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    Apollo,
    HttpLink,
    ...APOLLO_PROVIDERS,
  ],
};
