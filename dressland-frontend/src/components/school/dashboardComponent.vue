<template>
  <div class="dashmain">
    <div class="title" v-if="this.$store.state.user">
      <div class="text">
        <h1>Welcome</h1>
        <h2>{{ this.$store.state.user.school.name }}</h2>
      </div>
      <div class="logo">
        <img
          :src="
           'http://localhost:3000/image/school/' +
            this.$store.state.user.school.image + '?width=200'
          "
          alt="School logo"
        />
      </div>
    </div>
    <div class="stats">
      <div class="subt">
        <h2>Order Statistics</h2>
      </div>
      <div class="cards" v-if="orders.length != 0">
        <div class="card bg1">
          <h3>Total Orders</h3>
          <h4>{{ this.orders.length }}</h4>
        </div>
        <div class="card bg2">
          <h3>Succefull Orders</h3>
          <h4>
            {{
              this.orders.filter((order) => {
                return order.status != "Pending";
              }).length
            }}
          </h4>
        </div>

        <div class="card bg3">
          <h3>Failed/Pending Orders</h3>
          <h4>
            {{
              this.orders.filter((order) => {
                return order.status == "Pending";
              }).length
            }}
          </h4>
        </div>
        <!-- total amount of succefull orders -->

        <div class="card bg4">
          <h3>Total Amount</h3>
          <h4>
            <!-- rupee symbol -->
            ₹

            <!-- {{ totalamount }} -->
            <!-- , after every 3 digits from right -->
            {{
              totalamount
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
    </div>
    <div class="stats" v-if="students.length != 0">
      <div class="subt">
        <h2>Students Statistics</h2>
      </div>
      <div class="cards">
        <div class="card bg5">
          <h3>Total Students</h3>
          <h4>{{ this.students.length }}</h4>
        </div>

        <div class="card bg6">
          <h3>Students with orders</h3>
          <h4>
            {{
              this.students.filter((student) => {
                // return student.orders.length != 0;
                // student has placed atleast one order with status not Pending
                return (
                  student.orders.filter((order) => {
                    return order.status != "Pending";
                  }).length != 0
                );
              }).length
            }}
          </h4>
        </div>

        <div class="card bg7">
          <h3>Blocked students</h3>
          <h4>
            {{
              this.students.filter((student) => {
                return student.role == "blocked";
              }).length
            }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dashboardComponent",
  data() {
    return {
      orders: [],
      students: [],
    };
  },
  computed: {
    totalamount() {
      let total = 0;
      this.orders.forEach((order) => {
        if (order.status != "Pending") {
          // console.log(order.totalPrice);
          total += Number(order.totalPrice);
        }
      });
      return total;
    },
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

    await this.axios
      .get("http://localhost:3000/school/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.orders = res.data;
        // console.log(this.orders);
      })
      .catch((err) => {
        // console.log(err);
      });

    await this.axios
      .get("http://localhost:3000/school/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.students = res.data;
        // console.log(this.students);
      })
      .catch((err) => {
        // console.log(err);
      });
  },
};
</script>

<style scoped>
.dashmain {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 1rem;
  padding: 1rem;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 80vw;
}

.title h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.title h2 {
  font-size: 1rem;
  font-weight: 400;
  color: #f16028;
}

.logo {
  width: 150px;
  margin-right: 1rem;
  /* position on top */
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 2rem;
}

.subt {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.subt h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.cards {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.card {
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1.5rem;
  margin-right: 2rem;
  border-radius: 0;

  width: 12vw;
  height: 12vw;
  background-color: #000;
  color: aliceblue;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); */
  outline: none;
  border: none;
}

.cards hr {
  width: 1px;
  height: 5rem;
  background-color: #1a1a1a;
  border: none;
  outline: none;
  margin: 0 1rem;
}

.card h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
}

.card h4 {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

@media (max-width: 768px) {
  .cards {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .card {
    margin: 1rem 0;
  }
}

@media (max-width: 768px) {
  .title h1 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .title h2 {
    font-size: 1rem;
  }
}

.bg1 {
  background: url("../../assets/school/dashboard-1.jpg");
  background-size: cover;
}

.bg2 {
  background: url("../../assets/school/dashboard-2.jpg");
  background-size: cover;
}

.bg3 {
  background: url("../../assets/school/dashboard-3.jpg");
  background-size: cover;
}

.bg4 {
  background: url("../../assets/school/dashboard-4.jpg");
  background-size: cover;
}

.bg5 {
  background: url("../../assets/school/dashboard-5.jpg");
  background-size: cover;
}

.bg6 {
  background: url("../../assets/school/dashboard-6.jpg");
  background-size: cover;
}

.bg7 {
  background: url("../../assets/school/dashboard-7.jpg");
  background-size: cover;
}
</style>
