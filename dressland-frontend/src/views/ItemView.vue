<template>
  <div class="over" v-if="showchart && item.sizeChart.chart">
    <div class="image">
      <img
        :src="
          'http://localhost:3000/image/sizecharts/' +
          item.sizeChart.chart +
          '?width=400'
        "
        alt=""
      />
    </div>
    <div class="close">
      <button @click="showchart = false">X</button>
    </div>
  </div>
  <div class="productmain" v-if="item">
    <div class="image">
      <img
        :src="'http://localhost:3000/image/' + item.image + '?width=200'"
        alt=""
      />
      <!-- buy button -->
    </div>
    <div class="content">
      <h1>{{ item.name }}</h1>
      <h4>School: {{ item.school.name }}</h4>
      <!-- <hr class="hori-line" > -->
      <h3>{{ item.category }}</h3>
      <!-- <hr class="hori-line" > -->
      <p class="desc">{{ item.description }}</p>
      <!-- <hr class="hori-line" > -->

      <h2>Available Sizes:</h2>
      <div class="sizes">
        <!-- {{ item }} -->
        <div
          class="size"
          v-for="size in item.Productsize"
          :key="size.id"
          :class="choosed(size.size)"
          @click="choosedsize = size.size"
        >
          <h5>Size: {{ size.size }}</h5>
          <h6>Price: {{ size.price }}</h6>
        </div>
      </div>

      <small @click="showchart = true" v-if="item.sizeChart"
        >View Size-chart</small
      >

      <!-- <hr class="hori-line" > -->
      <div class="quantity">
        <h2>Quantity</h2>
        <div class="quantity-btn">
          <div class="counter">
            <button class="minus" @click="changequantity(-1)">-</button>
            <input type="number" v-model="quantity" />
            <button class="plus" @click="changequantity(1)">+</button>
          </div>
          <button @click="addtocart" class="buy" style="border: 1px solid">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemView",
  data() {
    return {
      id: "",
      item: {},
      choosedsize: "",
      quantity: 1,
      showchart: false,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getItem();
  },
  watch: {
    "$route.params.id": function (val) {
      this.id = val ? val : "";
      this.getItem();
    },
    quantity: function (val) {
      // console.log(val);
      if (val > 5) {
        this.quantity = 5;
      }
      if (val < 1) {
        this.quantity = 1;
      }
    },
  },
  methods: {
    async getItem() {
      const response = await this.axios
        .get("http://localhost:3000/user/product/" + this.id, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.item = res.data;
        })
        .catch((err) => {
          this.store.dispatch("signout");
          // console.log(err);
        });
    },

    async addtocart() {
      if (this.choosedsize === "") {
        alert("Please choose a size");
        return;
      }
      const response = await this.axios
        .post(
          "http://localhost:3000/user/cart",
          {
            productId: this.id,
            size: this.choosedsize,
            quantity: this.quantity,
          },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          this.$router.push("/cart");
        })
        .catch((err) => {
          // console.log(err);
        });
    },

    changequantity(val) {
      if (this.quantity + val > 0 && this.quantity + val < 6) {
        this.quantity += val;
      }
    },
    choosed(size) {
      if (this.choosedsize === size) {
        return "choosed";
      }
    },
  },
};
</script>

<style scoped>
.over {
  position: fixed;
  top: 0;
  left: 0;
  width: 99vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.over .image {
  width: 70%;
  height: 100%;
  max-height: 85vh;
  border-radius: 10px;
}
.hori-line {
  color: black;
  width: 100%;
  margin: 3px;
}
.over .image img {
  width: 100%;
  height: 100%;
  max-height: 85vh;
  object-fit: contain;
}

.over .close {
  position: absolute;
  top: 0;
  right: 0;
  width: 5%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.over .close button {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  color: #f16028;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 5px;
}

.productmain {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-height: 90vh;
  padding: 2% 5%;
}

.image {
  width: 50%;
  height: 100%;
  max-height: 85vh;
}

.image img {
  width: 100%;
  height: 100%;
  max-height: 85vh;
  object-fit: contain;
}

button.buy {
  padding: 1rem 1rem;
  width: 100%;
  background-color: white;
  color: #f16028;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 5px;
  margin-top: 2rem;
}

.buy:hover {
  transition: 0.4s ease-in-out;
  background-color: #f16028;
  color: white;
}
.content {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1% 5%;
}

.content h1 {
  font-family: Integral CF;
  font-size: 3rem;
  font-weight: 800;
  line-height: 48px;
  text-align: left;
  text-transform: uppercase;
}

.content p {
  /* like a link */
  color: #000000;
  font-size: 2rem;
  font-weight: 500;
  cursor: pointer;
  /* margin-top: 1rem; */
  text-decoration: underline;
}

.content p.desc {
  font-size: 1rem;
  font-weight: 400;
  margin-top: 1rem;
  cursor: text;
  text-decoration: none;
}

.content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  white-space: pre-wrap;
  text-transform: uppercase;
  margin-top: 1rem;
}

.content h3 {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;
}

.content h4 {
  font-size: 1rem;
  color: black;
  font-weight: 500;
  text-transform: uppercase;
}

.content small {
  font-size: 1rem;
  color: #000000;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  text-decoration: underline;
  cursor: pointer;
}

.content .sizes {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  /* margin-top: 2rem;x */
  flex-wrap: wrap;
}

.content .sizes .size {
  width: 23%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 1%;
  outline: #efa121 solid 1px;
  padding: 1%;
  border-radius: 5px;
  cursor: pointer;
}

.content .sizes .size:hover {
  background-color: #efa121;
  color: #fff;
}

.content .sizes .size h5 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.content .sizes .size h6 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.content .sizes .size.choosed {
  background-color: #efa121;
  color: #fff;
}
.quantity-btn {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .quantity {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 2rem;
}

.content .quantity h5 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.content .quantity .counter {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 2.2rem;
}

.content .quantity .counter input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
  border: none;
  outline: none;
  border: #000 solid 1px;
}

.content .quantity .counter button {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  font-weight: 500;
  border: none;
  outline: none;
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

.content .quantity .counter button:hover {
  background-color: #efa121;
  color: #fff;
}

.content .quantity .counter button.minus {
  border-radius: 5px 0 0 5px;
}

.content .quantity .counter button.plus {
  border-radius: 0 5px 5px 0;
}

@media (max-width: 768px) {
  .over .close {
    position: fixed;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    font-size: 2rem;
    font-weight: 600;
    background-color: #000;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .over .close:hover {
    background-color: #efa121;
    color: #fff;
  }
  .productmain {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 1% 0;
  }

  .image {
    width: 100%;
    height: 100%;
    max-height: 65vh;
  }

  .image img {
    width: 100%;
    height: 100%;
    max-height: 65vh;
    object-fit: contain;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 1% 1%;
  }

  .content h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .content h2 {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 2rem;
    white-space: pre-wrap;
  }

  .content h3 {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .content h4 {
    font-size: 1rem;
    color: #000000;
    font-weight: 500;
  }

  .content .sizes {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .content .sizes .size {
    width: 23%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 1%;
    outline: #efa121 solid 1px;
    padding: 1%;
    border-radius: 5px;
    cursor: pointer;
  }

  .content .sizes .size:hover {
    background-color: #efa121;
    color: #fff;
  }

  .content .sizes .size h5 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  .content .sizes .size h6 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  .content .sizes .size.choosed {
    background-color: #efa121;
    color: #fff;
  }

  .content .quantity {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    margin-top: 2rem;
  }

  .content .quantity h5 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    margin-right: 1rem;
  }

  .content .quantity .counter {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
  }

  .content .quantity .counter input {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    outline: none;
    border: #000 solid 1px;
  }

  .content .quantity .counter button {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    font-weight: 500;
    border: none;
    outline: none;
    background-color: #000;
    color: #fff;
    cursor: pointer;
  }

  .content .quantity .counter button:hover {
    background-color: #efa121;
    color: #fff;
  }

  .content .quantity .counter button.minus {
    border-radius: 5px 0 0 5px;
  }

  .content .quantity .counter button.plus {
    border-radius: 0 5px 5px 0;
  }
}
</style>
