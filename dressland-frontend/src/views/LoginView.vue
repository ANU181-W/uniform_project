<template>
  <div class="login">
    <div class="over" v-if="resetpass">
      <div class="form">
        <div class="title-1">
          <h1>Forgot Password</h1>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
            
          </p>
        </div>
        <div class="input-1">
          <input
            type="text"
            placeholder="Email"
            v-model="email"
            @keyup.enter="resetpassfn"
          />
        </div>
        <div class="button m-2">
          <button @click="resetpassfn" v-if="!processing">
            Send password reset link
          </button>
          <button disabled class="ripls" v-else>Sending...</button>
        </div>
        <div class="signup">
          <router-link to="/login" @click="resetpass = false"
            >Back to Sign In</router-link
          >
        </div>
      </div>
    </div>
    <div class="form" :class="wrongcred">
      <div class="logo">
        <!-- <img src="../assets/images/header-logo.png" alt="logo" /> -->
        <h1>Sign In</h1>
      </div>

      <div class="input m-1">
        <input type="text" placeholder="Email" v-model="email" />
      </div>
      <div class="input m-1">
        <!-- if enter is pressed -->
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          @keyup.enter="login"
        />
      </div>
      <p style="color: red">
        {{ message }}
      </p>
      <div class="button m-2" v-if="!processing">
        <button @click="login">Sign In</button>
      </div>
      <div class="button m-2" v-else>
        <button disabled class="ripls">Signing In...</button>
      </div>
      <div class="forgot">
        <router-link to="" @click="resetpass = true"
          >Forgot Password?</router-link
        >
      </div>
      <div class="signup">
        <router-link to="/signup">Don't have an account? Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      resetpass: false,
      message: "",
      processing: false,
    };
  },
  computed: {
    wrongcred() {
      if (this.message) {
        return "wrongcred";
      }
    },
  },

  watch: {
    email() {
      this.message = "";
    },
    password() {
      this.message = "";
    },
  },

  methods: {
    async login() {
      this.processing = true;
      const body = {
        email: this.email,
        password: this.password,
      };

      await this.$store.dispatch("login", body);
      this.processing = false;
      if (localStorage.getItem("token")) {
        if (this.$store.state.role === "superuser") {
          this.$router.push("/admin");
        } else if (this.$store.state.role === "schooladmin") {
          this.$router.push("/school");
        } else if (this.$store.state.role === "user") {
          this.$router.push("/dashboard");
        } else {
          this.$router.push("/login");
        }
      } else {
        this.message = "Invalid email or password";
      }
    },

    async resetpassfn() {
      this.processing = true;
      await this.axios
        .get("http://localhost:3000/api/forgot-password/" + this.email)
        .then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            alert("Password reset link sent to your email");
            this.resetpass = false;
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.processing = false;
    },
  },
};
</script>

<style scoped>
.login {
  height: 90vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.over {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f52c;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.over .form .title {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.form {
  height: fit-content;
  height: 75%;
  width: 40%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form.wrongcred {
  animation: shake 0.5s;
  box-shadow: 0 0 40px rgba(255, 0, 0, 0.4);
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(10px);
  }
  50% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
}

.login .form .logo {
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .form .logo img {
  height: 100%;
  width: auto;
}

.login .form .title {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.login .form .title h1 {
  /* margin-bottom: 5rem; */
  font-size: 2rem;
  font-weight: 700;
}

.login .form .input {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-1{
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-1 input{
  height: 100%;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .form .input input {
  height: 100%;
  width: 80%;
  border: none;
  border-bottom: 1px solid #f16028;
  outline: none;
  font-size: 1rem;
  font-weight: 300;
  padding: 0 1rem;
}

.login .form .button {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .form .button button {
  height: 100%;
  width: 80%;
  background-color: #f16028;
  color: #fff;
  font-size: 1rem;
  font-weight: 300;
  border: none;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
}

.ripls {
  /* loading loop animation */
  animation: ripls 1s infinite;
}

@keyframes ripls {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
}

.login .form .forgot {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .form .forgot a {
  font-size: 1rem;
  font-weight: 300;
  color: black;
  text-decoration: none;
}

.login .form .signup {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login .form .signup a {
  font-size: 1rem;
  font-weight: 300;
  color: black;
  text-decoration: none;
}

@media screen and (max-width: 768px) {
  .login {
    height: 90vh;
  }
  .login .form {
    height: fit-content;
    width: 100%;
    border-radius: 0;
    padding: 1rem 0;
  }

  .login .form .logo {
    height: 20%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login .form .input {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login .form .input input {
    width: 90%;
    border: none;
    border-bottom: 1px solid #f16028;
    outline: none;
    font-size: 1rem;
    font-weight: 300;
    padding: 0.2rem 0.5rem;
  }

  .login .form .button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login .form .button button {
    width: 90%;
    background-color: #f16028;
    color: #fff;
    font-size: 1rem;
    font-weight: 300;
    padding: 0.2rem 0;
    border: none;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
  }

  .login .form .forgot {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login .form .forgot a {
    font-size: 0.7rem;
    font-weight: 300;
    color: black;
    text-decoration: none;
  }

  .login .form .signup {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login .form .signup a {
    font-size: 0.7rem;
    font-weight: 300;
    color:black;
    text-decoration: none;
  }
}
</style>
