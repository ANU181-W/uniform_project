<template>
  <div class="sign-up">
    <div class="container">
      <div class="logo">
        <!-- <img src="../../assets/images/logo.png" alt="logo" /> -->
        <h1>Sign Up</h1>
      </div>
      <div class="form">
        <div class="input">
          <input type="text" placeholder="Name" v-model="name" />
        </div>
        <div class="input">
          <input type="text" placeholder="Phone Number" v-model="phone" />
        </div>
        <div class="input">
          <select name="school" id="school" v-model="school">
            <option value="">Select School</option>
            <option
              v-for="school in schools"
              :key="school.id"
              :value="school.name"
            >
              {{ school.name }}
            </option>
          </select>
        </div>
        <div class="input">
          <input type="text" placeholder="School code" v-model="schoolcode" />
        </div>
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
        </div>
        <div class="input">
          <input
            type="password"
            placeholder="Confirm Password"
            v-model="confirmPassword"
          />
        </div>
        <div class="button">
          <button @click="sign">Sign Up</button>
        </div>
      </div>
    </div>
    <!-- {{ schools }} -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      phone: "",
      school: "",
      email: "",
      password: "",
      confirmPassword: "",
      schoolcode: "",
      schools: null,
    };
  },

  created() {
    this.getSchools();
  },

  methods: {
    async sign() {
      // console.log(
      //   this.name,
      //   this.phone,
      //   this.school,
      //   this.email,
      //   this.password,
      //   this.confirmPassword
      // );

      if (
        !this.name ||
        !this.phone ||
        !this.school ||
        !this.email ||
        !this.password ||
        !this.confirmPassword
      ) {
        alert("Please fill all the fields");
        return;
      }

      if (this.password !== this.confirmPassword) {
        alert("Password and Confirm Password must be same");
        return;
      }

      // validate email
      const emailRegex =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!emailRegex.test(this.email)) {
        alert("Please enter a valid email");
        return;
      }

      // validate phone number
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(this.phone)) {
        alert("Please enter a valid phone number");
        return;
      }

      await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.name,
          phone: this.phone,
          school: this.school,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
          schoolcode: this.schoolcode,
        }),
      })
        .then((res) => {
        
          if (res.status === 200) {
            console.log("Signed Up Successfully");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Invalid Credentials");
        });

      const body = {
        email: this.email,
        password: this.password,
      };

      await this.$store.dispatch("login", body);

      this.name = "";
      this.phone = "";
      this.school = "";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";

      // alert('Signed Up Successfully')
    },
    async getSchools() {
      // const response = await fetch('http://localhost:3000/api/get/schools')
      // const data = await response.json()
      // this.schools = data
      console.log("hhh");
      await this.axios
        .get("http://localhost:3000/api/get/schools")
        .then((res) => {
            console.log("school" ,res.data);
          this.schools = res.data;
          
        });

       
    },
  },
};
</script>

<style scoped>
.sign-up {
  height: 110vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.sign-up .container {
  width: 50%;
  box-sizing: border-box;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sign-up .container .logo {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.sign-up .container .logo img {
  height: 100%;
  width: 100%;
}

.sign-up .container .logo h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #000;
}

.sign-up .container .form {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sign-up .container .form {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sign-up .container .form .input {
 
  height: 10%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0.5rem 0.5rem;
}

.sign-up .container .form .input input {
  margin: 1rem;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  border-bottom: 1px solid #464646;
  font-size: 1.2rem;
  font-weight: 500;
  color: #f16028;
}

/* placeholder */
.sign-up .container .form .input input::placeholder {
  color: #f16028;
  font-size: 1.2rem;
  font-weight: 500;
}

.sign-up .container .form .input select {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  border-bottom: 1px solid #464646;
  font-size: 1.2rem;
  font-weight: 500;
  color: #f16028;
}

.sign-up .container .form .button {
  height: 10%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sign-up .container .form .button button {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: #f16028;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
}

@media screen and (max-width: 768px) {
  .sign-up {
    height: 90vh;
  }
  .sign-up .container {
    width: 100%;
  }
  .sign-up .container .logo {
    margin-top: 0;
  }
  .sign-up .container .form .input input {
    font-size: 1rem;
    margin: 0.2rem 0;
  }
  .sign-up .container .form .input input::placeholder {
    font-size: 1rem;
  }
  .sign-up .container .form .input select {
    font-size: 1rem;
  }
  .sign-up .container .form .button button {
    font-size: 1rem;
    padding: 0.2rem 0;
  }
}
</style>
