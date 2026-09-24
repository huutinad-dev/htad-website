// Brand graphics for the Payload admin (login screen logo + nav icon).
export function AdminLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/logo-horizontal.png" alt="Huu Tin Trading & Advertising" width={332} height={113} style={{ width: 260, height: 'auto' }} />
  )
}

export function AdminIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/emblem.png" alt="HTAd" width={256} height={256} style={{ width: 28, height: 28 }} />
  )
}
