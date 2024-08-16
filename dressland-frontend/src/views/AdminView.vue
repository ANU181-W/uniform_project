<template>
  <div class="adminmain">
    <div class="sidepanel">
      <adminSidepanelComponent />
    </div>
    <div class="main">
      <dashboardComponent v-if="id == '' || id == null" />
      <schoolComponent v-if="id == 'schools'" />
      <productsComponent v-if="id == 'products'" />
      <AdminOrdersView v-if="id == 'orders'" />
      <usersComponentVue v-if="id == 'users'" />
      <SizeChartComponent v-if="id == 'sizechart'" />
    </div>
  </div>
</template>

<script>
import adminSidepanelComponent from "../components/admin/adminSidepanelComponent.vue";
import dashboardComponent from "../components/admin/dashboardComponent.vue";
import schoolComponent from "../components/admin/schoolComponent.vue";
import productsComponent from "../components/admin/productsComponent.vue";
import AdminOrdersView from "../components/admin/AdminOrdersView.vue";
import usersComponentVue from "../components/admin/usersComponent.vue";
import SizeChartComponent from "../components/admin/SizeChartComponent.vue";

export default {
  name: "AdminView",
  components: {
    adminSidepanelComponent,
    dashboardComponent,
    schoolComponent,
    productsComponent,
    AdminOrdersView,
    usersComponentVue,
    SizeChartComponent,
  },
  data() {
    return {
      id: "",
    };
  },
  created() {
    this.id = this.$route.params.id;
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }
  },
  watch: {
    "$route.params.id": function (val) {
      this.id = val ? val : "";
    },
  },
  methods: {},
};
</script>

<style scoped>
.adminmain {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 90vh;
  width: 100%;
  background-color: #f5f5f5;
  padding: 1rem;
}

.main {
  width: 80%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style>
.over {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.close {
  height: 50px;

  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0 20px;
}

.close button {
  width: 50px;
  height: 50px;
  border: none;
  outline: none;
  background-color: #fff;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.form {
  width: 50%;
  height: 50%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.multiip {
  width: 80%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.multiip input {
  width: 70%;
  height: 100%;
  border: none;
  outline: none;
  border-bottom: 1px solid #000;
}

.multiip .button button {
  /* width: 20%; */
  height: 1.5rem;
  border: none;
  outline: none;
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

.input {
  width: 80%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.input input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  border-bottom: 1px solid #000;
}

.input textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  border-bottom: 1px solid #000;
}

.input select {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  border-bottom: 1px solid #000;
}

.button {
  width: 80%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  margin: 0.5rem;
}

.button button {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: #000;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.title h1 {
  font-size: 30px;
  font-weight: 500;
}

.title button {
  width: 100px;
  height: 30px;
  border: none;
  outline: none;
  background-color: #000;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.search {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.search input {
  width: 50%;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  border-bottom: 1px solid #000;
}

.table {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table table {
  width: 80%;
  height: 80%;
  border-collapse: collapse;
}

.table table thead {
  background-color: #000;
  color: #fff;
}

.table table thead th {
  padding: 10px;
  border: 1px solid #000;
}

.table table tbody tr {
  text-align: center;
}

.table table tbody tr td {
  padding: 10px;
  border: 1px solid #000;
  white-space: pre-wrap;
  max-width: 200px;
}

.table table tbody tr td button {
  width: 100px;
  height: 30px;
  border: none;
  outline: none;
  background-color: #000;
  color: #fff;
  border-radius: 5px;
  margin: 0.5rem;

  cursor: pointer;
}

.table table tbody tr td button:nth-child(2) {
  background-color: #f00;
}
</style>
