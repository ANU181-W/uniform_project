<template>
  <div class="schoolsidepanel">
    <div class="over" v-if="changepassword">
      <div class="form">
        <input type="password" v-model="opass" placeholder="Old Password" />
        <input type="password" v-model="npass" placeholder="New Password" />
        <input type="password" v-model="cpass" placeholder="Confirm Password" />
        <p style="color: red">{{ message }}</p>
        <div class="btns">
          <button @click="changepass">Change</button>
          <button @click="changepassword = false">Cancel</button>
        </div>
      </div>
    </div>
    <div class="title" v-if="this.$store.state.user">
      <!-- <div class="logo">
        <img
          :src="
            'http://localhost:3000/image/school/' +
            this.$store.state.user.school.image 
          "
          alt="School logo"
        />
      </div> -->
      <div class="name">
        <br />
        <h2>{{ this.$store.state.user.name }}</h2>
        <button @click="$store.dispatch('signout')">Log Out</button>
      </div>
    </div>
    <div class="menu">
      <router-link to="/school">Home</router-link>
      <router-link to="/school/orders">Orders</router-link>
      <router-link to="/school/students">Students</router-link>
      <router-link to="" @click="changepassword = true"
        >Change Password</router-link
      >
    </div>
    <!-- <div class="logout">
      <button @click="$store.dispatch('signout')">Logout</button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "sidepanelComponent",
  data() {
    return {
      changepassword: false,
      opass: "",
      npass: "",
      cpass: "",
      message: "",
    };
  },
  async created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }

    if (localStorage.getItem("role") !== "schooladmin") {
      this.$router.push("/login");
    }

    // check user in state if not present then fetch
    if (!this.$store.state.user) {
      await this.$store.dispatch("getuser");
    }
    // console.log("user in sidepanel");
    // console.log(this.$store.state.user);
  },
  methods: {
    async changepass() {
      if (this.npass === this.cpass) {
        const body = {
          opassword: this.opass,
          npassword: this.npass,
        };
        await this.axios
          .post("http://localhost:3000/school/resetpassword", body, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            // console.log(res);
            if (res.data.status === "fail") {
              this.message = res.data.message;
              return;
            } else {
              this.changepassword = false;
              this.opass = "";
              this.npass = "";
              this.cpass = "";
              this.message = "";
            }
          })
          .catch((err) => {
            // console.log(err);
          });
      } else {
        alert("Passwords do not match");
      }
    },
  },
};
</script>

<style scoped>
.over {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.over .form {
  width: 50%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
}

.over input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  text-decoration: none;
  color: #333;
  font-size: 1.2em;
  font-weight: 700;
  text-align: center;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
}

.over input:focus {
  outline: none;
  border: 1px solid #333;
}

.over .btns {
  width: 60%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.over button {
  width: 48%;
  padding: 10px;
  margin: 10px 0;
  text-decoration: none;
  color: #333;
  font-size: 1.2em;
  font-weight: 700;
  text-align: center;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
}

.over button:hover {
  background-color: #333;
  color: #fff;
}

.schoolsidepanel {
  width: 20vw;
  height: 100%;
  min-height: 90vh;
  background-color: #f16028;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.schoolsidepanel .title {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.schoolsidepanel .title .logo {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.schoolsidepanel .title .logo img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.schoolsidepanel .title .name {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.schoolsidepanel .title .name h2 {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.schoolsidepanel .title .name button {
  width: 60%;
  padding: 0.2rem;
  margin: 10px 0;
  text-decoration: none;
  color: #f0f0f0;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease-in-out;
  border: none;
  outline: none;
  background-color: transparent;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 0;
  margin-bottom: 2rem;
}

.schoolsidepanel .title .name button:hover {
  background-color: #f0f0f0;
  color: #333;
}

.schoolsidepanel .menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 2rem;
}

.schoolsidepanel .menu a {
  width: 100%;
  padding: 10px;
  text-decoration: none;
  color: #fff;
  font-size: 1em;
  font-weight: 400;
  text-align: left;
  transition: all 0.2s ease-in-out;
  border-bottom: 1px solid #f0f0f0;
}

.schoolsidepanel .menu a:hover {
  background-color: #333;
  color: #f5f5f5;
}

.schoolsidepanel .logout {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.schoolsidepanel .logout button {
  width: 100%;
  padding: 10px;
  text-decoration: none;
  color: #333;
  font-size: 1.2em;
  font-weight: 700;
  text-align: center;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
  background-color: #333;
  color: #f5f5f5;
}

.schoolsidepanel .logout button:hover {
  background-color: #f5f5f5;
  color: #333;
  outline: 1px solid #333;
}
</style>
