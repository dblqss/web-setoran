<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../services/auth";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const router = useRouter();

const login = async () => {
  if (!username.value || !password.value) {
    error.value = "Isi semua field";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await auth.login(username.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    error.value =
      err.response?.data?.error_description ||
      "Login gagal";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">

    <div class="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-500/20">

      <!-- HEADER SECTION (dipisah biar nggak dempet) -->
      <div class="mb-14 text-center space-y-3">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-sky-300 via-cyan-300 to-violet-400 text-transparent bg-clip-text">
          Welcome
        </h1>

        <p class="text-gray-300 text-sm leading-relaxed">
          Login untuk mengelola setoran
        </p>
      </div>

      <!-- ERROR -->
      <div v-if="error"
        class="bg-red-500/80 text-white text-sm px-4 py-2 rounded-xl mb-6 text-center border border-red-300/30">
        {{ error }}
      </div>

      <!-- FORM SECTION -->
      <div class="space-y-6">
        <input v-model="username"
          placeholder="Username"
          class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" />

        <input v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition" />
      </div>

      <!-- BUTTON -->
      <button @click="login"
        :disabled="loading"
        class="w-full mt-10 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 hover:opacity-90 transition flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-500/20">

        <span v-if="!loading">Login</span>

        <span v-else class="flex items-center gap-2">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Loading...
        </span>
      </button>

    </div>

  </div>
</template>
