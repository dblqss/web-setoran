<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { service } from "../services/api";
import { auth } from "../services/auth";

const router = useRouter();

const mahasiswa = ref([]);
const loading = ref(false);

// =========================
// LOAD DATA
// =========================
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/");

  loading.value = true;

  try {
    const res = await service.getPaSaya();
    const raw =
        res.data?.data?.info_mahasiswa_pa?.daftar_mahasiswa || [];


    mahasiswa.value = raw.map(m => ({
      nim: m.nim,
      nama: m.nama,
      angkatan: m.angkatan,
      semester: m.semester,
      progress: Number(m.info_setoran?.persentase_progres_setor || 0)
    }));

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// =========================
// SUMMARY
// =========================
const avg = computed(() => {
  if (!mahasiswa.value.length) return 0;
  return Math.round(
    mahasiswa.value.reduce((s, m) => s + m.progress, 0) /
    mahasiswa.value.length
  );
});

const perluPerhatian = computed(() => {
  return mahasiswa.value.filter(m => m.progress < 50).length;
});

// =========================
// TOP & LOW MAHASISWA
// =========================
const topMahasiswa = computed(() => {
  return [...mahasiswa.value]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);
});

const lowMahasiswa = computed(() => {
  return [...mahasiswa.value]
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 5);
});

// =========================
// NAVIGASI
// =========================
const goMahasiswa = (filter) => {
  router.push({
    path: "/mahasiswa",
    query: { type: filter }
  });
};

// =========================
// LOGOUT
// =========================
const logout = () => {
  auth.logout();
  router.push("/");
};
</script>

<template>
  <div class="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">

    <!-- CONTENT -->
    <div class="flex-1 p-6">

      <!-- HEADER -->
<div class="flex justify-between items-center mb-6">

  <h1 class="text-3xl font-bold bg-gradient-to-r from-sky-300 via-cyan-300 to-violet-400 text-transparent bg-clip-text">
    Dashboard
  </h1>

  <!-- LOGOUT -->
  <button
    @click="logout"
    class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition"
  >
    Logout
  </button>

</div>

      <!-- SUMMARY -->
      <div class="grid md:grid-cols-3 gap-4 mb-8">

        <div @click="goMahasiswa('all')"
          class="cursor-pointer bg-gradient-to-r from-sky-500/30 to-indigo-500/30 p-5 rounded-2xl border border-sky-300/20 shadow-lg hover:scale-105 transition">
          <p class="text-sm opacity-80">Total Mahasiswa</p>
          <h2 class="text-3xl font-bold">{{ mahasiswa.length }}</h2>
        </div>

        <div @click="goMahasiswa('progress')"
          class="cursor-pointer bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 p-5 rounded-2xl border border-violet-300/20 shadow-lg hover:scale-105 transition">
          <p class="text-sm opacity-80">Rata-rata Progress</p>
          <h2 class="text-3xl font-bold">{{ avg }}%</h2>
        </div>

        <div @click="goMahasiswa('warning')"
          class="cursor-pointer bg-gradient-to-r from-orange-400/30 to-rose-500/30 p-5 rounded-2xl border border-orange-300/20 shadow-lg hover:scale-105 transition">
          <p class="text-sm opacity-80">Perlu Perhatian</p>
          <h2 class="text-3xl font-bold">{{ perluPerhatian }}</h2>
        </div>

      </div>

      <!-- SYARAT HAFALAN -->
      <div class="bg-gradient-to-br from-indigo-900/40 to-slate-800/30 p-6 rounded-3xl mb-8 shadow-xl border border-white/10">

        <h2 class="text-2xl font-bold text-center mb-6 text-cyan-200">
          Syarat Hafalan
        </h2>

        <div class="grid md:grid-cols-3 gap-6">

          <!-- KP -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-300/20 hover:scale-105 transition">
            <div class="text-center">
              <h3 class="font-bold text-lg text-sky-200">KP</h3>
              <p class="text-sm text-gray-300 mb-3">Wajib: 8</p>

              <div class="flex flex-wrap justify-center gap-2 text-xs">
                <span class="px-2 py-1 rounded-lg bg-white/10">An-Naba'</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">An-Naazi'at</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">'Abasa</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">At-Takwir</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Infithar</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Muthaffifin</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Insyiqaaq</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Buruj</span>
              </div>
            </div>
          </div>

          <!-- SEMKP -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-300/20 hover:scale-105 transition">
            <div class="text-center">
              <h3 class="font-bold text-lg text-violet-200">SEMKP</h3>
              <p class="text-sm text-gray-300 mb-3">Wajib: 8</p>

              <div class="flex flex-wrap justify-center gap-2 text-xs">
                <span class="px-2 py-1 rounded-lg bg-white/10">Ath-Thaariq</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-A'la</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Ghaasyiyah</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Fajr</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Balad</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Asy-Syams</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Al-Lail</span>
                <span class="px-2 py-1 rounded-lg bg-white/10">Adh-Dhuha</span>
              </div>
            </div>
          </div>

          <!-- DAFTAR TA -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 border border-amber-300/20 hover:scale-105 transition">
            <div class="text-center">
              <h3 class="font-bold text-lg text-amber-200">DAFTAR TA</h3>
              <p class="text-sm text-gray-300 mb-3">Wajib: 6</p>

              <div class="text-xs grid grid-cols-2 gap-2">
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Insyirah</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">At-Tiin</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-'Alaq</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Qadr</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Bayyinah</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Az-Zalzalah</span>
              </div>
            </div>
          </div>

          <!-- SEMPRO -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20 border border-emerald-300/20 hover:scale-105 transition">
            <div class="text-center">
              <h3 class="font-bold text-lg text-emerald-200">SEMPRO</h3>
              <p class="text-sm text-gray-300 mb-3">Wajib: 12</p>

              <div class="text-xs grid grid-cols-2 gap-2">
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-'Aadiyaat</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Qaari'ah</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">At-Takaatsur</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-'Ashr</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Humazah</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Fiil</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Quraisy</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Maa'un</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Kautsar</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Kaafirun</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">An-Nashr</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Lahab</span>
              </div>
            </div>
          </div>

          <!-- SIDANG -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-rose-400/20 to-pink-400/20 border border-rose-300/20 hover:scale-105 transition">
            <div class="text-center">
              <h3 class="font-bold text-lg text-rose-200">SIDANG TA</h3>
              <p class="text-sm text-gray-300 mb-3">Wajib: 3</p>

              <div class="text-xs grid grid-cols-2 gap-2">
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Ikhlash</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg">Al-Falaq</span>
                <span class="bg-white/10 px-2 py-1 rounded-lg col-span-2">An-Nas</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- PROGRESS -->
      <div class="grid md:grid-cols-2 gap-6">

        <div class="bg-white/5 p-5 rounded-2xl border border-white/10">
          <h2 class="mb-4 font-semibold text-sky-200">🚀 Progress Tinggi</h2>

          <div class="space-y-3">
            <div v-for="m in topMahasiswa" :key="m.nim"
              class="flex justify-between items-center bg-white/5 p-3 rounded-lg">

              <div>
                <p class="font-semibold">{{ m.nama }}</p>
                <p class="text-xs text-gray-400">{{ m.nim }}</p>
              </div>

              <div class="text-sky-300 font-bold">
                {{ m.progress }}%
              </div>

            </div>
          </div>
        </div>

        <div class="bg-white/5 p-5 rounded-2xl border border-white/10">
          <h2 class="mb-4 font-semibold text-rose-200">⚠️ Progress Rendah</h2>

          <div class="space-y-3">
            <div v-for="m in lowMahasiswa" :key="m.nim"
              class="flex justify-between items-center bg-white/5 p-3 rounded-lg">

              <div>
                <p class="font-semibold">{{ m.nama }}</p>
                <p class="text-xs text-gray-400">{{ m.nim }}</p>
              </div>

              <div class="text-rose-300 font-bold">
                {{ m.progress }}%
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
