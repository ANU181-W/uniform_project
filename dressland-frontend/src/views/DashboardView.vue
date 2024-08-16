<template>
  <div class="dashboard">
    <div class="notice" v-if="!notice">
      In case you have made the payment and the order is still pending, then
      please go to orders page and click the refresh button next to order status
      to update the status.

      <br />
      <button @click="noticed">OK</button>
    </div>
    <div class="title">
      <div class="logo">
        <img
          :src="
            'http://localhost:3000/image/school/' + $store.state.user.school.image + '?width=200'
          "
          alt="logo"
        />
      </div>

      <h2>Welcome {{ $store.state.user.name }}</h2>

      <!-- <div class="links">
        <p @click="$router.push('/profile')">Profile</p>
        <p @click="$router.push('/cart')">Cart</p>
        <p @click="$router.push('/orders')">Orders</p>
        <p @click="$store.dispatch('signout')" style="color: red">Sign Out</p>
      </div> -->
    </div>
    <hr class="middle-line">
    <div class="items">
      <itemCardComponent
        v-for="product in $store.state.products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script>
import itemCardComponent from "../components/dashboard/itemCardComponent.vue";
// console.log($store.state.user.school.image);
export default {
  name: "DashboardView",
  components: {
    itemCardComponent,
  },
  data() {
    return {
      notice: localStorage.getItem("notice"),
    };
  },
  computed: {},
  async created() {

    
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }

    this.$store.dispatch("getuser");
    this.$store.dispatch("getproducts");
  },
  methods: {
    noticed() {
      localStorage.setItem("notice", true);
      this.notice = true;
    },
  },
};
</script>

<style scoped>

.middle-line{
  width: 100%;
  margin: 0px;
}
.notice {
  width: 80%;
  max-width: 600px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.notice button {
  padding: 0.8rem 2rem;
  border: none;
  outline: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.3s ease;
}

.notice button:hover {
  background-color: #0056b3;
}

.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
}

.title {
display: flex;
align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 2rem;
  padding: 0 2rem;

}

.title .logo img {
  height: 4rem;
  object-fit: contain;
}


.title h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-top: 1rem;
  text-transform:capitalize;
}

.items {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem;
}

.links {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.links p {
  font-size: 1.2rem;
  font-weight: 500;
  text-decoration: none;
  color: #007bff;
  cursor: pointer;
  margin: 0 1rem;
  transition: color 0.3s ease;
}

.links p:hover {
  color: #0056b3;
}

@media screen and (max-width: 992px) {
  .items {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media screen and (max-width: 576px) {
  .title .logo img {
    height: 4rem;
  }

  .title h2 {
    font-size: 1.5rem;
  }

  .links p {
    font-size: 1rem;
  }
}
</style>

