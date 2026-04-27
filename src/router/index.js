import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import Dashboard from "../views/Dashboard.vue"
import Mahasiswa from "../views/Mahasiswa.vue"
import Hafalan from "../views/Hafalan.vue"
import Riwayat from "../views/Riwayat.vue"
import MainLayout from "../layouts/MainLayout.vue"

const routes = [
  { path: "/", component: Login },

  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "mahasiswa", component: Mahasiswa },
      { path: "hafalan", component: Hafalan },        // fallback
      { path: "hafalan/:nim", component: Hafalan },   // detail
      { path: "riwayat", component: Riwayat }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
