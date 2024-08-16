<template>
  <div class="admindashmain">
    <div class="over" v-if="over">
      <div class="close">
        <button @click="close">X</button>
      </div>
      <div class="form">
        <div class="input">
          <input
            type="password"
            placeholder="Old Password"
            v-model="opassword"
          />
        </div>

        <div class="input">
          <input
            type="password"
            placeholder="New Password"
            v-model="npassword"
          />
        </div>

        <div class="input">
          <input
            type="password"
            placeholder="Confirm New Password"
            v-model="cpassword"
          />
        </div>

        <div class="button">
          <button @click="reset">Reset</button>
        </div>
      </div>
    </div>
    
    <div class="cards">
      <div class="card">
        <h3>Users</h3>
        <h4>{{ users.length }}</h4>
      </div>
      <div class="card">
        <h3>Schools</h3>
        <h4>{{ schools.length }}</h4>
      </div>
      <div class="card ">
        <h3>Succeful Orders</h3>
        <h4>
          {{
            orders.filter((order) => {
              return order.status != "Pending";
            }).length
          }}
        </h4>
      </div>
      <div class="card">
        <h3>Failed Orders</h3>
        <h4>
          {{
            orders.filter((order) => {
              return order.status == "Pending";
            }).length
          }}
        </h4>
      </div>

      <div class="card bg12">
        <h3>Transactions</h3>
        <h4>
          <!-- ruppee symbol -->
          &#8377;

          {{
            // , after every 3 digits from right
            orders
              .filter((order) => {
                return order.status != "Pending";
              })
              .reduce((acc, order) => {
                return acc + Number(order.totalPrice);
              }, 0)
              .toString()
              .split("")
              .reverse()
              .join("")
              .match(/.{1,3}/g)
              .join(",")
              .split("")
              .reverse()
              .join("")
          }}
        </h4>
      </div>
    </div>
    <div class="title">
      <button @click="over = true">Reset Password</button>
    </div>
    <div class="lowstocktitle">
      <h2>Low Stock Products</h2>
    </div>
    <table class="styled-table">
  <tr class="first">
    <th>Sr. No.</th>
    <th>School Name</th>
    <th>Product</th>
    <th>Size</th>
    <th>Quantity</th>
  </tr>
  <tr v-for="(size, index) in lowstocksizes" :key="size.size">
    <td>{{ index + 1 }}</td>
    <td>{{ size.school }}</td>
    <td>{{ size.name }}</td>
    <td>{{ size.size }}</td>
    <td>{{ size.quantity }}</td>
  </tr>
</table>

    
  </div>
</template>

<script>
export default {
  name: "dashboardComponent",
  data() {
    return {
      users: [],
      products: [],
      schools: [],
      orders: [],
      lowstocksizes: [],
      over: false,
      opassword: "",
      npassword: "",
      cpassword: "",
    };
  },
  async created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }
    await this.getusers();
    await this.getProducts();
    await this.getSchools();
    await this.getOrders();
    await this.getLowStockSizes();
  },
  conputed: {},
  methods: {
    noticed() {
      localStorage.setItem("notice", true);
    },
    close() {
      this.over = false;
      this.opassword = "";
      this.npassword = "";
      this.cpassword = "";
    },
    async reset() {
      if (this.npassword == this.cpassword) {
        await this.axios
          .post(
            "http://localhost:3000/superuser/resetpassword",
            {
              opassword: this.opassword,
              npassword: this.npassword,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            if (res.data.status == "success") {
              alert("Password Reset Successful");
              this.close();
              return;
            } else {
              alert("Password Reset Failed");
            }
          })
          .catch((err) => {
            console.log(err);
            alert("Password Reset Failed");
          });
      } else {
        alert("Passwords do not match");
      }
    },
    async getusers() {
      try {
        await this.axios
          .get("http://localhost:3000/superuser/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            this.users = res.data;
            // console.log(this.users);
          });
      } catch (err) {
        // console.log(err);
      }
    },
    async getProducts() {
      const response = await this.axios
        .get("http://localhost:3000/superuser/products", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.products = res.data;
          // console.log(this.products);
        });
    },
    async getSchools() {
      const res = await this.axios
        .get("http://localhost:3000/superuser/schools", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.schools = res.data;
        });
    },
    async getOrders() {
      this.axios
        .get("http://localhost:3000/superuser/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.orders = res.data.reverse();
          //   only first 2 orders
          // this.orders = this.orders.slice(0, 4);
        })
        .catch((err) => {
          // console.log(err);
        });
    },

    async getLowStockSizes() {
      if (this.products.length > 0) {
        this.products.forEach((product) => {
          console.log(product);
          product.Productsize.forEach((size) => {
            if (size.quantity < 10) {
              this.lowstocksizes.push({
                name: product.name,
                school: product.school.name,
                size: size.size,
                quantity: size.quantity,
              });
            }
          });
        });
      }

      // in decreasing order of quantity
      this.lowstocksizes
        .sort((a, b) => {
          return b.quantity - a.quantity;
        })
        .reverse();
    },
  },
};
</script>

<style scoped>

.form{
  height: 70%;
  width: 30%;
}

.form input {
  font-size: 15px;
}
.button{
  margin-top: 2rem;
  font-size: 1.2rem;
  transition: o.6s ease-in-out;
}
.button button{
  background-color:#f16028;
}
.button button:hover{
  background-color:#f16028;
  color: black
}
.admindashmain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}


.title {
  width: 100%;
  /* height: 10%; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding-left: 1rem;
  margin-right: 2rem;
  margin-top: 2rem;
}



.title button {
  background-color: white;
  color: #f16028;
  border:1px solid #f16028;
  width: fit-content;
  height: fit-content;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
}

.title button:hover {
  background: #f16028;
  color: #fff;
  font-weight: bold;
  border-radius: 0.5rem;
}

.sec {
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sec .title {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sec .title h2 {
  font-size: 2rem;
  font-weight: 400;
  color: #333;
}

.cards {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 0 !important;
  margin-top: 1rem;
  gap: 0.5rem;
  /* flex-wrap: wrap; */
}

.card{
  width:10rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

.card h3{
  font-size: 1rem;

}
.lowstocktitle {
  width: 80%;
  height: 20%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 2rem 1rem;
  margin-bottom: 0;
}

.lowstocktitle h2 {
  font-size: 2rem;
  font-weight: 400;
  color: #333;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  
}

.styled-table th, .styled-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.styled-table th {
  background-color: #f2f2f2;
  color: #333;
}

.styled-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.styled-table tr:hover {
  background-color: #ddd;
}

/* table {
  width: 80%;
  height: 100%;
  border-collapse: collapse;
  margin: 1rem 1rem;
}

table tr {
  height: 1.5rem;
  border-bottom: 1px solid #333;
}

table tr td {
  font-size: 1rem;
  font-weight: 400;
  color: #333;
  padding: 0.5rem 0;
}*/

.first th{
  font-size: 1rem;
  font-weight: 500;
  background-color: black;
  color: white;
} 



</style>
