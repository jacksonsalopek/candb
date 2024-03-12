<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li v-for="(subRoutes, category) in routeTree" :key="category">
            <a>{{ category }}</a>
            <ul class="p-2">
              <li v-for="(route, subCategory) in subRoutes" :key="subCategory">
                <router-link :to="route">{{ subCategory }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <router-link to="/" class="btn btn-ghost text-xl">CanDB</router-link>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-for="(subRoutes, category) in routeTree" :key="category">
          <details>
            <summary>{{ category }}</summary>
            <ul class="p-2">
              <li v-for="(route, subCategory) in subRoutes" :key="subCategory">
                <router-link :to="route">{{ subCategory }}</router-link>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
const ROUTE_TREE = {
  'Graphs': {
    'IEMs': '/graphs/iems',
    'Headphones': '/graphs/headphones'
  }
};

export default {
  name: 'Navbar',
  data() {
    return {
      routeTree: ROUTE_TREE
    }
  }
}
</script>
