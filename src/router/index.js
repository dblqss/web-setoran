import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import Dashboard from "../views/Dashboard.vue"
import Mahasiswa from "../views/Mahasiswa.vue"
import Hafalan from "../views/Hafalan.vue"
import Riwayat from "../views/Riwayat.vue"
import MainLayout from "../layouts/MainLayout.vue"

const routes = [
  {
    path: "/",
    component: Login,
    meta: { public: true } // halaman bebas (tanpa login)
  },

  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true }, // semua child wajib login
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "mahasiswa", component: Mahasiswa },
      { path: "hafalan", component: Hafalan },
      { path: "hafalan/:nim", component: Hafalan },
      { path: "riwayat", component: Riwayat }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// =========================
// 🔐 NAVIGATION GUARD
// =========================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")

  // cek apakah route butuh login
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // kalau butuh login tapi tidak ada token
  if (requiresAuth && !token) {
    return next("/")
  }

  // kalau sudah login tapi ke halaman login
  if (to.path === "/" && token) {
    return next("/dashboard")
  }

  next()
})

export default router