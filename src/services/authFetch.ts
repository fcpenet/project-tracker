export function notifyUnauthorized() {
  window.dispatchEvent(new CustomEvent('auth:unauthorized'))
}
