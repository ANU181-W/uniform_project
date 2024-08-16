<template>
  <header>
    <router-link to="/" class="logo">
      <img src="../../assets/images/Dressland_Sports_Logo-1.png" alt="logo" />
    </router-link>
    <nav class="mobileu" v-if="role === 'user' && $route.path != '/login'">
      <RouterLink to="/profile" title="Profile"
        ><span class="material-symbols-outlined">
          account_circle
        </span></RouterLink
      >
      <RouterLink to="/orders" title="Orders"
        ><span class="material-symbols-outlined">
          order_approve
        </span></RouterLink
      >
      <RouterLink to="/cart" title="cart"
        ><span class="material-symbols-outlined"> shopping_cart </span>
        <!-- <div class="batch">
          {{
            this.$store.state.user.cart.length > 0
              ? this.$store.state.user.cart.length
              : ""
          }}
        </div> -->
      </RouterLink>
      <RouterLink to="/dashboard" class="btn"
        >Shop
        <span class="material-symbols-outlined"> storefront </span></RouterLink
      >
    </nav>
    <div v-else class="lognav">
      <!-- <RouterLink to="/login" class="btn menu-toggle" v-if="!logedin"
        >login</RouterLink
      > -->

      <div class="menu-toggle" @click="toggleMenu">
        <i class="bx bx-menu" v-if="!menuOpen"></i>
        <i class="bx bx-x" v-else></i>
      </div>
    </div>

    <nav v-if="!menuOpen" class="pc">
      <RouterLink v-if="!logedin || role != 'user'" to="/about"
        >about us</RouterLink
      >
      <RouterLink v-if="!logedin || role != 'user'" to="uniforms"
        >uniforms</RouterLink
      >
      <RouterLink v-if="!logedin || role != 'user'" to="/whyus"
        >why us?</RouterLink
      >
      <RouterLink v-if="!logedin || role != 'user'" to="/our-clients"
        >our clients</RouterLink
      >
      <RouterLink v-if="!logedin || role != 'user'" to="/contact-us"
        >contact us</RouterLink
      >
      <RouterLink to="/login" class="btn" v-if="!logedin">login</RouterLink>
      <RouterLink
        to="/admin"
        class="btn"
        v-if="role === 'superuser' && $route.path != '/login'"
        >Admin Panel</RouterLink
      >
      <RouterLink
        to="/school"
        class="btn"
        v-if="role === 'schooladmin' && $route.path != '/login'"
        >Admin Panel</RouterLink
      >

      <RouterLink
        to="/profile"
        v-if="role === 'user' && $route.path != '/login'"
        title="Profile"
        ><span class="material-symbols-outlined">
          account_circle
        </span></RouterLink
      >
      <RouterLink
        to="/orders"
        v-if="role === 'user' && $route.path != '/login'"
        title="Orders"
        ><span class="material-symbols-outlined">
          order_approve
        </span></RouterLink
      >
      <RouterLink
        to="/cart"
        v-if="role === 'user' && $route.path != '/login'"
        title="cart"
        ><span class="material-symbols-outlined"> shopping_cart </span>
        <!-- <div class="batch">
          {{
            this.$store.state.user.cart.length > 0
              ? this.$store.state.user.cart.length
              : ""
          }}
        </div> -->
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="btn"
        v-if="role === 'user' && $route.path != '/login'"
        >Shop
        <span class="material-symbols-outlined"> storefront </span></RouterLink
      >
      <!-- {{ $route.path }} -->
      <!-- <button  class="btn" v-if="role === 'user' && $route.path!='/login'" >Logout</button> -->
    </nav>
  </header>
  <nav v-if="menuOpen" class="mobile" id="gestureZone">
    <router-link to="/about">about us</router-link>
    <router-link to="uniforms">uniforms</router-link>
    <router-link to="/whyus">why us?</router-link>
    <router-link to="/our-clients">our clients</router-link>
    <router-link to="/contact-us">contact us</router-link>
    <router-link to="/login" class="btn" v-if="!logedin">login</router-link>
    <router-link
      to="/admin"
      class="btn"
      v-if="role === 'superuser' && $route.path != '/login'"
      >Admin Panel</router-link
    >
    <router-link
      to="/dashboard"
      class="btn"
      v-if="role === 'user' && $route.path != '/login'"
      >Dashboard</router-link
    >
    <!-- {{ $route.path }} -->
    <!-- <button  class="btn" v-if="role === 'user' && $route.path!='/login'" >Logout</button> -->
  </nav>
</template>

<script>
import store from "../../store";

export default {
  data() {
    return {
      logedin: false,
      role: "",
      menuOpen: false,
    };
  },
  async created() {
    if (localStorage.getItem("token")) {
      this.logedin = true;
      this.$store.dispatch("getuser");
    }
  },
  watch: {
    $route() {
      this.role = localStorage.getItem("role")
        ? localStorage.getItem("role")
        : "";
      if (localStorage.getItem("token")) {
        this.logedin = true;
      } else {
        this.logedin = false;
      }
      this.menuOpen = false;

      // if route change then scroll to top
      window.scrollTo(0, 0);
    },
  },

  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>

<style scoped>
.mobileu {
  display: none;
}
header {
  height: 13vh;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 100;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

header .logo {
  height: 80%;
  width: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

header .logo img {
  height: 100%;
  object-fit: cover;
}

.lognav {
  display: flex;
  width: fit-content;
  height: 100%;
}

.lognav a {
  color: #f16028;
  padding: 0rem 0.5rem;
  border-radius: 0;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  transition: all 0.3s ease-in-out;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  text-decoration: none;
  /* border-bottom: #f16028 2px solid; */
}

header .menu-toggle {
  height: 100%;
  width: 10%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}

header .menu-toggle i {
  font-size: 2rem;
  color: #f16028;
  transition: all 0.3s ease-in-out;
  margin-right: 1rem;
}

nav.mobile {
  display: none;
  transition: all 0.3s ease-in-out;
}

header nav {
  height: 100%;
  width: 70%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

header nav a {
  padding: 0;
  margin-right: 1rem;
  text-decoration: none;
  color: #000;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  text-align: center;
  text-transform: uppercase;
}

header nav a:hover {
  color: #f16028;
}

header nav a.btn,
header nav button.btn {
  background-color: #fff;
  color: #f16028;

  border: 1px solid #f16028;
  padding: 0.2rem 0.7rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  transition: all 0.3s ease-in-out;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

header nav a.btn span,
header nav button.btn span {
  font-size: 1.5rem;
  margin-left: 0.5rem;
}

header nav a.btn:hover {
  background-color: #f16028;
  color: #fff;
  outline: 1px solid #f16028;
}

header .menu-toggle {
  display: none;
}

@media screen and (max-width: 768px) {
  .mobileu {
    display: flex;
  }

  header .menu-toggle {
    display: block;
  }
  header {
    height: 100%;
    width: 100%;
    padding: 0;
  }
  header .logo {
    width: 30%;
  }

  header .logo img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  header .menu-toggle {
    width: 10%;
  }

  /* height 0 to fit content */

  nav.mobile:before {
    content: "";
    display: block;
    height: 0;
    width: 0;
    overflow: hidden;
  }

  nav.mobile {
    display: block;
    color: #f16028;
    height: fit-content;
    width: 99vw;
    z-index: 1000;
    background-color: #fff;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease-in-out;
    position: fixed;
    top: 10;
    right: 0;
    z-index: 1000;
  }

  nav.mobile.active {
    transform: translateX(0);
  }

  nav.mobile a {
    padding: 1rem 0;
    margin: 0;
    width: 100%;
    font-size: 1.5rem;
    font-weight: 500;
    text-transform: uppercase;
    text-decoration: none;
    text-align: center;
    color: #f16028;
    transition: all 0.3s ease-in-out;
  }

  nav a.btn {
    background: #f16028;
    color: #fff;
    border-radius: 0;
  }

  header nav.pc {
    display: none;
  }
}
</style>
  