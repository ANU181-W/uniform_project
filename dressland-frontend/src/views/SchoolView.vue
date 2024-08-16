<template>
  <div class="schoolmain">
    <sidepanelComponent />
    <dashboardComponent v-if="id == 'dashboard'" />
    <orderComponent v-if="id == 'orders'" />
    <studentsComponentVue v-if="id == 'students'" />
  </div>
</template>

<script>
import sidepanelComponent from "../components/school/sidepanelComponent.vue";
import dashboardComponent from "../components/school/dashboardComponent.vue";
import orderComponent from "../components/school/orderComponent.vue";
import studentsComponentVue from "../components/school/studentsComponent.vue";
export default {
  name: "SchoolView",

  components: {
    sidepanelComponent,
    dashboardComponent,
    orderComponent,
    studentsComponentVue,
  },
  data() {
    return {
      id: "dashboard",
    };
  },
  watch: {
    "$route.params.id": function (val) {
      this.id = val ? val : "";
    },
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }
  },
  methods: {},
};
</script>

<style scoped>
.schoolmain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 90vh;
}
</style>
