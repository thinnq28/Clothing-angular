export interface LoginDataResponse {
    tokenType: string;
    id: string;
    username: string;
    roles: string[];
    token: string;
    refresh_token: string;
}
  