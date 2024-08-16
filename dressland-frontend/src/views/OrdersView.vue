<template>
  <div class="ordersmain">
    <!-- {{ orders }} -->
    <div class="loading" v-if="loading">
      <div class="newtons-cradle">
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
      </div>
    </div>
    <div class="noorders" v-if="orders.length == 0">
      <div class="title">No Orders</div>
      <div class="subtitle">You have no orders yet</div>
      <div class="button">
        <router-link to="/dashboard">Shop Now</router-link>
      </div>
    </div>
    <div class="order" v-for="(order, index) in orders" :key="order.id">
      <div class="overview">
        <div class="status" :class="statusclass(order.status)">
          <div class="title">Status</div>
          <div class="value" @click="refreshorder(order.id)">
            {{ order.status }}
            <span
              v-if="statusclass(order.status) == 'red'"
              class="material-symbols-outlined"
            >
              refresh
            </span>
          </div>
        </div>
        <div class="title">
          Order ID: {{ order.paymentId }} <br />
          <div class="invoice" @click="printinvoice(index)">print invoice</div>
        </div>
        <div class="date">Date: {{ dateformat(order.createdAt) }}</div>
        <div class="price">
          <div class="title">Total Price</div>
          <div class="value">₹ {{ order.totalPrice }}</div>
        </div>
        <div class="more" @click="viewmore(index)" v-if="!more(index)">
          <div class="title">More</div>
          <div class="value">
            <i class="bx bx-chevron-down"></i>
          </div>
        </div>
        <div class="less" @click="viewless(index)" v-if="more(index)">
          <div class="title">Less</div>
          <div class="value">
            <i class="bx bx-chevron-up"></i>
          </div>
        </div>
      </div>
      <div class="items" v-if="more(index)">
        <!-- <div class="title">Items</div> -->
        <div class="item" v-for="item in order.orderItems" :key="item.id">
          <div class="image">
            <img
              :src="
                'http://localhost:3000/image/' +
                item.productImage + '?width=200'
              "
              alt=""
            />
          </div>
          <div class="details">
            <div class="name">{{ item.productName }}</div>
            <div class="price">₹ {{ item.Price }}</div>
            <div class="quantity">Quantity: {{ item.quantity }}</div>
            <div class="size">Size: {{ item.productSize }}</div>
          </div>
          <div class="totalprice">
            <div class="title">Total Price</div>
            <div class="value">₹ {{ item.totalPrice }}</div>
          </div>
          <div class="actions" v-if="order.status == 'Delivered'">
            <div class="title">Actions</div>
            <div class="value">
              <button>Exchange</button>
              <button>Return</button>
              <!-- <button>Alter</button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ToWords } from "to-words";
import jsPDF from "jspdf";
export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      viewmoreindexes: [],
      loading: false,
    };
  },
  created() {
    this.getOrders();
  },
  computed: {
    more() {
      return (index) => {
        return this.viewmoreindexes.includes(index);
      };
    },
    statusclass() {
      return (status) => {
        if (
          status === "Pending" ||
          status === "Failed" ||
          status === "unpaid"
        ) {
          return "red";
        } else {
          return "green";
        }
      };
    },
  },
  methods: {
    getOrders() {
      this.axios
        .get("http://localhost:3000/user/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.orders = res.data.reverse();
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    dateformat(date) {
      return new Date(date).toLocaleDateString();
    },
    viewmore(index) {
      this.viewmoreindexes.push(index);
    },
    viewless(index) {
      this.viewmoreindexes.splice(this.viewmoreindexes.indexOf(index), 1);
    },
    async refreshorder(orderid) {
      // if status is not Pending
      if (
        this.orders.find((order) => order.id === orderid).status !== "Pending"
      ) {
        return;
      }

      this.loading = true;

      await this.axios
        .get("http://localhost:3000/user/refreshorder/" + orderid, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
        })
        .catch((err) => {
          // console.log(err);
        });

      this.getOrders();
      this.loading = false;
    },
    async printinvoice(index) {
      let order = await this.orders[index];

      // create pdf
      let doc = new jsPDF("p", "pt", "a4");

      // set font to Gotham
      doc.addFileToVFS("../GothamRegular.otf", this.Gotham);
      doc.addFont("../GothamRegular.otf", "Gotham", "normal");

      // add background image to pdf full page as background
      doc.addImage("../Invoice-Format.png", "PNG", 0, 0, 595.28, 841.89);

      // order details
      // order id at top left corner
      doc.setFontSize(12);
      // doc.text(order.paymentId, 80, 40);
      // doc.text(this.dateformat(order.createdAt), 60, 60);

      doc.setFontSize(16);
      doc.text(order.paymentId, 75, 33);
      doc.setFontSize(12);
      doc.text(order.status, 100, 56);

      // doc.setFontSize(14);
      console.log(order);
      // doc.text(order.user.school.name, 60, 80);

      doc.setFontSize(14);
      doc.text(order.name, 87, 149);
      // doc.text(order.city + ", " + order.pincode, 100, 195);
      let address = order.address + ", " + order.city + ", " + order.pincode;
      // doc.text(order.address, 100, 173);
      // first 40 characters of address till last space
      doc.setFontSize(12);
      doc.text(address.substring(0, address.lastIndexOf(" ", 45)), 100, 173);
      // remaining characters of address
      doc.text(address.substring(address.lastIndexOf(" ", 45)), 100, 193);
      doc.setFontSize(14);
      doc.text(this.$store.state.user.phone + ", " + order.mobile, 100, 220);
      doc.text(this.dateformat(order.createdAt), 463, 219);

      // order items as table

      // order.orderItems = order.orderItems.concat(order.orderItems);
      // order.orderItems = order.orderItems.concat(order.orderItems);
      // order.orderItems = order.orderItems.concat(order.orderItems);
      let total = 0;
      order.orderItems.forEach((item, index) => {
        doc.setFontSize(12);
        doc.text(index + 1 + ". ", 51, 310 + index * 20);
        // trim product name if length is greater than 40 characters and add ... at the end
        if (item.productName.length > 40) {
          doc.text(
            item.productName.substring(0, 35) + "...",
            92,
            310 + index * 20
          );
        } else {
          doc.text(item.productName, 92, 310 + index * 20);
        }

        doc.text(item.Price, 300, 310 + index * 20);
        console.log(item.quantity);
        // doc.text(item.quantity, 400, 240 + index * 20);
        // to string
        doc.text(item.quantity.toString(), 378, 310 + index * 20);
        doc.text(item.productSize, 450, 310 + index * 20);
        doc.text(item.totalPrice, 490, 310 + index * 20);
        total += Number(item.totalPrice);
      });

      // add shipping charges after order items table if shipping charges is greater than 0 else not
      // shipping charges = 50

      // shipping charges
      if (total < order.totalPrice) {
        doc.setFontSize(12);
        doc.text("Shipping Charges", 92, 310 + order.orderItems.length * 20);
        doc.text(
          (Number(order.totalPrice) - total).toString(),
          490,
          310 + order.orderItems.length * 20
        );
      }

      // total price at bottom right corner
      // order.totalPrice is inclusive of 5% gst 2.5% cgst and 2.5% sgst so need to calculate it and have to substrat it from total price

      // example 100 is total price
      // then cgst = 2.38 and sgst = 2.38
      // so totalwithougst = 100 - 2.38 - 2.38 = 95.24

      // total price without gst
      let totalwithoutgst = order.totalPrice - order.totalPrice * 0.05;

      // cgst
      let cgst = totalwithoutgst * 0.025;

      // sgst
      let sgst = totalwithoutgst * 0.025;

      totalwithoutgst = order.totalPrice - cgst - sgst;

      doc.setFontSize(14);
      // always at bottom right corner
      // doc.text("Total", 500, 700);
      doc.text(totalwithoutgst.toFixed(2), 500, 686);

      // doc.text("CGST 2.5%", 500, 720);
      doc.text(cgst.toFixed(2), 500, 707);

      // doc.text("SGST 2.5%", 500, 740);
      doc.text(sgst.toFixed(2), 500, 729);

      // bold
      doc.setFont("Gotham", "bold");

      // doc.text("Net Total", 500, 760);
      // doc.text(order.totalPrice + "/-", 500, 760);
      // , after each 3 digits from right and /- at the end
      doc.text(
        Number(order.totalPrice)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/-",
        500,
        754
      );

      // total price in words
      doc.setFontSize(12);
      doc.setFont("Gotham", "normal");

      const toWords = new ToWords({
        localeCode: "en-IN",
        converterOptions: {
          currency: true,
          ignoreDecimal: false,
          ignoreZeroCurrency: false,
        },
      });

      // doc.text(toWords.convert(order.totalPrice), 60, 700);
      doc.text(toWords.convert(Number(order.totalPrice).toFixed(2)), 75, 707);

      // save pdf

      doc.save("invoice-" + order.paymentId + ".pdf");

      // download pdf

      // doc.output("dataurlnewwindow");
    },
  },
};
</script>

<style scoped>
.ordersmain {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 10%;
}

.noorders {
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 10%;
  font-size: 3rem;
}

.order {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.overview {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.status {
  width: fit-content;
  height: 50px;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 1rem;
  position: relative;
  top: -60px;
  left: -10px;
  transform: translate(0, 50%);
  z-index: 1;
}

.invoice {
  color: #001eff;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: underline;
  margin-bottom: 10px;
  cursor: pointer;
}
.status .title {
  font-size: 12px;
  font-weight: 500;
  color: #777;
  margin: 0;
}

.status .value {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.status.red {
  background-color: #ffcccc;
  cursor: pointer;
}

.status.green {
  background-color: #ccffcc;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.date {
  font-size: 12px;
  font-weight: 500;
  color: #777;
}

.price {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.more,
.less {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.5s ease-in-out;
}

.more:hover,
.less:hover {
  cursor: pointer;
}

@keyframes ripple {
  0% {
    background: none;
  }
  100% {
    background: radial-gradient(circle, #ccffcc 0%, #fff 100%);
  }
}

.more .title,
.less .title {
  font-size: 12px;
  font-weight: 500;
  color: #777;
}

.more .value,
.less .value {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.items {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 5%;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.item .image {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.item .image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item .details {
  width: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-left: 10px;
}

.item .details .name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.item .details .price {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.item .details .quantity {
  font-size: 12px;
  font-weight: 500;
  color: #777;
}

.item .details .size {
  font-size: 12px;
  font-weight: 500;
  color: #777;
}

.item .totalprice {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.item .totalprice .title {
  font-size: 12px;
  font-weight: 500;
  color: #777;
}

.item .totalprice .value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  width: 100%;
  text-align: center;
  margin-top: 5px;
  /* all text should be in 1 line */
  white-space: nowrap;
}

.item .actions {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
}

.item .actions .title {
  font-size: 1rem;
  font-weight: 500;
  color: #777;
  margin-bottom: 1rem;
}

.item .actions .value {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.item .actions .value button {
  border-radius: 0.5rem;
  border: none;
  background-color: #ccc;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  padding: 0 10px;
  margin: 0 10px;
  transition: all 0.5s ease-in-out;
}

.item .actions .value button:hover {
  cursor: pointer;
  background-color: #333;
}

@media (max-width: 768px) {
  .ordersmain {
    padding: 2%;
  }
  .order {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    margin-bottom: 10px;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .overview {
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    padding: 0;
  }

  .status {
    margin-bottom: 10px;
    position: unset;
    transform: unset;
    width: 100%;
  }

  .title {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    padding: 0 10px;
  }

  .date {
    font-size: 0.8rem;
    font-weight: 500;
    color: #777;
    padding: 0 10px;
  }

  .price {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    padding: 0 10px;
  }

  .price .title {
    font-size: 0.8rem;
    font-weight: 500;
    color: #777;
    padding: 0 10px 0 0;
  }

  .price .value {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }

  .more,
  .less {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: unset;
  }
}
</style>
