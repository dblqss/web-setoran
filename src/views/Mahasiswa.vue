<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { service } from "../services/api";

const router = useRouter();

const mahasiswa = ref([]);
const loading = ref(false);
const search = ref("");
const filterAngkatan = ref("ALL");

// =========================
// LOAD DATA (FIXED SAFE VERSION)
// =========================
onMounted(async () => {
  loading.value = true;

  try {
    const res = await service.getPaSaya();

    console.log("RAW PA RESPONSE:", res.data);

    // SAFE ACCESS (biar tidak crash kalau API beda struktur)
    const raw =
      res.data?.data?.info_mahasiswa_pa?.daftar_mahasiswa ||
      res.data?.data?.daftar_mahasiswa ||
      [];

    mahasiswa.value = raw.map(m => ({
      nim: m.nim || "-",
      nama: m.nama || "-",
      angkatan: m.angkatan || "-",
      semester: m.semester || "-",
      progress: Number(m.info_setoran?.persentase_progres_setor ?? 0)
    }));

  } catch (err) {
    console.error("ERROR GET PA:", err);
    mahasiswa.value = [];
  } finally {
    loading.value = false;
  }
});

// =========================
// FILTER (SAFE VERSION)
// =========================
const filtered = computed(() => {
  return mahasiswa.value.filter(m => {
    const nama = (m.nama || "").toLowerCase();
    const nim = (m.nim || "");

    const matchSearch =
      nama.includes(search.value.toLowerCase()) ||
      nim.includes(search.value);

    const matchAngkatan =
      filterAngkatan.value === "ALL" ||
      m.angkatan === filterAngkatan.value;

    return matchSearch && matchAngkatan;
  });
});

// =========================
// LIST ANGKATAN (SAFE VERSION)
// =========================
const listAngkatan = computed(() => {
  const set = new Set(
    mahasiswa.value
      .map(m => m.angkatan)
      .filter(v => v !== undefined && v !== null)
  );

  return ["ALL", ...Array.from(set).sort((a, b) => b - a)];
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

    <!-- HEADER -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">
        Data Mahasiswa
      </h1>
      <p class="text-gray-400 text-sm mt-1">
        Kelola dan pantau progres hafalan mahasiswa ✨
      </p>
    </div>

    <!-- FILTER BAR -->
    <div class="flex flex-col md:flex-row gap-4 mb-8">

      <!-- SEARCH -->
      <div class="flex-1 relative">
        <input
          v-model="search"
          placeholder="Cari nama atau NIM..."
          class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none backdrop-blur transition"
        />
        <span class="absolute left-3 top-3 text-gray-400">🔍</span>
      </div>

      <!-- FILTER -->
      <select
        v-model="filterAngkatan"
        class="px-4 py-3 rounded-xl bg-black border border-white/20 focus:ring-2 focus:ring-purple-400 transition"
      >
        <option v-for="a in listAngkatan" :key="a">
          {{ a }}
        </option>
      </select>

    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10 text-gray-400">
      Loading data mahasiswa...
    </div>

    <!-- GRID -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div
        v-for="m in filtered"
        :key="m.nim"
        @click="router.push({ path: '/hafalan', query: { nim: m.nim } })"
        class="group relative cursor-pointer p-5 rounded-2xl border border-white/20 
               bg-gradient-to-br from-white/10 via-white/5 to-transparent 
               backdrop-blur-xl transition-all duration-300 
               hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(0,255,255,0.25)]"
      >

        <!-- GLOW -->
        <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 
                    bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 blur-2xl"></div>

        <!-- TOP LINE -->
        <div class="absolute top-0 left-0 w-full h-[3px] rounded-t-2xl 
                    bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 opacity-70"></div>

        <!-- CONTENT -->
        <div class="relative z-10">

          <h2 class="font-semibold text-lg group-hover:text-cyan-300 transition">
            {{ m.nama }}
          </h2>

          <p class="text-xs text-gray-400">
            {{ m.nim }}
          </p>

          <!-- BADGE -->
          <div class="flex gap-2 mt-3 text-xs flex-wrap">

            <span class="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              🎓 {{ m.angkatan }}
            </span>

            <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
              📚 Semester {{ m.semester || '-' }}
            </span>

          </div>

          <!-- PROGRESS -->
          <div class="mt-5">

            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-300">Progress Hafalan</span>
              <span class="text-cyan-400 font-semibold">
                {{ m.progress }}%
              </span>
            </div>

            <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                class="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 transition-all duration-700"
                :style="{ width: m.progress + '%' }"
              ></div>
            </div>

          </div>

          <!-- STATUS -->
          <div class="mt-4 text-xs text-gray-400 flex justify-between">
            <span>📊 Status</span>
            <span
              :class="m.progress > 70 ? 'text-green-400' :
                      m.progress > 40 ? 'text-yellow-400' :
                      'text-red-400'"
            >
              {{ m.progress > 70 ? 'Baik' :
                 m.progress > 40 ? 'Perlu Dorongan' :
                 'Perlu Perhatian' }}
            </span>
          </div>

        </div>

      </div>

    </div>

    <!-- EMPTY -->
    <div v-if="!filtered.length && !loading"
      class="text-center text-gray-400 mt-10">
      Tidak ada data ditemukan 😢
    </div>

  </div>
</template>
