export default interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  scope: string
  tokenType: string
}
