<template>
  <div class="main">
    <h3>DressLand</h3>
    <h2><span>o</span>ur Uniforms</h2>

    <!-- autoplay on -->
    <!-- no aerrows -->
    <div class="item"> 
      <itemCardComponent
        v-for="product in uniforms"
        :key="product.id"
        :product="product"
      />
    </div>
    <RouterLink to="/dashboard">

    <div class="btn"><button>show all</button></div></RouterLink>
  </div>
</template>

<script>
// import { VueperSlides, VueperSlide } from "vueperslides";
// import "vueperslides/dist/vueperslides.css";
// import VueSlickCarousel from 'vue-slick-carousel';
// import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import itemCardComponent from '../dashboard/itemCardComponent.vue';
export default {
components: { itemCardComponent },
  data() {
    return {
      uniforms: [],
    };
  },
  created() {
    this.getUniforms();
  },

  methods: {
    async getUniforms() {
      await this.axios
        .get("http://localhost:3000/api/uniforms")
        .then((res) => {
          this.uniforms = res.data;
          console.log(this.uniforms);
        })
        .catch((err) => {
          // console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.btn{
  padding-top: 2rem;
  width: 100%;
  margin: auto;
}

button{
  font-size: 1.3rem;
  padding: 0.5rem 3rem;
  color: #f16028;
  background-color: #fff;
  border:1px solid #f16028;
  border-radius: 10px;
  transition: 0.4s ease-in-out;
}
button:hover{
  color: #fff;
  background-color: #f16028;
}
.item{
  width: 100%;
  padding-left: 10%;
  /* margin-left:10%; */
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}
.main {

  padding: 2rem 0;
  /* box-shadow: green 1px 1px; */
}
.vueperslides__parallax-wrapper {
  /* padding: 2rem 0; */
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
  margin-bottom: 2rem;
}

h2 span {
  color: #f16028;
}

h3 {
  text-transform: uppercase;
  font-size: 1.3rem;
  width: 15%;
  text-align: center;
  border-bottom: 2px solid #f16028;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 43%;
}

/* center dash before h3
h3:before {
  content: "——————————————————";
  
  margin-right: 2rem;
  /* remove space between characters 
  letter-spacing: -0.5em;
}
h3[data-v-96209df7]::after {
    content: "——————————————————";
    margin-left: 2rem;
    letter-spacing: -0.5em;
} */

/* .carousel-item {
  text-align: center;
}

.carousel-item img {
  max-width: 100%;
  height: auto;
} */
</style>
