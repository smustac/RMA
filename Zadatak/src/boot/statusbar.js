import { Capacitor } from '@capacitor/core'

export default async () => {
  if (!Capacitor.isNativePlatform()) return

  try {
    const { StatusBar } = await import('@capacitor/status-bar')

    // KEY: prevents overlap
    await StatusBar.setOverlaysWebView({ overlay: false })

    // Optional: match your header color
    await StatusBar.setBackgroundColor({ color: '#1976D2' })
  } catch (e) {
    console.warn('StatusBar boot failed:', e)
  }
}
