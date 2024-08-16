<template>
  <div class="profile">
    <!-- {{ $store.state.user }} -->
    <div class="over" v-if="over">
      <div class="close">
        <button @click="close">X</button>
      </div>
      <div class="addform">
        <!-- adname -->
        <div class="input">
          <label for="adname">Name</label>
          <input type="text" id="name" v-model="adname" />
        </div>
        <!-- admobile -->
        <div class="input">
          <label for="admobile">Mobile</label>
          <input type="text" id="admobile" v-model="admobile" />
        </div>
        <!-- address -->
        <div class="input">
          <label for="address">Address</label>
          <input type="text" id="address" v-model="address" />
        </div>
        <!-- pincode -->
        <div class="input">
          <label for="pincode">Pincode</label>
          <input type="text" id="pincode" v-model="pincode" />
        </div>
        <!-- city -->
        <div class="input">
          <label for="city">City</label>
          <input type="text" id="city" v-model="city" />
        </div>
        <!-- state -->
        <div class="input">
          <label for="state">State</label>
          <input type="text" id="state" v-model="state" />
        </div>
        <!-- country -->
        <div class="input">
          <label for="country">Country</label>
          <input type="text" id="country" v-model="country" />
        </div>
        <!-- submit -->
        <div class="button">
          <button @click="add">Update</button>
        </div>
      </div>
    </div>
    <div class="title">
      <h1>Profile</h1>
      <h2>{{ $store.state.user.name }}</h2>
      <p>School: {{ $store.state.user.school.name }}</p>
      <div class="links">
        <p @click="resetpass" v-if="!processing">Reset Password</p>
        <p v-if="processing">Processing...</p>
        <p style="color: red" @click="logout">Logout</p>
      </div>
    </div>
    <div class="form">
      <div class="input">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="$store.state.user.name" />
      </div>
      <div class="input">
        <label for="email">Email</label>
        <input
          type="text"
          id="email"
          v-model="$store.state.user.email"
          disabled
        />
      </div>
      <!-- phone -->
      <div class="input">
        <label for="phone">Phone</label>
        <input type="text" id="phone" v-model="$store.state.user.phone" />
      </div>

      <!-- address -->
      <div class="address">
        <label for="address"
          >Address:
          {{
            $store.state.user.addresses &&
            $store.state.user.addresses.length > 0
              ? $store.state.user.addresses[0].name +
                ", " +
                $store.state.user.addresses[0].address
              : "No Address"
          }}</label
        >

        <button class="address" @click="editaddress">Edit Address</button>
      </div>

      <button @click="update" v-if="!processing">Update</button>
      <p v-if="processing">Processing...</p>

      <br /><br />
    </div>
  </div>
</template>

<script>
import { registerRuntimeHelpers } from "@vue/compiler-core";

export default {
  name: "ProfileView",
  data() {
    return {
      adname: "",
      admobile: "",
      address: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
      over: false,
      processing: false,
    };
  },
  created() {
    this.$store.dispatch("getuser");
  },
  methods: {
    async update() {
      this.processing = true;
      // validate phone number
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(this.$store.state.user.phone)) {
        alert("Please enter a valid phone number");
        this.processing = false;
        return;
      }
      await this.axios
        .put(
          "http://localhost:3000/user/",
          {
            name: this.$store.state.user.name,
            phone: this.$store.state.user.phone,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            this.$store.dispatch("getuser");
          } else {
            alert(data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.processing = false;
    },
    close() {
      this.over = false;
    },

    async resetpass() {
      this.processing = true;
      await this.axios
        .get(
          "http://localhost:3000/api/forgot-password/" +
            this.$store.state.user.email
        )
        .then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            alert("Password reset link sent to your email");
            this.resetpass = false;
          } else {
            alert(data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.processing = false;
    },

    editaddress() {
      this.over = true;
      if (this.$store.state.user.addresses.length > 0) {
        if (this.$store.state.user.addresses[0].address === "not set") {
          this.adname = "";
          this.admobile = "";
          this.address = "";
          this.pincode = "";
          this.city = "";
          this.state = "";
          this.country = "";

          return;
        }
        this.adname = this.$store.state.user.addresses[0].name;
        this.admobile = this.$store.state.user.addresses[0].mobile;
        this.address = this.$store.state.user.addresses[0].address;
        this.pincode = this.$store.state.user.addresses[0].pincode;
        this.city = this.$store.state.user.addresses[0].city;
        this.state = this.$store.state.user.addresses[0].state;
        this.country = this.$store.state.user.addresses[0].country;
        // phone verification
        // validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(this.admobile)) {
          alert("Please enter a valid phone number");
          return;
        }
      } else {
        this.adname = "";
        this.admobile = "";
        this.address = "";
        this.pincode = "";
        this.city = "";
        this.state = "";
        this.country = "";
      }
    },
    async add() {
      const ddata = {
        name: this.adname,
        mobile: this.admobile,
        address: this.address,
        pincode: this.pincode,
        city: this.city,
        state: this.state,
        country: this.country,
      };

      // validate phone number
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(this.admobile)) {
        alert("Please enter a valid phone number");
        return;
      }
      const response = await this.axios
        .post("http://localhost:3000/user/address", ddata, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          let data = response.data;
          // console.log("data", data);
          if (!data) {
            alert("Something went wrong", data);
            return;
          }
          this.$store.dispatch("getuser");
          this.over = false;
          this.adname = "";
          this.admobile = "";
          this.address = "";
          this.pincode = "";
          this.city = "";
          this.state = "";
          this.country = "";
        })
        .catch((error) => {
          // console.log(error);
        });
    },
    logout() {
      this.$store.dispatch("signout");
      this.$router.push("/login");
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
  justify-content: center;
  align-items: center;
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

.addform {
  width: 50%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 1rem;
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
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;
}

.input input {
  width: 85%;
  height: 100%;
  margin-left: 0.5rem;
  border: none;
  outline: none;
  border-bottom: 1px solid #909090;
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

.profile {
  width: 100%;
  height: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 90vh;
}

.title {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.title h1 {
  font-size: 2rem;
  font-weight: 600;
}

.title h2 {
  font-size: 1.5rem;
  font-weight: 400;
}

.links {
  width: 100%;
  height: 5%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  /* margin-bottom: 20px; */
}

.links p {
  font-size: 1rem;
  font-weight: 400;
  margin-right: 20px;
  cursor: pointer;
}

.form {
  width: 60%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.form .input {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 20px;
}

.form .input label {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 10px;
}

.form .input input {
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 1rem;
  font-weight: 400;
}

.form button {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: #000;
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
}

.form button:hover {
  background-color: #333;
}

.form button:active {
  background-color: #666;
}

.address {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.address label {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 10px;
}

.address button.address {
  width: fit-content;
  height: fit-content;
  padding: 0.2rem 0.5rem;
  border: none;
  border-radius: 5px;
  background-color: #000;
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
}
</style>
