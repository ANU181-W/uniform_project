<template>
  <div class="container">
    <div class="flex">
      <div class="card">
        <!-- <div class="card" @click="loc" style="cursor: pointer"> -->
        <span class="material-symbols-outlined"> location_on </span>
        <h3>Address</h3>
        <p>
          123, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          quos, voluptates
        </p>
      </div>
      <div class="card">
        <span class="material-symbols-outlined"> email </span>
        <h3>Email</h3>
        <p>dresslanduniforms.in</p>
      </div>
      <div class="card">
        <span class="material-symbols-outlined"> phone </span>
        <h3>Phone</h3>
        <p>+91 99999999999</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactView",
  methods: {
    loc() {
      //   window.open("https://goo.gl/maps/iJATaf2F3iDmcpU98", "_blank");
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  min-height: 82vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 0;
}

.flex {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.card {
  width: 30%;
  height: 200px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
}

.card span {
  font-size: 3rem;
  color: #f16028;
}

.card h3 {
  margin: 10px 0;
  font-size: 1.5rem;
  color: #f16028;
}

.card p {
  margin: 10px 0;
  font-size: 1rem;
  color: #f16028;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .card {
    width: 100%;
    margin: 10px 0;
    box-shadow: none;
  }
}

@media screen and (max-width: 480px) {
  .card {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
