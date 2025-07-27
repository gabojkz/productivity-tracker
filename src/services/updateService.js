// Tauri APIs - will be undefined in browser environment
let invoke, listen;

// Initialize Tauri APIs if available
async function initTauriApis() {
  try {
    const tauriApi = await import('@tauri-apps/api/tauri');
    const eventApi = await import('@tauri-apps/api/event');
    invoke = tauriApi.invoke;
    listen = eventApi.listen;
    return true;
  } catch (error) {
    // Running in browser environment, not Tauri
    console.warn('Tauri APIs not available - running in browser mode');
    return false;
  }
}

class UpdateService {
  constructor() {
    this.isUpdateAvailable = false
    this.updateInfo = null
    this.listeners = {}
    this.init()
  }

  async init() {
    // Initialize Tauri APIs if available
    await initTauriApis();
    this.setupListeners()
  }

  async setupListeners() {
    // Only setup listeners if Tauri APIs are available
    if (!listen) {
      console.warn('Tauri APIs not available - skipping update listeners');
      return;
    }

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
    if (!invoke) {
      console.warn('Tauri APIs not available - cannot check for updates');
      return;
    }

    try {
      await invoke('plugin:updater|check')
      console.log('Update check initiated')
    } catch (error) {
      console.error('Failed to check for updates:', error)
    }
  }

  async installUpdate() {
    if (!invoke) {
      console.warn('Tauri APIs not available - cannot install update');
      return;
    }

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
    if (!invoke) {
      return '0.1.0' // fallback for browser environment
    }

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