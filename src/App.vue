<script setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", { name: name.value });
}
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-graph-up"></i> Productivity Tracker
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="bi bi-house"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tasks">
                <i class="bi bi-list-check"></i> Tasks
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/time-tracking">
                <i class="bi bi-clock"></i> Time Tracking
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/analytics">
                <i class="bi bi-bar-chart"></i> Analytics
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/calendar">
                <i class="bi bi-calendar3"></i> Calendar
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/momento-mori">
                <i class="bi bi-bar-chart"></i> Momento Mori
              </router-link>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/settings">
                <i class="bi bi-gear"></i> Settings
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container-fluid mt-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // Initialize database when app starts
    this.initializeDatabase();
  },
  methods: {
    async initializeDatabase() {
      try {
        await window.__TAURI__.invoke('initialize_database');
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }
  }
}
</script>

<style>
body {
  background-color: #f8f9fa;
}

.navbar-brand i {
  margin-right: 0.5rem;
}

.nav-link i {
  margin-right: 0.25rem;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border-radius: 0.5rem;
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
}

.btn {
  border-radius: 0.375rem;
}

.form-control, .form-select {
  border-radius: 0.375rem;
}

.progress {
  border-radius: 0.375rem;
}
</style>
