<template>
  <div class="home">
    <heroComponent />
    <aboutUsComponent />
    <statsComponent id="whyus" />
    <uniformsComponent />
    <testiComponent />
    <schoolsComponent /> 
  </div>
</template>

<script>
import heroComponent from "../components/home/heroComponent.vue";
import aboutUsComponent from "../components/home/aboutUsComponent.vue";
import statsComponent from "../components/home/statsComponent.vue";
import uniformsComponent from "../components/home/uniformsComponent.vue";
import testiComponent from "../components/home/testiComponent.vue";
import schoolsComponent from "../components/home/schoolsComponent.vue";
import { watch } from "vue";
export default {
  name: "HomeView",
  components: {
    heroComponent,
    aboutUsComponent,
    statsComponent,
    uniformsComponent,
    testiComponent,
    schoolsComponent,
  },
  watch: {
    // watch for # in url and scroll to that section
    "$route.hash": function (val) {
      if (val) {
        this.scrollToSection(val);
      }
    },
  },
  methods: {
    scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
/* 
.home{

  height: 90vh;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
} */
</style>
