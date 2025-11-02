<template>
  <footer
    class="bg-gradient-to-r from-[#0a286e] via-[#1e3a8a] to-[#1d52c4] text-white py-8 mt-12"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">E-Shop</h3>
          <p>Your trusted online shopping destination</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="hover:text-white transition-colors underline">
                Products
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cart" class="hover:text-white transition-colors underline">
                Cart
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Contact</h3>
          <p>Email: rifqitaw1@gmail.com</p>
          <p>Phone: 082234199852</p>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center">
        <p>&copy; 2025 E-Shop. Built with Nuxt 3 & Tailwind CSS</p>
      </div>
    </div>
  </footer>
</template>
