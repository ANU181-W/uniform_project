<template>
  <div class="sidepanel">
    <div class="sidepanel__container">
      <div class="sidepanel__container__logo">
        <!-- <img src="../../assets/images/header-logo.png" alt="logo" /> -->
        <h1>Admin</h1>
        
      </div>
      <div class="sidepanel__container__links">
        <router-link to="/admin" class="sidepanel__container__links__link">
          Dashboard
        </router-link>
        <router-link
          to="/admin/schools"
          class="sidepanel__container__links__link"
        >
          Schools
        </router-link>
        <router-link
          to="/admin/sizechart"
          class="sidepanel__container__links__link"
        >
          Size Chart
        </router-link>
        <router-link
          to="/admin/products"
          class="sidepanel__container__links__link"
        >
          Products
        </router-link>
        <router-link
          to="/admin/orders"
          class="sidepanel__container__links__link"
        >
          Orders
        </router-link>

        <router-link
          to="/admin/users"
          class="sidepanel__container__links__link"
        >
          Users
        </router-link>
      </div>
    </div>
    <button @click="$store.dispatch('signout')"   class="logout">Logout</button>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>


.logout{

  margin: 2rem;
}
.sidepanel {

  border: 1px solid black ;
  margin: 1rem ;
  border-radius: 20px;
  width: 20vw;
  /* height: 90%; */
  /* background: #f16028; */
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.sidepanel__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: black;
}

.sidepanel__container__logo {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  flex-direction: column;
}

.sidepanel__container__logo h1 {
  font-size: 1.5rem;
  color: #000000;
}

.sidepanel button {
  transition: 0.3s ease-in-out;
  color: #f16028;
  background: #fff;
  border: none;
  border:1px solid #f16028;
  padding: 0.5rem 1.5rem;
  
  transition: all 0.3 ease-in-out;
  border-radius: 5px;
  margin-top: 5rem;
}

.sidepanel button:hover {
color: #fff;
background: #f16028;
  font-weight: bold;
  border-radius: 0.5rem;
}

.sidepanel__container__logo img {
  width: 100%;
  height: 100%;
}

.sidepanel__container__links {
  transition: 0.3s ease-in-out;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.sidepanel__container__links__link {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

a.sidepanel__container__links__link {
  width: 100%;
  height: 100%;
  text-decoration: none;
  /* background: #f16028; */
  color: #000000;
  border: none;
  padding: 0.5rem;
  border-bottom: #fff solid 1px;
  transition: all 0.3 ease-in-out;

  /* border-radius: 5px; */
  /* margin-top: 1rem; */
}

a.sidepanel__container__links__link:hover {
  background: #fff;
  color: #f16028;
  font-weight: bold;
}
</style>
