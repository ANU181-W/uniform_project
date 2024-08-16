<template>
  <div class="ordersmain">
    <div class="loading" v-if="loading">
      <div class="newtons-cradle">
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
      </div>
    </div>
    <div class="titlemain">Orders</div>
    <div class="search">
      <!-- on enter press -->
      <input
        type="text"
        placeholder="Search"
        v-model="search"
        @keyup.enter="filteredorders"
      />
      <!-- <input type="text" placeholder="Search" v-model="search"  /> -->
      <i class="bx bx-search"></i>

      <!-- export in csv button for order -->
      <div class="export">
        <select
          name="status"
          id="status"
          @change="filteredorders"
          v-model="search"
        >
          <option value="">Select School</option>
          <option v-for="status in schools" :key="status" :value="status.name">
            {{ status.name }}
          </option>
        </select>
        <input type="date" placeholder="Date" v-model="date" />
        <input type="date" placeholder="Date" v-model="toDate" />
        <select name="status" id="status" v-model="selstatusforcsv">
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <button @click="exportCSV">Export in CSV</button>
      </div>
    </div>
    <!-- {{ orders }} -->
    <div
      class="order"
      v-for="(order, index) in paginationOrders"
      :key="order.id"
    >
      <div class="overview">
        <div class="status" :class="statusclass(order.status)">
          <!-- <div class="title">Status</div> -->
          <div class="value">
            {{ order.status }}

            <span v-if="order.shipped"> | shipped </span>
          </div>
        </div>

        <!-- 
          print invoice button for order
          this button will print the invoice of the order
          order.paymentId is the id of the order
          order.name is the name of the user who placed the order
          order.email is the email of the user who placed the order
          order.totalPrice is the total price of the order
          order.createdAt is the date of the order
          order.address is the address of the user who placed the order
          order.city is the city of the user who placed the order
          order.address.pincode is the pincode of the user who placed the order
          order.user.phone is the phone number of the user who placed the order
          order.mobile is the mobile number of the user who placed the order
          order.orderItems is the array of items in the order should be displayed in the invoice in list
         -->
        <div class="invoice" @click="printinvoiceWithJsPdf(index)">
          print invoice
        </div>

        <div class="title">
          Order ID: {{ order.paymentId }} <br />
          <span
            >Deliver after: {{ dateformat(order.deliverAfter) }}
            <!-- <button class="deliver">click to deliver</button> -->
          </span>
          <button
            v-if="!order.shipped && order.status == 'Credit'"
            @click="newShipped(order.paymentId)"
            style="width: fit-content; padding: 0 1rem; margin: 0"
          >
            Click if shipped
          </button>
        </div>
        <div class="date">Date: {{ dateformat(order.createdAt) }}</div>
        <div class="price">
          <div class="title">Total Price</div>
          <div class="value">₹ {{ order.totalPrice }}</div>
        </div>
        <div class="changestatus">
          <div class="title">Change Status</div>
          <div class="value">
            <select v-model="order.status" @change="updatestatus(order.id)">
              <option value="Pending">Pending</option>
              <option value="Credit">Credit</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
              <option value="unpaid">unpaid</option>
            </select>
          </div>
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
    <div class="navigation" v-if="date == '' && search == ''">
      <button
        class="prev"
        @click="
          () => {
            page--;
          }
        "
      >
        Prev
      </button>
      <span>
        {{ page }}
      </span>
      <button
        class="next"
        @click="
          () => {
            page++;
          }
        "
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import { ToWords } from "to-words";
export default {
  name: "AdminOrders",
  data() {
    return {
      orders: [],
      paginationOrders: [],
      schools: [],
      page: 1,
      viewmoreindexes: [],
      search: "",
      date: "",
      toDate: "",
      statuses: [],
      selstatusforcsv: "",
      loading: false,
    };
  },
  watch: {
    page(val, oldVal) {
      if (val < 1) {
        this.page = 1;
        if (oldVal == 1) {
          return;
        }
      }
      this.getOrdersByPagination();
      // scroll to top of the component
      let elmnt = document.getElementsByClassName("ordersmain")[0];
      elmnt.scrollIntoView();
      // set scroll to top of the element
      elmnt.scrollTop = 0;
      window.scrollTo(0, 0);
    },
    selstatusforcsv(
      val,
      oldVal // this is the old value of the property
    ) {
      console.log(val);
      console.log(oldVal);
      if (this.date) {
        this.filterForCSV();
      }
    },
    date(
      val,
      oldVal // this is the old value of the property
    ) {
      console.log(val);
      console.log(oldVal);
      this.filterForCSV();
    },

    toDate(
      val,
      oldVal // this is the old value of the property
    ) {
      console.log(val);
      console.log(oldVal);
      this.filterForCSV();
    },
  },
  created() {
    // this.getOrders();
    this.getOrdersByPagination();
    // get statuses
    this.getStatuses();
    this.getSchools();
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

    async filteredorders() {
      // console.log(this.orders.length);
      // // if (this.orders.length == 0) {
      // //   await this.getOrders();
      // //   return this.orders;
      // // }
      // console.log(this.paginationOrders);
      // return this.paginationOrders.filter((order) => {
      //   return (
      //     order.paymentId.toLowerCase().includes(this.search.toLowerCase()) ||
      //     order.status.toLowerCase().includes(this.search.toLowerCase()) ||
      //     order.name.toLowerCase().includes(this.search.toLowerCase())
      //   );
      // });

      this.loading = true;

      if (this.date) {
        await this.filterForCSV();
        return;
      }

      await this.axios
        .get("http://localhost:3000/superuser/searchorders", {
          params: {
            search: this.search,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.paginationOrders = res.data;
          this.loading = false;
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  methods: {
    async getSchools() {
      const res = await this.axios
        .get("http://localhost:3000/superuser/schools", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.schools = res.data;
        });
    },
    async getStatuses() {
      await this.axios
        .get("http://localhost:3000/superuser/statuses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.statuses = res.data;
          this.selstatusforcsv = "Credit";
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async filterForCSV() {
      //   @Get('filteredorders')
      // @Query('status') status: string,
      // @Query('date') date: string,

      this.loading = true;

      if (this.date == "") {
        this.loading = false;
        return;
      }

      this.toDate = this.toDate == "" ? this.date : this.toDate;

      await this.axios
        .get("http://localhost:3000/superuser/filteredorders", {
          params: {
            status: this.selstatusforcsv,
            date: this.date,
            search: this.search,
            toDate: this.toDate,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.paginationOrders = res.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async exportCSV() {
      if (this.paginationOrders.length == 0) {
        await this.getOrdersByPagination();
      }
      // orders of date
      // let orders = this.orders.filter((order) => {
      //   return (
      //     order.createdAt.includes(this.date) &&
      //     order.status === this.selstatusforcsv
      //   );
      // });
      // console.log(orders);

      let csv =
        "Order ID, Date, Diliver after, Name, Address, City, Pincode, Phone, Mobile, Status, Total Price, CGST,SGST, Total,shipping status, Product Name, Product Price, Product Quantity, Product Size, Product Total Price\n";
      this.paginationOrders.forEach((order) => {
        // total price without gst
        let totalwithoutgst = order.totalPrice - order.totalPrice * 0.05;

        // cgst
        let cgst = totalwithoutgst * 0.025;

        // sgst
        let sgst = totalwithoutgst * 0.025;

        totalwithoutgst = order.totalPrice - cgst - sgst;
        // exluding , from address other character similar to , can be added
        order.address = order.address.replace(/,/g, " ");
        csv += `${order.paymentId}, ${this.dateformat(
          order.createdAt
        )},${this.dateformat(order.deliverAfter)}, ${order.name}, ${
          order.address
        }, ${order.city}, ${order.pincode}, ${order.user.phone}  /  ${
          order.mobile
        }, ${order.mobile}, ${order.status}, ${totalwithoutgst.toFixed(
          2
        )},${cgst.toFixed(2)},${sgst.toFixed(2)}, ${order.totalPrice},${
          order.shipped != null ? "yes" : "no"
        }\n`;
        order.orderItems.forEach((item) => {
          //   csv += `, ${item.productName}, ${item.productImage}, ${item.Price}, ${item.quantity}, ${item.productSize}, ${item.totalPrice}\n`;
          // SKIP 10 COLOUMNS IF 2nd orderitem
          csv += `,,,,,,,,,,,,,,, ${item.productName}, ${item.Price}, ${item.quantity}, ${item.productSize}, ${item.totalPrice}\n`;
        });
      });
      let csvData = new Blob([csv], { type: "text/csv" });
      let csvUrl = URL.createObjectURL(csvData);
      let hiddenElement = document.createElement("a");
      hiddenElement.href = csvUrl;
      hiddenElement.target = "_blank";
      hiddenElement.download =
        "orders - " + this.date + "-" + this.toDate + ".csv";
      hiddenElement.click();
    },

    async getOrders() {
      await this.axios
        .get("http://localhost:3000/superuser/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.orders = res.data.reverse();
          //   only first 2 orders
          // this.orders = this.orders.slice(0, 4);
          // fill statusess array
          this.orders.forEach((order) => {
            if (!this.statuses.includes(order.status)) {
              this.statuses.push(order.status);
            }
          });
          // this.selstatusforcsv = this.statuses[0];
          this.selstatusforcsv = "Credit";
        })
        .catch((err) => {
          // console.log(err);
        });
    },

    async getOrdersByPagination() {
      console.log(this.page);

      this.loading = true;

      // await this.axios
      //   .get("http://localhost:3000/superuser/orders", {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   })

      // add param page

      await this.axios
        .get("http://localhost:3000/superuser/ordersbypage", {
          params: {
            page: this.page,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // this.paginationOrders.push(...res.data);
          this.paginationOrders = res.data;
          this.loading = false;
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    dateformat(date) {
      // return new Date(date).toLocaleDateString();
      // dd-mm-yyyy
      return new Date(date).toLocaleDateString("en-GB");
    },
    viewmore(index) {
      this.viewmoreindexes.push(index);
    },
    viewless(index) {
      this.viewmoreindexes.splice(this.viewmoreindexes.indexOf(index), 1);
    },

    async updatestatus(id) {
      console.log(this.orders);
      await this.axios
        .post(
          "http://localhost:3000/superuser/orderstatus/",
          {
            status: this.paginationOrders.find((order) => order.id == id)
              .status,
            id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          this.getOrders();
        })
        .catch(() => {
          // console.log(err);
        });
    },

    async printinvoiceWithJsPdf(index) {
      let order = await this.paginationOrders[index];

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
      if (order.shipped) {
        doc.text("credit | shipped", 100, 56);
      } else {
        doc.text(order.status, 100, 56);
      }

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

    async printinvoice(index) {
      let order = await this.orders[index];
      // %PDF-1.4
      // 1 0 obj <</Type /Catalog /Pages 2 0 R>>
      // endobj
      // 2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>>
      // endobj
      // 3 0 obj<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 500 800] /Contents 6 0 R>>
      // endobj
      // 4 0 obj<</Font <</F1 5 0 R>>>>
      // endobj
      // 5 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
      // endobj
      // 6 0 obj
      // <</Length 44>>
      // stream
      // BT /F1 16 Tf 50 720 Td (Hello World!)Tj ET
      // endstream
      // endobj
      // xref
      // 0 7
      // 0000000000 65535 f
      // 0000000009 00000 n
      // 0000000056 00000 n
      // 0000000111 00000 n
      // 0000000212 00000 n
      // 0000000250 00000 n
      // 0000000317 00000 n
      // trailer <</Size 7/Root 1 0 R>>
      // startxref
      // 406
      // %%EOF

      // above is hello world pdf file code need to follow same format to create pdf for invoice

      let invoice = `%PDF-1.4
      1 0 obj <</Type /Catalog /Pages 2 0 R>>
      endobj
      2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>>
      endobj
      3 0 obj<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 500 800] /Contents 6 0 R>>
      endobj
      4 0 obj<</Font <</F1 5 0 R>>>>
      endobj
      5 0 obj<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
      endobj
      6 0 obj
      <</Length 44>>
      stream
`;

      // add order details as table
      invoice += `
      BT /F1 16 Tf 260 780 Td (Dressland Uniforms`;
      invoice += `)Tj ET
      BT /F1 10 Tf 260 765 Td (1st floor, Rashmi Industrial Estate, S.no.70/A1/2/2A,
      )Tj ET
      BT /F1 10 Tf 260 755 Td (Lane, 2, Salunke Vihar Rd. Wanwadi,)
       Tj ET
      BT /F1 10 Tf 260 745 Td (Pune, Maharashtra 410040`;
      invoice += `)Tj ET
      BT /F1 10 Tf 260 735 Td (Phone No: +91-7774080207 `;
      // horizontal line of length 200
      invoice += `)Tj ET
      BT /F1 10 Tf 10 725 Td (------------------------------------------------------------------------------------------------------------------------------------------------`;

      // vertical line at 250 from 780 to 725

      invoice += `)Tj ET
      BT /F1 10 Tf 250 790 Td (|`;

      invoice += `)Tj ET
      BT /F1 10 Tf 250 785 Td (|`;

      invoice += `)Tj ET
      BT /F1 10 Tf 250 780 Td (|`;

      invoice += `)Tj ET
      BT /F1 10 Tf 250 775 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 770 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 765 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 760 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 755 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 750 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 745 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 740 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 735 Td (|`;
      invoice += `)Tj ET
      BT /F1 10 Tf 250 730 Td (|`;

      invoice += `)Tj ET
      BT /F1 10 Tf 30 780 Td (Order Status: `;
      invoice += order.status;
      invoice += `)Tj ET
      BT /F1 14 Tf 30 710 Td (Name: `;
      invoice += order.name;

      invoice += `)Tj ET
      BT /F1 10 Tf 30 765 Td (Id: `;
      invoice += order.paymentId;
      invoice += `)Tj ET
      BT /F1 10 Tf 30 750 Td (Order Date: `;
      invoice += this.dateformat(order.createdAt);

      invoice += `

      )Tj ET
      BT /F1 10 Tf 30 735 Td (Total Price: `;
      invoice += order.totalPrice;
      invoice += `)Tj ET`;

      // add order items as table
      invoice += `Tj ET
        BT /F1 10 Tf 30 690 Td (Order Address: `;

      invoice += order.address;

      invoice += ` , `;
      invoice += order.city;

      invoice += ` , `;

      invoice += `)Tj ET
        BT /F1 10 Tf 30 670 Td (Order Phone: `;

      invoice += order.user.phone;

      invoice += ` , `;
      invoice += order.mobile;

      invoice += `)Tj ET`;

      // order.orderItems.forEach((item) => {
      //   invoice += `Tj ET
      //   BT /F1 16 Tf 50 580 Td (Item Name:`;
      //   invoice += item.productName;
      //   invoice += `)Tj ET
      //   BT /F1 16 Tf 50 560 Td (Item Price:`;
      //   invoice += item.Price;
      //   invoice += `)Tj ET
      //   BT /F1 16 Tf 50 540 Td (Item Quantity:`;
      //   invoice += item.quantity;
      //   invoice += `)Tj ET
      //   BT /F1 16 Tf 50 520 Td (Item Total Price:`;
      //   invoice += item.totalPrice;
      //   invoice += `)Tj ET`;
      // });

      // with less space in left

      // make items tripls
      //
      // order.orderItems = order.orderItems.concat(order.orderItems);
      // order.orderItems = order.orderItems.concat(order.orderItems);
      // order.orderItems = order.orderItems.concat(order.orderItems);

      console.log(order.orderItems);

      order.orderItems.forEach((item, index) => {
        console.log(index);
        if (index < 12) {
          invoice += `Tj ET
        BT /F1 10 Tf 40 `;
          // 580 - 20 * index
          invoice += `${630 - 10 * index * 5}`;
          invoice += ` Td (`;
          // serial number of item
          invoice += index + 1;
          invoice += `. Item Name: `;
          // invoice += item.productName;
          // max length of product name is 30
          // item.productName =
          //   "this is a very long product name to test pdf file creation";
          invoice += item.productName.substring(0, 30);
          // add ... if product name is longer than 30
          if (item.productName.length > 30) {
            invoice += `...`;
          }
          invoice += `)Tj ET
        BT /F1 10 Tf 50 `;
          // 580 - 40 * index
          invoice += `${620 - 10 * index * 5}`;

          invoice += ` Td (Item Price: `;
          invoice += item.Price;
          invoice += `)Tj ET
        BT /F1 10 Tf 50 `;
          invoice += `${610 - 10 * index * 5}`;
          invoice += ` Td (Item Quantity: `;
          invoice += item.quantity;
          invoice += `)Tj ET
        BT /F1 10 Tf 50 `;
          invoice += `${600 - 10 * index * 5}`;

          invoice += ` Td (Item Total Price: `;
          invoice += item.totalPrice;
          invoice += `)Tj ET`;
          // add horizenal line
          invoice += `Tj ET
        BT /F1 10 Tf 50 `;
          invoice += `${590 - 10 * index * 5}`;

          invoice += ` Td (--------------------------------------------------------)Tj ET`;
        }
        // if index >= 12 then start with 275 instead of 50

        if (index >= 12) {
          invoice += `Tj ET
          BT /F1 10 Tf 275 `;
          // 580 - 20 * index
          invoice += `${630 - 10 * (index - 12) * 5}`;
          invoice += ` Td (`;
          // serial number of item
          invoice += index + 1;
          invoice += `. Item Name: `;
          // invoice += item.productName;
          invoice += item.productName.substring(0, 30);
          // add ... if product name is longer than 30
          if (item.productName.length > 30) {
            invoice += `...`;
          }
          invoice += `)Tj ET
          BT /F1 10 Tf 285 `;
          // 580 - 40 * index
          invoice += `${620 - 10 * (index - 12) * 5}`;

          invoice += ` Td (Item Price: `;
          invoice += item.Price;
          invoice += `)Tj ET
          BT /F1 10 Tf 285 `;
          invoice += `${610 - 10 * (index - 12) * 5}`;
          invoice += ` Td (Item Quantity: `;
          invoice += item.quantity;
          invoice += `)Tj ET
          BT /F1 10 Tf 285 `;
          invoice += `${600 - 10 * (index - 12) * 5}`;

          invoice += ` Td (Item Total Price: `;
          invoice += item.totalPrice;
          invoice += `)Tj ET`;
          // add horizenal line
          invoice += `Tj ET
          BT /F1 10 Tf 285 `;
          invoice += `${590 - 10 * (index - 12) * 5}`;

          invoice += ` Td (--------------------------------------------------------)Tj ET`;
        }
      });

      invoice += `      endstream
      endobj

      xref
      0 7
      0000000000 65535 f
      0000000009 00000 n
      0000000056 00000 n
      0000000111 00000 n
      0000000212 00000 n
      0000000250 00000 n
      0000000317 00000 n
      trailer <</Size 7/Root 1 0 R>>
      startxref
      406
      %%EOF`;

      let invoiceData = new Blob([invoice], { type: "text/pdf" });
      let invoiceUrl = URL.createObjectURL(invoiceData);
      let hiddenElement = document.createElement("a");

      // download pdf

      hiddenElement.href = invoiceUrl;
      hiddenElement.target = "_blank";
      hiddenElement.download = "invoice - " + order.paymentId + ".pdf";
      hiddenElement.click();
    },

    async newShipped(id) {
      console.log(id);
      await this.axios
        .get("http://localhost:3000/superuser/newshipped/" + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          this.date == "" ? this.getOrdersByPagination() : this.filterForCSV();
        })
        .catch(() => {
          // console.log(err);
        });
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
  justify-content: flex-start;
  padding: 2rem 3%;

  overflow-y: scroll;
  height: 90vh;

  /* hide scrool bar */
  scrollbar-width: 0.1rem;
  -ms-overflow-style: 0.1rem;
}

.titlemain {
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* text input */
.search input {
  width: 20%;
}

.export {
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-left: 20px;
}

.export input {
  width: fit-content;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  outline: none;
  margin-right: 0.5rem;
  background: #fff;
  height: 2rem;
}

/* select */
.export select {
  width: 150px;
  height: 2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  outline: none;
  margin-right: 20px;
}

.export select option {
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 5px;
  outline: none;
  margin-right: 20px;
}

.export button {
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
  width: fit-content;
  height: 50px;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  position: relative;
  top: -70px;
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

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #f16028;
}

.title button.deliver {
  box-sizing: border-box;
  width: fit-content;
  /* all content should be in one line */
  white-space: nowrap;
  padding: 0.2rem 0.5rem;
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

.navigation button {
  border: none;
  border-radius: 0.25rem;
  padding: 0.2rem 0.5rem;
  background: #333;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  margin: 10px;
}

.navigation button:hover {
  background: #555;
}

.navigation span {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin: 10px;
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
