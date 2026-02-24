export function notifyUnauthorized() {
  window.dispatchEvent(new CustomEvent('auth:unauthorized'))
}

export function isAuthError(status: number): boolean {
  return status === 401 || status === 403
}
