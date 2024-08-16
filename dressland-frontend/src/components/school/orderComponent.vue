<template>
  <div class="ordersmain">
    <div class="titlemain">Orders</div>
    <div class="search">
      <input type="text" placeholder="Search" v-model="search" />
      <i class="bx bx-search"></i>

      <!-- export in csv button for order -->
      <div class="export">
        <input type="date" placeholder="Date" v-model="date" />
        <select name="status" id="status" v-model="selstatusforcsv">
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <button @click="exportCSV">Export in CSV</button>
      </div>
    </div>
    <!-- {{ orders }} -->
    <div class="order" v-for="(order, index) in filteredorders" :key="order.id">
      <div class="overview">
        <div class="status" :class="statusclass(order.status)">
          <!-- <div class="title">Status</div> -->
          <div class="value">{{ order.status }}</div>
        </div>

        <div class="title">
          Order ID: {{ order.paymentId }}
          <br />
          <div class="invoice" @click="printinvoice(index)">print invoice</div>
        </div>
        <div class="date">Date: {{ dateformat(order.createdAt) }}</div>
        <div class="price">
          <div class="title">Total Price</div>
          <div class="value">₹ {{ order.totalPrice }}</div>
        </div>
        <!-- <div class="changestatus">
          <div class="title">Change Status</div>
          <div class="value">
            <select v-model="order.status" @change="updatestatus(order.id)">
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
              <option value="unpaid">unpaid</option>
            </select>
          </div>
        </div> -->
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
        <div class="address">
          <div class="title">Address</div>
          <div class="value">
            {{ order.name }}, {{ order.address }}, {{ order.city }},
            {{ order.address.pincode }}, Phone: {{ order.user.phone }} /
            {{ order.mobile }}
          </div>
        </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ToWords } from "to-words";
import jsPDF from "jspdf";
export default {
  name: "SchoolOrders",
  data() {
    return {
      orders: [],
      viewmoreindexes: [],
      search: "",
      date: "",
      statuses: [],
      selstatusforcsv: "",
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

    filteredorders() {
      return this.orders.filter((order) => {
        return (
          order.paymentId.toLowerCase().includes(this.search.toLowerCase()) ||
          order.status.toLowerCase().includes(this.search.toLowerCase()) ||
          order.name.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },
  methods: {
    exportCSV() {
      // orders of date
      let orders = this.orders.filter((order) => {
        return (
          order.createdAt.includes(this.date) &&
          order.status === this.selstatusforcsv
        );
      });
      // console.log(orders);
      let csv =
        "Order ID, Date, Name, Address, City, Pincode, Phone, Mobile, Status, Total Price, Product Name, Product Price, Product Quantity, Product Size, Product Total Price\n";
      orders.forEach((order) => {
        // exluding , from address other character similar to , can be added
        order.address = order.address.replace(/,/g, " ");
        csv += `${order.paymentId}, ${this.dateformat(order.createdAt)}, ${
          order.name
        }, ${order.address}, ${order.city}, ${order.pincode}, ${
          order.user.phone
        }  /  ${order.mobile}, ${order.mobile}, ${order.status}, ${
          order.totalPrice
        }\n`;
        order.orderItems.forEach((item) => {
          //   csv += `, ${item.productName}, ${item.productImage}, ${item.Price}, ${item.quantity}, ${item.productSize}, ${item.totalPrice}\n`;
          // SKIP 10 COLOUMNS IF 2nd orderitem
          csv += `,,,,,,,,,, ${item.productName}, ${item.Price}, ${item.quantity}, ${item.productSize}, ${item.totalPrice}\n`;
        });
      });
      let csvData = new Blob([csv], { type: "text/csv" });
      let csvUrl = URL.createObjectURL(csvData);
      let hiddenElement = document.createElement("a");
      hiddenElement.href = csvUrl;
      hiddenElement.target = "_blank";
      hiddenElement.download = "orders - " + this.date + ".csv";
      hiddenElement.click();
    },

    getOrders() {
      this.axios
        .get("http://localhost:3000/school/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.orders = res.data.reverse();
          // fill statusess array
          this.orders.forEach((order) => {
            if (!this.statuses.includes(order.status)) {
              this.statuses.push(order.status);
            }
          });
          this.selstatusforcsv = this.statuses[0];
          //   only first 2 orders
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

    async updatestatus(id) {
      await this.axios
        .post(
          "http://localhost:3000/superuser/orderstatus/",
          {
            status: this.orders.find((order) => order.id === id).status,
            id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          this.getOrders();
        })
        .catch((err) => {
          // console.log(err);
        });
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
      doc.text(order.user.phone + ", " + order.mobile, 100, 220);
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
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 3%;
  max-height: 90vh;
  overflow-y: scroll;
}

.ordersmain::-webkit-scrollbar {
  width: 0.5rem;
}

.titlemain {
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.search {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.search input {
  width: 40%;
  height: 40px;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 5px;
  outline: none;
  margin-right: 20px;
}

.export {
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.export input {
  width: 200px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 5px;
  outline: none;
  margin-right: 20px;
}

.export button {
  height: 40px;
  border: none;
  border-radius: 0.5rem;
  background: #333;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
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
  background: #fff;
}

.overview {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.status {
  width: 100px;
  height: 50px;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  position: relative;
  top: -60px;
  left: -10px;
  transform: translate(0, 50%);
}

.status .title {
  font-size: 12px;
  font-weight: 500;
  color: #777;
}

.status .value {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.status.red {
  background-color: #ffcccc;
}

.status.green {
  background-color: #ccffcc;
}

.invoice {
  color: blue;
  cursor: pointer;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.date {
  font-size: 1rem;
  font-weight: 500;
  color: #777;
  margin: 1rem 2rem;
}

.price {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  min-width: 5rem;
  margin: 0.5 1rem;
}

.invoice {
  /* as a button */
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #777;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  margin: 10px;
}

.invoice:hover {
  background-color: #eee;
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

.changestatus {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  margin: 10px;
}

.changestatus:hover {
  background-color: #eee;
}

.changestatus .title {
  font-size: 12px;
  font-weight: 500;
  color: #777;
}

.changestatus select {
  width: 100px;
  height: 30px;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #777;
  outline: none;
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
  object-fit: contain;
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
  width: 100px;
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
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .overview {
    flex-direction: column;
  }

  .status {
    margin-bottom: 10px;
  }

  .more,
  .less {
    margin-top: 10px;
  }
}
</style>
