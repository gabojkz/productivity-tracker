<template>
  <div class="settings">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-0">Settings</h1>
        <p class="text-muted">Configure your productivity tracker preferences</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <!-- General Settings -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">General Settings</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Default Focus Session Duration</label>
                  <select class="form-select" v-model="settings.defaultSessionDuration">
                    <option value="25">25 minutes (Pomodoro)</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Work Hours Per Day</label>
                  <input type="number" class="form-control" v-model="settings.workHoursPerDay" min="1" max="24">
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Default Task Priority</label>
                  <select class="form-select" v-model="settings.defaultTaskPriority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Time Zone</label>
                  <select class="form-select" v-model="settings.timezone">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">User Profile</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" v-model="settings.userProfile.fullName" placeholder="Enter your full name">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Date of Birth</label>
                  <input type="date" class="form-control" v-model="settings.userProfile.dateOfBirth">
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Life Expectancy (years)</label>
                  <input type="number" class="form-control" v-model="settings.userProfile.lifeExpectancy" min="50" max="120" step="1">
                  <small class="text-muted">Used for Momento Mori calculations</small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Age</label>
                  <input type="text" class="form-control" :value="calculatedAge" readonly>
                  <small class="text-muted">Automatically calculated from date of birth</small>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="settings.userProfile.email" placeholder="your.email@example.com">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Preferred Language</label>
                  <select class="form-select" v-model="settings.userProfile.language">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Settings -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Calendar Settings</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Default Calendar View</label>
                  <select class="form-select" v-model="settings.calendar.defaultView">
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    <option value="full">Full Year</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Week Start Day</label>
                  <select class="form-select" v-model="settings.calendar.weekStartDay">
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Default Event Duration (hours)</label>
                  <input type="number" class="form-control" v-model="settings.calendar.defaultEventDuration" min="0.5" max="24" step="0.5">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Default Event Category</label>
                  <select class="form-select" v-model="settings.calendar.defaultEventCategory">
                    <option value="">None</option>
                    <option value="1">Work</option>
                    <option value="2">Personal</option>
                    <option value="3">Meeting</option>
                    <option value="4">Education</option>
                    <option value="5">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.calendar.showWeekends">
                  <label class="form-check-label">Show Weekends</label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.calendar.showEventDots">
                  <label class="form-check-label">Show Event Indicators</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.calendar.enableDragAndDrop">
                  <label class="form-check-label">Enable Drag & Drop Events</label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.calendar.showTodayHighlight">
                  <label class="form-check-label">Highlight Today</label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Business Hours Start</label>
                  <input type="time" class="form-control" v-model="settings.calendar.businessHoursStart">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Business Hours End</label>
                  <input type="time" class="form-control" v-model="settings.calendar.businessHoursEnd">
                </div>
              </div>
            </div>


            <!-- Calendar Bank Holidays -->
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">  
                  <label class="form-label">Calendar Bank Holidays</label>
                  <select class="form-select" v-model="settings.calendar.bankHolidays">
                    <option value="None">None</option>
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="PT">Portugal</option>
                    <option value="ES">Spain</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="IT">Italy</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="SE">Sweden</option>
                    <option value="AR">Argentina</option>
                    <option value="BR">Brazil</option>
                    <option value="CL">Chile</option>
                    <option value="CO">Colombia</option>
                    <option value="MX">Mexico</option>
                    <option value="PE">Peru</option>
                    <option value="VE">Venezuela</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Notifications -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Notifications</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.notifications.sessionReminders">
                  <label class="form-check-label">Session Reminders</label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.notifications.taskDueReminders">
                  <label class="form-check-label">Task Due Reminders</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.notifications.breakReminders">
                  <label class="form-check-label">Break Reminders</label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" v-model="settings.notifications.dailySummary">
                  <label class="form-check-label">Daily Summary</label>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Reminder Sound</label>
                  <select class="form-select" v-model="settings.notifications.sound">
                    <option value="default">Default</option>
                    <option value="gentle">Gentle</option>
                    <option value="alert">Alert</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Reminder Volume</label>
                  <input type="range" class="form-range" v-model="settings.notifications.volume" min="0" max="100">
                  <small class="text-muted">{{ settings.notifications.volume }}%</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Data Management</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Auto Backup</label>
                  <select class="form-select" v-model="settings.dataManagement.autoBackup">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Data Retention</label>
                  <select class="form-select" v-model="settings.dataManagement.retention">
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-12">
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-primary" @click="exportData">
                    <i class="bi bi-download"></i> Export Data
                  </button>
                  <button class="btn btn-outline-secondary" @click="importData">
                    <i class="bi bi-upload"></i> Import Data
                  </button>
                  <button class="btn btn-outline-danger" @click="clearData">
                    <i class="bi bi-trash"></i> Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <!-- App Info -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">App Information</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Version:</strong> 1.0.0
            </div>
            <div class="mb-3">
              <strong>Database:</strong> SQLite
            </div>
            <div class="mb-3">
              <strong>Last Updated:</strong> {{ lastUpdated }}
            </div>
            <div class="mb-3">
              <strong>Data Size:</strong> {{ dataSize }}
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-outline-primary" @click="resetToDefaults">
                <i class="bi bi-arrow-clockwise"></i> Reset to Defaults
              </button>
              <button class="btn btn-outline-info" @click="checkForUpdates">
                <i class="bi bi-arrow-up-circle"></i> Check for Updates
              </button>
              <button class="btn btn-outline-secondary" @click="showAbout">
                <i class="bi bi-info-circle"></i> About
              </button>
            </div>
          </div>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Keyboard Shortcuts</h5>
          </div>
          <div class="card-body">
            <div class="shortcut-item d-flex justify-content-between mb-2">
              <span>Start/Stop Tracking</span>
              <kbd>Ctrl + Space</kbd>
            </div>
            <div class="shortcut-item d-flex justify-content-between mb-2">
              <span>Add New Task</span>
              <kbd>Ctrl + N</kbd>
            </div>
            <div class="shortcut-item d-flex justify-content-between mb-2">
              <span>Quick Start Session</span>
              <kbd>Ctrl + Shift + S</kbd>
            </div>
            <div class="shortcut-item d-flex justify-content-between mb-2">
              <span>Open Settings</span>
              <kbd>Ctrl + ,</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" @click="resetSettings">Reset</button>
          <button class="btn btn-primary" @click="saveSettings">
            <i class="bi bi-check"></i> Save Settings
          </button>
        </div>
      </div>
    </div>

    <!-- About Modal -->
    <div class="modal fade" :class="{ show: showAboutModal }" :style="{ display: showAboutModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">About Productivity Tracker</h5>
            <button type="button" class="btn-close" @click="showAboutModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <i class="bi bi-graph-up fs-1 text-primary"></i>
              <h4 class="mt-2">Productivity Tracker</h4>
              <p class="text-muted">Version 1.0.0</p>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <h6>Features</h6>
                <ul class="list-unstyled">
                  <li><i class="bi bi-check text-success me-2"></i>Task Management</li>
                  <li><i class="bi bi-check text-success me-2"></i>Time Tracking</li>
                  <li><i class="bi bi-check text-success me-2"></i>Productivity Analytics</li>
                  <li><i class="bi bi-check text-success me-2"></i>Focus Sessions</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6>Technology</h6>
                <ul class="list-unstyled">
                  <li><i class="bi bi-code text-info me-2"></i>Tauri + Vue.js</li>
                  <li><i class="bi bi-code text-info me-2"></i>Bootstrap 5</li>
                  <li><i class="bi bi-code text-info me-2"></i>SQLite Database</li>
                  <li><i class="bi bi-code text-info me-2"></i>Chart.js</li>
                </ul>
              </div>
            </div>
            
            <hr>
            <p class="text-center text-muted small">
              Built with ❤️ for productivity enthusiasts
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAboutModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAboutModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      settings: {
        defaultSessionDuration: 25,
        workHoursPerDay: 8,
        defaultTaskPriority: 'medium',
        timezone: 'UTC',
        userProfile: {
          fullName: '',
          dateOfBirth: null,
          lifeExpectancy: 80,
          email: '',
          language: 'en'
        },
        calendar: {
          defaultView: 'month',
          weekStartDay: 1, // Monday
          defaultEventDuration: 1,
          defaultEventCategory: '',
          showWeekends: true,
          showEventDots: true,
          enableDragAndDrop: true,
          showTodayHighlight: true,
          businessHoursStart: '09:00',
          businessHoursEnd: '17:00',
          bankHolidays: 'None'
        },
        notifications: {
          sessionReminders: true,
          taskDueReminders: true,
          breakReminders: true,
          dailySummary: false,
          sound: 'default',
          volume: 50
        },
        dataManagement: {
          autoBackup: 'weekly',
          retention: '365'
        }
      },
      showAboutModal: false,
      lastUpdated: new Date().toLocaleDateString(),
      dataSize: '2.3 MB'
    }
  },
  computed: {
    lastUpdated() {
      return new Date().toLocaleDateString();
    },
    dataSize() {
      return '2.3 MB';
    },
    calculatedAge() {
      if (!this.settings.userProfile.dateOfBirth) {
        return 'N/A';
      }
      const birthDate = new Date(this.settings.userProfile.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  },
  mounted() {
    this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        // Load settings from localStorage or database
        const savedSettings = localStorage.getItem('productivity-tracker-settings');
        if (savedSettings) {
          this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    },
    
    async saveSettings() {
      try {
        // Save settings to localStorage or database
        localStorage.setItem('productivity-tracker-settings', JSON.stringify(this.settings));
        
        // Show success message
        this.showSuccessMessage('Settings saved successfully!');
      } catch (error) {
        console.error('Failed to save settings:', error);
        this.showErrorMessage('Failed to save settings');
      }
    },
    
    resetSettings() {
      if (confirm('Are you sure you want to reset all settings to defaults?')) {
        this.settings = {
          defaultSessionDuration: 25,
          workHoursPerDay: 8,
          defaultTaskPriority: 'medium',
          timezone: 'UTC',
          userProfile: {
            fullName: '',
            dateOfBirth: null,
            lifeExpectancy: 80,
            email: '',
            language: 'en'
          },
          calendar: {
            defaultView: 'month',
            weekStartDay: 1, // Monday
            defaultEventDuration: 1,
            defaultEventCategory: '',
            showWeekends: true,
            showEventDots: true,
            enableDragAndDrop: true,
            showTodayHighlight: true,
            businessHoursStart: '09:00',
            businessHoursEnd: '17:00',
            bankHolidays: 'None'
          },
          notifications: {
            sessionReminders: true,
            taskDueReminders: true,
            breakReminders: true,
            dailySummary: false,
            sound: 'default',
            volume: 50
          },
          dataManagement: {
            autoBackup: 'weekly',
            retention: '365'
          }
        };
      }
    },
    
    resetToDefaults() {
      if (confirm('This will reset all settings to their default values. Continue?')) {
        this.resetSettings();
        this.saveSettings();
      }
    },
    
    async exportData() {
      try {
        // TODO: Implement data export functionality
        console.log('Exporting data...');
        this.showSuccessMessage('Data export started');
      } catch (error) {
        console.error('Failed to export data:', error);
        this.showErrorMessage('Failed to export data');
      }
    },
    
    async importData() {
      try {
        // TODO: Implement data import functionality
        console.log('Importing data...');
        this.showSuccessMessage('Data import started');
      } catch (error) {
        console.error('Failed to import data:', error);
        this.showErrorMessage('Failed to import data');
      }
    },
    
    async clearData() {
      if (confirm('This will permanently delete all your data. This action cannot be undone. Continue?')) {
        try {
          // TODO: Implement data clearing functionality
          console.log('Clearing all data...');
          this.showSuccessMessage('All data cleared successfully');
        } catch (error) {
          console.error('Failed to clear data:', error);
          this.showErrorMessage('Failed to clear data');
        }
      }
    },
    
    checkForUpdates() {
      // TODO: Implement update check functionality
      this.showInfoMessage('No updates available');
    },
    
    showAbout() {
      this.showAboutModal = true;
    },
    
    showSuccessMessage(message) {
      // TODO: Implement proper toast/notification system
      alert(message);
    },
    
    showErrorMessage(message) {
      // TODO: Implement proper toast/notification system
      alert('Error: ' + message);
    },
    
    showInfoMessage(message) {
      // TODO: Implement proper toast/notification system
      alert(message);
    }
  }
}
</script>

<style scoped>
.shortcut-item kbd {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.875em;
}
</style> 