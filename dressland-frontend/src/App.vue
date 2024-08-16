<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <headerComponent />
  <RouterView />
  <!-- {{ count  }} -->
  <footerComponent />
</template>

<script>
import headerComponent from "./components/ui/headerComponent.vue";
import footerComponent from "./components/ui/footerComponent.vue";

export default {
  name: "App",
  components: {
    headerComponent,
    footerComponent,
  },
  name: "headerComponent",
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
};
</script>

<style>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff39;
  z-index: 100;
  /* background blur */
  backdrop-filter: blur(5px);
}

.newtons-cradle {
  --uib-size: 70px;
  --uib-speed: 1.2s;
  --uib-color: #f16028;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--uib-size);
  height: var(--uib-size);
}

.newtons-cradle__dot {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  width: 25%;
  transform-origin: center top;
}

.newtons-cradle__dot::after {
  content: "";
  display: block;
  width: 100%;
  height: 25%;
  border-radius: 50%;
  background-color: var(--uib-color);
}

.newtons-cradle__dot:first-child {
  animation: swing var(--uib-speed) linear infinite;
}

.newtons-cradle__dot:last-child {
  animation: swing2 var(--uib-speed) linear infinite;
}

@keyframes swing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: ease-out;
  }

  25% {
    transform: rotate(70deg);
    animation-timing-function: ease-in;
  }

  50% {
    transform: rotate(0deg);
    animation-timing-function: linear;
  }
}

@keyframes swing2 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: linear;
  }

  50% {
    transform: rotate(0deg);
    animation-timing-function: ease-out;
  }

  75% {
    transform: rotate(-70deg);
    animation-timing-function: ease-in;
  }
}
</style>
