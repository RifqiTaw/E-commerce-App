<script setup lang="ts">
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- HEADER -->
    <Header />

    <!-- MAIN CONTENT -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>
