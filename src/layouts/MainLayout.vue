<template>
  <div class="flex min-h-screen">

    <!-- SIDEBAR -->
    <div class="w-64 bg-gradient-to-b from-slate-950 via-cyan-900 to-indigo-950 text-white p-5 border-r border-white/10">

      <!-- LOGO -->
      <h1 class="text-2xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text tracking-wide">
        Menu
      </h1>

      <!-- MENU -->
      <div class="space-y-2 text-sm">

        <!-- DASHBOARD -->
        <router-link to="/dashboard"
          class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:translate-x-1"
          active-class="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow">

          <span>📊</span>
          <span>Dashboard</span>
        </router-link>

        <!-- MAHASISWA -->
        <router-link to="/mahasiswa"
          class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:translate-x-1"
          active-class="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow">

          <span>👨‍🎓</span>
          <span>Mahasiswa</span>
        </router-link>

        <!-- HAFALAN -->
        <router-link to="/hafalan"
          class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:translate-x-1"
          active-class="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow">

          <span>📖</span>
          <span>Hafalan</span>
        </router-link>

        <!-- RIWAYAT -->
        <router-link to="/riwayat"
          class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:translate-x-1"
          active-class="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 shadow">

          <span>🕓</span>
          <span>Riwayat</span>
        </router-link>

      </div>

      <!-- FOOTER -->
      <div class="absolute bottom-5 left-5 text-xs text-gray-500">
        © 2026
      </div>

    </div>

    <!-- CONTENT -->
    <div class="flex-1">
      <router-view />
    </div>

  </div>
</template>
