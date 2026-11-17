import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, LOCALE_ID } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Sem isso o HttpClient do service não funciona (NullInjectorError)
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: "pt-BR" },
  ],
};
