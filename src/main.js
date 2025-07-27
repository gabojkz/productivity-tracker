import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

// Import Bootstrap CSS and JS
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

// Import components
import Dashboard from "./components/Dashboard.vue";
import Tasks from "./components/Tasks.vue";
import TimeTracking from "./components/TimeTracking.vue";
import Analytics from "./components/Analytics.vue";
import Settings from "./components/Settings.vue";
import MomentoMori from "./components/MomentoMori.vue";
import Calendar from "./components/Calendar.vue";

// Define routes
const routes = [
  { path: "/", component: Dashboard },
  { path: "/tasks", component: Tasks },
  { path: "/calendar", component: Calendar },
  { path: "/time-tracking", component: TimeTracking },
  { path: "/analytics", component: Analytics },
  { path: "/settings", component: Settings },
  { path: "/momento-mori", component: MomentoMori },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

// Make Bootstrap available globally
app.config.globalProperties.$bootstrap = bootstrap;
window.bootstrap = bootstrap;

app.use(router);
app.mount("#app");
