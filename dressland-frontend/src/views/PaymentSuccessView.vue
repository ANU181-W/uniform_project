<template>
  <div class="paymentmain">
    <div class="title">Payment Status</div>
    <div class="timer">
      Redirecting to home page, don't close this page or refresh the page
      <!-- Redirecting to home page in <span id="timer">{{ time }}</span> seconds -->
    </div>
    <div
      class="success"
      v-if="payment_status == 'Credit' || payment_status == 'credit'"
    >
      <!-- ?payment_id=MOJO3606A05A67293028
            &payment_status=Credit
            &payment_request_id=1fe0afe1bdf64cfaba11811d881a895c -->
      <div class="icon">
        <i class="bx bx-badge-check"></i>
      </div>
      <div class="message">Payment Success</div>
      <div class="details">
        <div class="det">Payment ID: {{ payment_id }}</div>
        <div class="det">Payment Request ID: {{ payment_request_id }}</div>
      </div>
    </div>
    <div
      class="failed"
      v-else-if="payment_status == 'Failed' || payment_status == 'failed'"
    >
      <div class="icon">
        <i class="bx bx-error"></i>
      </div>
      <div class="message">Payment Failed</div>
      <div class="details">
        <div class="det">Payment ID: {{ payment_id }}</div>
        <div class="det">Payment Request ID: {{ payment_request_id }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaymentSuccess",
  data() {
    return {
      payment_id: "",
      payment_status: "",
      payment_request_id: "",
      time: 15,
    };
  },
  created() {
    this.payment_id = this.$route.query.payment_id;
    this.payment_status = this.$route.query.payment_status;
    this.payment_request_id = this.$route.query.payment_request_id;

    if (!this.$route.query.payment_id) {
      this.$router.push({ path: "/cart" });
      return;
    }
    // remove query params from url
    this.$router.replace({ path: "/payment" });

    this.sendPaymentStatus();
    this.timer();
  },
  methods: {
    async sendPaymentStatus() {
      // wait for 7 seconds
      await new Promise((resolve) => setTimeout(resolve, 7000));
      await this.axios
        .post("http://localhost:3000/api/payment-status", {
          payment_id: this.payment_id,
          payment_status: this.payment_status,
          payment_request_id: this.payment_request_id,
        })
        .then((res) => {
          // console.log(res.data);
        })
        .catch((err) => {
          // console.log(err);
        });

      //   redirect to home page after 15secends
      setTimeout(() => {
        this.$router.push({ path: "/orders" });
      }, 15000);
    },
    timer() {
      setInterval(() => {
        this.time--;
      }, 1000);
    },
  },
};
</script>

<style scoped>
.paymentmain {
  width: 100%;
  height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0 1rem;
}

.success {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #d4edda;
  border-radius: 0.5rem;
  padding: 1rem;
}

.success .icon {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.success .icon i {
  font-size: 5rem;
  color: #155724;
}

.success .message {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #155724;
}

.success .details {
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.success .details .det {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
}

.failed {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8d7da;
  border-radius: 0.5rem;
  padding: 1rem;
}

.failed .icon {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.failed .icon i {
  font-size: 5rem;
  color: #721c24;
}

.failed .message {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #721c24;
}

.failed .details {
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.failed .details .det {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
}
</style>
