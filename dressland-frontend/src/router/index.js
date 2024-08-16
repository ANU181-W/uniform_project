import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import HomeView from "../views/HomeView.vue";
import ChangePasswordViewVue from "../views/ChangePasswordView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/uniforms",
      name: "uniforms",
      component: () => import("../views/UniformsView.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/whyus",
      name: "whyus",
      component: () => import("../components/home/statsComponent.vue"),
    },
    {
      path: "/our-clients",
      name: "ourclients",
      component: () => import("../views/ClientsView.vue"),
    },
    {
      path: "/contact-us",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
    },

    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: () => import("../views/PolicyView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignUpView.vue"),
    },
    {
      path: "/reset-password/:token",
      name: "change-password",
      component: () => import("../views/ChangePasswordView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/admin/:id",
      name: "adminid",
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/item/:id",
      name: "item",
      component: () => import("../views/ItemView.vue"),
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("../views/CartView.vue"),
    },
    {
      path: "/query",
      name: "query",
      component: () => import("../views/QuaryValuesView.vue"),
    },
    {
      path: "/payment",
      name: "payment",
      component: () => import("../views/PaymentSuccessView.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("../views/OrdersView.vue"),
    },
    {
      path: "/school",
      name: "school",
      component: () => import("../views/SchoolView.vue"),
    },
    {
      path: "/school/:id",
      name: "idschool",
      component: () => import("../views/SchoolView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = [
    "/login",
    "/signup",
    "/",
    "/cart",
    "/uniforms",
    "/privacy-policy",
    "/school",
    "/school/:id",
    "/change-password/:token",
    "/change-password/",
  ];
  console.log(to.name);
  console.log(to.name == "change-password");

  let publicpagesnames = [
    "login",
    "signup",
    "home",
    "about",
    "whyus",
    "ourclients",
    "contact",
    "uniforms",
    "privacy-policy",
    "change-password",
  ];

  if (publicpagesnames.includes(to.name)) {
    next();
  }
  const authRequired = !publicpagesnames.includes(to.name);
  let loggedIn = localStorage.getItem("token");
  // check expiry of jwt token
  // if expired, redirect to login page
  if (loggedIn) {
    const token = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
    const expiry = token.exp;
    const now = new Date();
    const nowTime = now.getTime() / 1000;
    if (nowTime > expiry) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } else {
      // console.log("token not expired");
    }
  }

  loggedIn = localStorage.getItem("token");

  // console.log(store.state.role);

  if (to.path == "/admin" && localStorage.getItem("role") != "superuser") {
    next("/dashboard");
  }

  if (to.path == "/admin/:id" && localStorage.getItem("role") != "superuser") {
    next("/dashboard");
  }

  if (to.path == "/dashboard" && localStorage.getItem("role") != "user") {
    next("/login");
  }

  if (to.path == "/profile" && localStorage.getItem("role") != "user") {
    next("/login");
  }

  if (to.path == "/orders" && localStorage.getItem("role") != "user") {
    next("/login");
  }

  if (to.path == "/item/:id" && localStorage.getItem("role") != "user") {
    next("/login");
  }

  if (to.path == "/cart" && localStorage.getItem("role") != "user") {
    next("/login");
  }

  if (to.path == "/school" && localStorage.getItem("role") != "schooladmin") {
    next("/login");
  }

  if (to.path == "/school" && localStorage.getItem("role") == "schooladmin") {
    next("/school/dashboard");
  }

  if (
    to.path == "/school/:id" &&
    localStorage.getItem("role") != "schooladmin"
  ) {
    next("/login");
  }

  if (
    to.path == "/login" &&
    loggedIn &&
    localStorage.getItem("role") == "user"
  ) {
    next("/dashboard");
  }

  if (
    to.path == "/login" &&
    loggedIn &&
    localStorage.getItem("role") == "superuser"
  ) {
    next("/admin");
  }

  if (
    to.path == "/login" &&
    loggedIn &&
    localStorage.getItem("role") == "schooladmin"
  ) {
    next("/school");
  }

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
