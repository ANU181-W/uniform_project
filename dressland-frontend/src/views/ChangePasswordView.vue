<template>
  <div class="change-password-view">
    <h1>Change Password</h1>
    <div class="form">
      <div class="input">
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <div class="input">
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          v-model="confirmPassword"
        />
      </div>
      <div class="input">
        <button type="submit" class="btn btn-primary" @click="changePassword">
          Change Password
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePasswordView",
  data() {
    return {
      password: "",
      confirmPassword: "",
      token: this.$route.params.token,
    };
  },
  created() {
    this.token = this.$route.params.token;
  },
  methods: {
    async changePassword() {
      console.log(this.token);
      console.log(this.password);
      console.log(this.confirmPassword);
      if (this.password === this.confirmPassword) {
        let body = {
          password: this.password,
          token: this.token,
        };
        await this.axios
          .post("http://localhost:3000/api/reset-password", body)
          .then((res) => {
            console.log(res);
            if (res.data.status === "success") {
              alert("Password changed successfully");
              this.$router.push("/login");
            } else {
              alert("Password change failed erroe: " + res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("Passwords do not match");
      }
    },
  },
};
</script>

<style scoped>
.change-password-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input {
  margin: 10px;
  width: 90%;
}

.input input {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  border-bottom: #ccc 1px solid;
}

.btn {
  width: 100%;
}

.btn-primary {
  background-color: #f16028;
  border-color: #f16028;
  color: #fff;
}

@media (max-width: 768px) {
  .form {
    width: 80%;
  }
}
</style>
