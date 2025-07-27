import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

class UpdateService {
  constructor() {
    this.isUpdateAvailable = false
    this.updateInfo = null
    this.listeners = {}
    this.setupListeners()
  }

  async setupListeners() {
    // Listen for update events
    await listen('tauri://update-available', (event) => {
      console.log('Update available:', event.payload)
      this.isUpdateAvailable = true
      this.updateInfo = event.payload
      this.showUpdateNotification()
    })

    await listen('tauri://update-progress', (event) => {
      console.log('Update progress:', event.payload)
      this.showUpdateProgress(event.payload)
    })

    await listen('tauri://update-downloaded', (event) => {
      console.log('Update downloaded:', event.payload)
      this.showUpdateReady()
    })

    await listen('tauri://update-error', (event) => {
      console.error('Update error:', event.payload)
      this.showUpdateError(event.payload)
    })
  }

  async checkForUpdates() {
    try {
      await invoke('plugin:updater|check')
      console.log('Update check initiated')
    } catch (error) {
      console.error('Failed to check for updates:', error)
    }
  }

  async installUpdate() {
    try {
      await invoke('plugin:updater|install')
      console.log('Update installation initiated')
    } catch (error) {
      console.error('Failed to install update:', error)
    }
  }

  showUpdateNotification() {
    // You can integrate this with your UI notification system
    if (this.updateInfo) {
      const message = `Update available: ${this.updateInfo.version}`
      console.log(message)
      
      // Show a notification to the user
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Productivity Tracker Update', {
          body: `Version ${this.updateInfo.version} is available`,
          icon: '/tauri.svg'
        })
      }
    }
  }

  showUpdateProgress(progress) {
    console.log(`Download progress: ${progress.chunk_len}/${progress.content_len}`)
    // You can show a progress bar in your UI
  }

  showUpdateReady() {
    console.log('Update is ready to install')
    // You can show a dialog asking user to restart
    if (confirm('Update downloaded! Restart now to install?')) {
      this.installUpdate()
    }
  }

  showUpdateError(error) {
    console.error('Update failed:', error)
    // You can show an error message to the user
  }

  // Get current app version
  async getCurrentVersion() {
    try {
      return await invoke('plugin:updater|get_current_version')
    } catch (error) {
      console.error('Failed to get current version:', error)
      return '0.1.0' // fallback
    }
  }

  // Check if update is available
  getUpdateAvailable() {
    return this.isUpdateAvailable
  }

  // Get update info
  getUpdateInfo() {
    return this.updateInfo
  }

  // Event system methods
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }
}

export default new UpdateService() 