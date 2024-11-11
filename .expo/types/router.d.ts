/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/CitizenLogin` | `/CitizenPhoto` | `/CitizenSignup` | `/MainPage` | `/Signup` | `/UsernamePhoto` | `/_sitemap` | `/services/barangayservice` | `/services/markerservice` | `/services/servicerequest` | `/services/userservice` | `/types/assistancereport` | `/types/barangay` | `/types/marker` | `/types/photo` | `/types/servicerequest` | `/types/user` | `/utils/handleAxiosError` | `/utils/validateUser`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
