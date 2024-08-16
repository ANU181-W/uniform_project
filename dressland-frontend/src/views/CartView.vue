<template>
  <div class="cartmain">
    <div class="loading" v-if="loading">
      <div class="newtons-cradle">
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
      </div>
    </div>
    <div v-if="cart.products != 0" class="cart-left">
      <div class="items">
        <div class="item" v-for="item in cart.products" :key="item.id">
          <div class="image">
            <img
              :src="'http://localhost:3000/image/' + item.image + '?width=200'"
              alt=""
            />
          </div>
          <div class="info">
            <div>
              <div class="name">
                {{ item.name }} <span>(Size: {{ item.size }})</span>
              </div>
            </div>
            <div class="details">
              <div class="det">Price: {{ item.price }}</div>
              <div class="det fbox">
                <div class="counter">
                  <button class="minus" @click="changequantity(-1, item)">
                    -
                  </button>
                  <!-- dont allow direct edit -->
                  <input type="number" v-model="item.quantity" disabled />
                  <button class="plus" @click="changequantity(1, item)">
                    +
                  </button>
                </div>
              </div>
              <!-- <div class="det">Quantity: {{ item.quantity }}</div> -->
              <div class="det">
                Total: {{ item.price * item.quantity.toFixed(2) }}
              </div>
            </div>
            <div class="actions">
              <button @click="removeitem(item.id)">X</button>
            </div>
          </div>
        </div>

        <!-- <hr /> -->
      </div>

      <!-- {{ cart }} -->
      <!-- {{ $store.state.user.addresses[0].address }} -->
    </div>
    <div class="empty" v-else>
      <div class="emptycart">
        <div class="title">Your cart is empty</div>
        <div class="subtitle">Add items to it.</div>
      </div>
    </div>
    <div
      class="summary"
      v-if="$store.state.user.addresses && cart.products != 0"
    >
      <div class="addressmain">
        <div class="title">Shiping Address</div>

        <!-- <hr /> -->
        <div class="address">
          <div
            class="add"
            v-if="$store.state.user.school.schoolDelivery"
            :class="addchoosed('s')"
            @click="address = 's'"
          >
            <div class="name">School: {{ $store.state.user.school.name }}</div>
            <div class="address">
              {{ $store.state.user.school.address }}
            </div>
          </div>

          <!-- <hr /> -->
          <div
            class="add"
            :class="addchoosed('h')"
            @click="address = 'h'"
            v-if="
              $store.state.user.addresses &&
              $store.state.user.school.homeDelivery
            "
          >
            <div class="name" v-if="$store.state.user.addresses[0].name">
              {{ $store.state.user.addresses[0].name }}
            </div>
            <div class="address">
              {{ $store.state.user.addresses[0].address }}
            </div>
            <div class="city">{{ $store.state.user.addresses[0].city }}</div>
            <div class="state">{{ $store.state.user.addresses[0].state }}</div>
            <div class="zip">{{ $store.state.user.addresses[0].pincode }}</div>
          </div>
        </div>

        <!-- <hr /> -->
      </div>
      <div class="title">Deliver After</div>
      <div class="input">
        <input type="date" v-model="diliverAfter" />
      </div>
      <div class="title">Order Summary</div>
      <div class="subtotal">
        <div class="label">Subtotal</div>
        <div class="value">{{ cart.total }}</div>
      </div>
      <div class="shipping">
        <div class="label">Shipping</div>
        <div class="value">{{ address == "h" ? 80 : 0 }}</div>
      </div>
      <div class="total">
        <div class="label">Total</div>
        <div class="value">
          {{ address == "h" ? cart.total + 80 : cart.total }}
        </div>
      </div>

      <div class="terms">
        <input type="checkbox" v-model="checkbox" />
        <div class="text">
          I agree to the
          <router-link to="/privacy-policy">
            Terms of Service & Privacy Policy</router-link
          >
        </div>
      </div>

      <div class="checkout">
        <small>Convinence charge will be added at checkout</small>
        <button @click="checkout" disabled>Checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cart",
  data() {
    return {
      address: "",
      cart: [],
      loading: false,
      diliverAfter: null,
      checkbox: false,
    };
  },
  created() {
    this.getcart();
    this.$store.dispatch("getuser");
    this.diliverAfter = new Date().toISOString().slice(0, 10);
  },
  watch: {
    checkbox(val) {
      if (val) {
        document.querySelector(".checkout button").disabled = false;
      } else {
        document.querySelector(".checkout button").disabled = true;
      }
    },
  },
  methods: {
    async getcart() {
      const response = await this.axios
        .get("http://localhost:3000/user/cart", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          // console.log("data=>" + res.data);
          this.cart = res.data;
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    addchoosed(add) {
      if (this.address == add) {
        return "choosed";
      }
    },
    async changequantity(val, item) {
      // confirm if quantity is 0 then remove item
      if (item.quantity + val <= 0) {
        const confirm = window.confirm(
          "Are you sure you want to remove this item?"
        );
        if (!confirm) {
          return;
        }
      }

      const response = await this.axios
        .put(
          "http://localhost:3000/user/changequantity/" + item.id,
          {
            quantity: val,
          },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          if (res.data.status == "fail") {
            alert(res.data.message);
          }

          this.getcart();
        });

      this.loading = false;
    },
    async removeitem(id) {
      const response = await this.axios
        .delete("http://localhost:3000/user/cart/" + id, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.getcart();
        });
    },

    async checkout() {
      let order = null;
      this.loading = true;
      if (this.address === "") {
        alert("Please click on address to confirm delivery address");
        this.loading = false;
        return;
      }

      if (
        this.address === "h" &&
        this.$store.state.user.addresses[0].address == "not set"
      ) {
        this.loading = false;
        alert("Please set your home address under profile section");
        this.$router.push("/profile");
        return;
      }

      try {
        const response = await this.axios.post(
          "http://localhost:3000/user/placeorder/" + this.address,
          {
            address: this.address,
            deliverAfter: this.deliverAfter,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        order = response.data;
        console.log(order);
        // Redirect to Razorpay payment page
        const rzpOptions = {
          key: "rzp_test_lH4PNUpbT9H7u7",
          amount: order.amount, // Amount in paise
          currency: "INR",
          order_id: order.orderId,
          name: "Your Company Name",
          description: "Test Transaction",
          image: "https://yourcompany.com/logo.png", // URL of your company logo
          handler: (response) => {
            // Handle Razorpay success callback
            const paymentid = response.razorpay_payment_id;
            const orderid = response.razorpay_order_id;
            this.sendpaymentid(orderid, paymentid);
            this.paymentStatus(orderid);
            console.log("razorpay payment id:", response);
            alert("Payment successful!");
          },
          prefill: {
            name: order.buyer_name,
            email: order.email,
            contact: order.phone,
          },
          notes: {
            address: order.address,
          },
          theme: {
            color: "#F37254",
          },
        };
        const rzp = new Razorpay(rzpOptions);
        rzp.open();
      } catch (error) {
        // Handle error
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred while processing your request.");
        }
      }
      //get payment id

      this.loading = false;
    },

    async sendpaymentid(orderid, paymentid) {
      const response = await this.axios
        .post(
          "http://localhost:3000/user/paymentid",
          {
            orderId: orderid,
            paymentId: paymentid,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async paymentStatus(orderid) {
      const response = await this.axios
        .post(
          "http://localhost:3000/user/payment-status",
          {
            orderId: orderid,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          // console.log(response.data);
          console.log(res.body);
        });

      console.log(response);
    },
  },
};
</script>

<style scoped>
.counter {
  display: flex;
  align-items: center;
}

.counter button {
  background-color: #ce5a5a;
  border-radius: 5px;
  border: none;
  color: #000000;
  font-weight: bold;
  font-size: 16px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.counter button:hover {
  background-color: #ddd;
}

.counter input {
  color: black;
  width: 50px; /* Adjust width as needed */
  text-align: center;
  font-size: 1rem;
  font-weight: bolder;
  padding: 8px;
  margin: 0 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
}

.summary hr {
  margin: 0px;
}
.actions button {
  background-color: rgb(250, 90, 90);
  padding: 0.3rem 2rem;
  font-size: 1rem;
  font-weight: bolder;
  border-radius: 10px;
}
.actions button:hover {
  background-color: red;
}
.name {
  text-transform: capitalize;
}
.details {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.items {
  border: 1px solid black;
  width: 100%;
  border-radius: 30px;
  padding: 1rem;
}
.cart-left {
  width: 100%;
  max-height: 100%;
  margin: 1rem;
}
.image img {
  margin-right: 1rem;
  height: 100px;
  border-radius: 10px;
}
.info {
  font-weight: 700;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
}
.item {
  display: flex;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* background-color: #ffffff39; */
  z-index: 100;
  /* background blur */
  backdrop-filter: blur(5px);
}

.loading .loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #f16028;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite;
  /* Safari */
  animation: spin 2s linear infinite;
}

.loading .loader .circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #f16028;
  opacity: 0.5;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.cartmain {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  min-height: 90vh;
  padding: 1rem;
}

/* scroll */
::-webkit-scrollbar {
  width: 5px;
  margin-left: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f16028;
  border-radius: 5px;
}

.summary {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f161282d;
}

.label {
  font-size: 1rem;
  font-weight: 600;
}

.subtotal {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.subtotal .label {
  width: 50%;
  height: 100%;
}

.subtotal .value {
  width: 50%;
  height: 100%;
}

.shipping {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: #f16028 solid 1px;
  margin-bottom: 0.5rem;
}

.shipping .label {
  width: 50%;
  height: 100%;
}

.shipping .value {
  width: 50%;
  height: 100%;
}

.total {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.total .label {
  width: 50%;
  height: 100%;
}

.total .value {
  width: 50%;
  height: 100%;
}

.addressmain {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.addressmain .add {
  margin-bottom: 1rem;
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #f16028;
  transition: background-color 0.3s ease;
  background-color: #fff;
}

.addressmain .add .name {
  font-size: 1.2rem;
  font-weight: 600;
}

.addressmain .add .address {
  font-size: 1rem;
  font-weight: 300;
}

.input {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* date */
.input input[type="date"] {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem;
  border: 1px solid #f16028;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: #f16028;
}

/* date icon */
.input input[type="date"]::-webkit-calendar-picker-indicator {
  color: #f16028;
  font-size: 1.5rem;
  font-weight: 600;
  /* border: 1px solid #f16028;
  border-radius: 0.5rem; */
  color: #f16028;
}

.add.choosed {
  background-color: #f16028;
  color: white;
}

.checkout {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.checkout small {
  font-size: 0.8rem;
  font-weight: 300;
  color: #740707;
}

.checkout button {
  width: 70%;
  border: none;
  border-radius: 0.5rem;
  /* background-color: #07746fd9; */
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0.7rem;
  margin-top: 1rem;
}

.checkout button:hover {
  background-color: #f16028;
  outline: rgba(255, 255, 255, 0.655) solid 1px;
}

/* disabled */
.checkout button:disabled {
  background-color: #07746f22;
  color: #07746f22;
  outline: #07746f7b solid 1px;
  cursor: not-allowed;
}

.terms {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.terms input {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.terms .text {
  font-size: 0.8rem;
  font-weight: 300;
  margin: 0.5rem 0;
}

.terms text a {
  color: #f16028;
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty title {
  font-size: 1.5rem;
  font-weight: 600;
}

.empty .subtitle {
  font-size: 1rem;
  font-weight: 300;
}

@media screen and (max-width: 768px) {
  .cartmain {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .items {
    border: 1px solid black;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .cartmain .item {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
  }

  .cartmain .item .image {
    width: 30%;
    max-height: 5rem;
  }

  .cartmain .item .image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .cartmain .item .name .name {
    font-size: 1rem;
    font-weight: 600;
  }

  .cartmain .item .name .name span {
    font-size: 0.8rem;
    font-weight: 300;
  }

  .cartmain .item .details {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-left: 0;
  }

  .cartmain .item .details .det {
    font-size: 1rem;
    font-weight: 300;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;

    margin-left: 0rem;
  }

  .cartmain .item .details .fbox {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .cartmain .item .details .det .counter {
    margin-left: 1rem;
  }

  .summary {
    width: 100%;
  }
}
</style>
