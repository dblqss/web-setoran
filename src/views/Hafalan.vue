<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { service } from "../services/api";

const route = useRoute();
const router = useRouter();

// =========================
const nimInput = ref("");
const loading = ref(false);
const actionLoading = ref(null);

const info = ref({});
const ringkasan = ref([]);
const detail = ref([]);

// ✅ ERROR STATE
const notFound = ref(false);

// =========================
// AUTO LOAD DARI DASHBOARD
// =========================
onMounted(() => {
  const nim = route.query.nim;

  if (nim) {
    nimInput.value = nim;
    cariHafalan();
  }
});

// =========================
// FETCH DATA UTAMA
// =========================
const cariHafalan = async () => {
  if (!nimInput.value) return;

  loading.value = true;
  notFound.value = false;

  await loadData();

  loading.value = false;
};

// =========================
// LOAD DATA
// =========================
const loadData = async () => {
  try {
    const res = await service.getMahasiswaSetoran(nimInput.value.trim());

    const data = res.data?.data;

if (!data || !data.info) {
  info.value = {};
  ringkasan.value = [];
  detail.value = [];
  notFound.value = true;
  return;
}

    notFound.value = false;

    info.value = data.info || {};
    ringkasan.value = data.setoran?.ringkasan || [];

    detail.value = (data.setoran?.detail || []).map(d => ({
      ...d,
      sudah: d.sudah_setor || false
    }));

  } catch (err) {
    console.error(err);
    notFound.value = true;
  }
};

// =========================
// ACC
// =========================
const acc = async (item) => {
  actionLoading.value = item.id;

  try {
    await service.accSetoran(info.value.nim, {
      data_setoran: [{
        nama_komponen_setoran: item.nama,
        id_komponen_setoran: item.id
      }]
    });

    await loadData();

  } catch (err) {
    console.error(err);
  }

  actionLoading.value = null;
};

// =========================
// BATAL
// =========================
const batal = async (item) => {
  actionLoading.value = item.id;

  try {
    await service.deleteSetoran(info.value.nim, {
      data_setoran: [{
        id: item.info_setoran?.id,
        nama_komponen_setoran: item.nama,
        id_komponen_setoran: item.id
      }]
    });

    await loadData();

  } catch (err) {
    console.error(err);
  }

  actionLoading.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">

    <div class="max-w-6xl mx-auto px-6 md:px-10 py-8 space-y-8">

      <!-- HEADER -->
      <h1 class="text-2xl font-bold">Hafalan</h1>
      <p class="text-gray-400 mb-4">
          {{ info.nama }} • {{ info.nim }}
        </p>

      <p class="text-gray-400 mt-3 mb-8">
        Cari data hafalan mahasiswa 📚
      </p>

      <!-- INPUT -->
      <div class="flex gap-4 mt-4 mb-6">

        <input
          v-model="nimInput"
          placeholder="Masukkan NIM"
          class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
        />

        <button
          @click="cariHafalan"
          class="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500"
        >
          Cari
        </button>

      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-gray-400">
        Loading...
      </div>

      <!-- ❌ ERROR MESSAGE (INI YG KAU MAU) -->
      <div v-else-if="notFound"
        class="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-xl text-center">
        NIM yang Anda masukkan tidak ditemukan
      </div>

      <!-- CONTENT -->
      <div v-else-if="info && info.nim">

        <button
          @click="router.push({ path: '/riwayat', query: { nim: info.nim } })"
          class="mb-4 bg-purple-500 px-4 py-2 rounded-xl"
        >
          Lihat Riwayat
        </button>

        <p class="text-gray-400 mb-4">
          {{ info.nama }} • {{ info.nim }}
        </p>

        <!-- RINGKASAN -->
        <div class="grid md:grid-cols-5 gap-4 mb-6">

          <div v-for="r in ringkasan" :key="r.label"
            class="bg-white/10 p-3 rounded">

            <p class="text-xs text-gray-300">{{ r.label }}</p>
            <h2 class="text-cyan-400 text-lg">
              {{ r.persentase_progres_setor }}%
            </h2>

          </div>

        </div>

        <!-- DETAIL -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div v-for="d in detail" :key="d.id"
            class="p-4 bg-white/10 rounded">

            <h2 class="font-semibold">{{ d.nama }}</h2>
            <p class="text-cyan-300 text-right">{{ d.nama_arab }}</p>

            <p class="text-xs text-gray-300 mt-2">{{ d.label }}</p>

            <div class="mt-2">
              <span v-if="d.sudah" class="text-green-400">
                ✔ Sudah
              </span>
              <span v-else class="text-red-400">
                ✖ Belum
              </span>
            </div>

            <div class="mt-3 flex gap-2">

              <button
                v-if="!d.sudah"
                @click="acc(d)"
                class="bg-green-500 px-3 py-1 rounded text-xs"
              >
                ACC
              </button>

              <button
                v-if="d.sudah"
                @click="batal(d)"
                class="bg-red-500 px-3 py-1 rounded text-xs"
              >
                Batal
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- EMPTY -->
      <div v-else class="text-gray-500 text-center mt-10">
        Masukkan NIM untuk mulai
      </div>

    </div>
  </div>
</template>
