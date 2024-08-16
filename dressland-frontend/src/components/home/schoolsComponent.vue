<template>
  <h4 >ASSOCIATED SCHOOLS WITH DRESSLAND UNIFORMS</h4>
  <div class="main" id="main"> 
    <div class="images" id="images">
      <img
        v-for="school in schools"
        :key="school.name"
        :src="'http://localhost:3000/image/school/' + $store.state.user.school.image + '?width=200'"
        :alt="school.name"
      />
    </div>
    <!-- <img src="../../assets/mah.jpg" alt=""> -->
    <!-- <img src="../../assets/tas.jpg" alt=""> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      schools: [],
    };
  },
  created() {
    this.getSchools();
  },

  mounted() {

    const main = document.getElementById("main");

    const images = document.getElementById("images");
    // get the width of the main div as 80% of the window width
    const mainWidth = window.innerWidth * 0.7;
    main.style.overflowX = "scroll";
    main.style.scrollBehavior = "smooth";

    let scrolling = false;
    let pastposition = 0;
    let currenposition = 0;
    if (main) {
      console.log(mainWidth);
      setInterval(() => {
        main.scrollBy(50, 0);

        pastposition = currenposition;
        currenposition = main.scrollLeft + 50;

        if (pastposition === currenposition) {
          main.scrollTo(0, 0);
          // scroll right by images offsetWidth - mainWidth
          // main.scrollBy(mainWidth - images.offsetWidth, 0);
        }
      }, 1000);
    }
    // setInterval(() => {
    //   main.scrollBy(10, 0);

    //   // if image div is scrolled to the end, scroll back to the start
    //   if (main.scrollLeft >= images.offsetWidth - mainWidth) {
    //     // main.scrollTo(0, 0);
    //     // scroll right by images offsetWidth - mainWidth
    //     main.scrollBy(mainWidth - images.offsetWidth, 0);
    //   }
    // }, 500);
  },

  methods: {
    async getSchools() {
      const response = await fetch("http://localhost:3000/api/get/schools");
      const data = await response.json();
      this.schools = data;

      // this.schools = this.schools.concat(this.schools);
    },
  },
};
</script>

<style scoped>
.main {
  max-width: 90vw;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  /* box-shadow: green 1px 1px; */
}
h4{
border-bottom: 1px solid #f16028;
width: fit-content;
font-weight: 600;
margin-left: 23%;
  
}
.main::-webkit-scrollbar {
  display: none;
}
.images {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  /* box-shadow: red 1px 1px; */
}

.images img {
  height: 6rem;
  margin: 1rem;
}

@media (max-width: 768px) {
  .main {
    max-width: 100vw;
    padding: 1rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 auto;
    /* box-shadow: green 1px 1px; */
  }

  .main::-webkit-scrollbar {
    display: none;
  }
  .images {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    /* box-shadow: red 1px 1px; */
  }

  .images img {
    height: 3rem;
    margin: 1rem;
  }
}
</style>
