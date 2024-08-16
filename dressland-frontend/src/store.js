import axios from "axios";
import { createStore } from "vuex";
import router from "./router";

const store = createStore({
  state() {
    return {
      count: 0,
      isLoggedIn: false,
      user: null,
      role: null,
      products: [],
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    login(state, user) {
      state.isLoggedIn = true;
      state.user = user;
    },
    role(state, role) {
      state.role = role;
    },
    user(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login(context, body) {
      let data = {
        email: body.email,
        password: body.password,
      };

      // console.log(data);
      const response = await axios
        .post("http://localhost:3000/api/login", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let data = response.data;
          if (!data.token) {
            alert("Invalid Credentials");
            return;
          }

          context.commit("role", data.role);

          // // console.log(data.token);
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);

          if (data.role == "user") {
            router.push("/dashboard");
          }
          if (data.role == "superuser") {
            router.push("/admin");
          }
          if (data.role == "schooladmin") {
            router.push("/school");
          }
        })
        .catch((error) => {
          // console.log(error);
        });
    },
    signout(context) {
      // context.commit("login", null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      context.commit("role", null);
      router.push("/login");
    },

    async getuser(context) {
      if (!localStorage.getItem("token")) {
        this.dispatch("signout");
      }
      if (localStorage.getItem("role") == "superuser") {
        router.push("/admin");
      }
      if (localStorage.getItem("role") == "schooladmin") {
        router.push("/school");
      }
      let link = "http://localhost:3000/user/";
      if (localStorage.getItem("role") == "schooladmin") {
        link = "http://localhost:3000/school/";
      }

      const response = await axios
        .get(link, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          let data = response.data;
          context.commit("user", data);
        })
        .catch((error) => {
          this.dispatch("signout");
          // console.log(error);
        });
    },

    async getproducts(context) {
      const response = await axios
        .get("http://localhost:3000/user/products/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          let data = response.data;
          context.state.products = data;
        })
        .catch((error) => {
          this.dispatch("signout");
          // console.log(error);
        });
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
  },

  async addaddress(context, body) {
    let data = {
      name: body.name,
      phone: body.phone,
      address: body.address,
      pincode: body.pincode,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
    };

    // console.log(data);
    const response = await axios
      .post("http://localhost:3000/user/address", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        let data = response.data;
        // console.log("data", data);
        if (!data) {
          alert("Invalid Credentials");
          return;
        }
        this.dispatch("getuser");
      })
      .catch((error) => {
        // console.log(error);
      });
  },
});

export default store;
