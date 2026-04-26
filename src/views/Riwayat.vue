<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { service } from "../services/api";

const route = useRoute();

// =========================
// STATE
// =========================
const logs = ref([]);
const info = ref({});
const loading = ref(false);
const notFound = ref(false);

const nimInput = ref("");
const search = ref("");

// =========================
// AUTO LOAD ROUTE
// =========================
onMounted(() => {
  const nimFromRoute = route.query.nim;

  if (nimFromRoute) {
    nimInput.value = nimFromRoute;
    cariRiwayat();
  }
});

// =========================
// FORMAT
// =========================
const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatKeterangan = (text) => {
  if (!text) return "-";

  return text
    .replace("serta memilih tanggal muroja'ah", "")
    .replace("undefined", "")
    .trim();
};

// =========================
// FETCH DATA (FIX UTAMA)
// =========================
const cariRiwayat = async () => {
  if (!nimInput.value.trim()) return;

  loading.value = true;
  notFound.value = false;

  logs.value = [];
  info.value = {};

  try {
    const res = await service.getMahasiswaSetoran(nimInput.value.trim());

    console.log("RAW RESPONSE:", res.data);

    const data = res.data?.data;

    if (!data) {
      notFound.value = true;
      return;
    }

    // INFO MAHASISWA
    info.value = data.info || {};

    // LOG SETORAN (HANDLE BANYAK POSSIBLE STRUCTURE)
    logs.value =
      data.setoran?.log ||
      data.setoran?.data ||
      data.log ||
      [];

    if (logs.value.length === 0) {
      notFound.value = true;
    }

  } catch (err) {
    console.error(err);
    notFound.value = true;
  } finally {
    loading.value = false;
  }
};

// =========================
// FILTER SEARCH
// =========================
const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    const keyword = search.value.toLowerCase();

    return (
      log.keterangan?.toLowerCase().includes(keyword) ||
      info.value.nama?.toLowerCase().includes(keyword) ||
      info.value.nim?.toLowerCase().includes(keyword)
    );
  });
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-900 via-purple-900 to-slate-900 text-white p-6">

    <!-- HEADER -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
        Riwayat Setoran
      </h1>
      <p class="text-gray-400 text-sm mt-1">
        Riwayat aktivitas hafalan mahasiswa 📊
      </p>
    </div>

    <!-- INPUT -->
    <div class="mb-6 flex gap-3">
      <input
        v-model="nimInput"
        placeholder="Masukkan NIM"
        class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
        focus:ring-2 focus:ring-cyan-400 outline-none backdrop-blur"
      />

      <button
        @click="cariRiwayat"
        class="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500
        hover:opacity-90 transition font-semibold"
      >
        Cari
      </button>
    </div>

    <!-- SEARCH FILTER -->
    <div v-if="logs.length" class="mb-6">
      <input
        v-model="search"
        placeholder="Filter riwayat..."
        class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
        focus:ring-2 focus:ring-cyan-400 outline-none backdrop-blur"
      />
    </div>

    <!-- INFO -->
    <div v-if="info.nama"
      class="mb-6 p-4 rounded-xl bg-white/10 border border-white/10">

      <p class="font-semibold text-lg">{{ info.nama }}</p>
      <p class="text-sm text-gray-300">{{ info.nim }}</p>

    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center text-gray-400">
      Memuat data...
    </div>

    <!-- NOT FOUND -->
    <div v-else-if="notFound"
      class="text-center mt-10 p-6 rounded-xl bg-red-500/10 border border-red-400/30">
      ❌ Data tidak ditemukan
    </div>

    <!-- EMPTY -->
    <div v-else-if="!logs.length && !loading"
      class="text-center text-gray-500 mt-10">
      Masukkan NIM lalu klik Cari 🔎
    </div>

    <!-- LIST -->
    <div v-else class="space-y-4">
      <div v-for="log in filteredLogs" :key="log.id"
        class="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur">

        <div class="flex justify-between mb-2">
          <span :class="log.aksi === 'VALIDASI'
            ? 'text-green-400 font-semibold'
            : 'text-red-400 font-semibold'">
            {{ log.aksi === 'VALIDASI' ? '✔ Validasi' : '✖ Dibatalkan' }}
          </span>

          <span class="text-xs text-gray-400">
            {{ formatDate(log.timestamp) }}
          </span>
        </div>

        <p class="text-sm text-gray-200">
          {{ formatKeterangan(log.keterangan) }}
        </p>

        <p class="text-xs text-gray-400 mt-2">
          👤 {{ log.dosen_yang_mengesahkan?.nama || '-' }}
        </p>

      </div>
    </div>

  </div>
</template>
