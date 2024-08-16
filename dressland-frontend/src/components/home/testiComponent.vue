<template>
  <hr class="hr-line">
  <div class="main">
    <div class="text">
      <h2>What Our Parents Say</h2>
    </div>

    <!-- slideshow with swipe animation -->

    <div class="slidewraper">
      <div class="slidemain" id="slidemain">
        <!-- enter and exit animation -->
        <div class="slide" v-for="(testi, index) in testimonials" :key="index">
          <!-- add enter and start animation so that it will look like swipe -->

          <div class="slidecontent">
            <h2>{{ testi.title }}</h2>
            <p>{{ testi.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr class="hr-line">
</template>

<script>
// import { VueperSlides, VueperSlide } from "vueperslides";
// import "vueperslides/dist/vueperslides.css";
export default {
  //   components: { VueperSlides, VueperSlide },
  data() {
    return {
      testimonials: [
        {
          title:
            "Dressland Uniforms is the best source for school uniforms. The materials are top-notch, and I'm always pleased with the quality of their products. Their customer service is excellent. Highly recommended!",
          content: "Pallavi Sane",
        },
        {
          title:
            "I've been using Dressland Uniforms for a few months now and I'm impressed with their clothing material. It is super soft, comfortable, very durable, and fits perfectly. Very happy with their service.",
          content: "Rohit Sutar",
        },
        {
          title:
            "Dressland Uniforms is a great choice for school uniforms. Their fabric is of the highest quality. My kids have been using them for the past 1 year and have never been disappointed with their products. They take pride in their work .",
          content: "Sayali Patil",
        },
      ],
    };
  },

  mounted() {
    // set width of slidemain to 80vw * number of slides in testimonials
    // set width of slide to 80vw
    // set width of slidecontent to 80vw

    // get width of screen
    let width = window.innerWidth;

    width = width * 0.5;

    // get number of slides in testimonials
    const slides = this.testimonials.length;
    // set width of slidemain to 80vw * number of slides in testimonials
    const slidemain = document.getElementById("slidemain");
    slidemain.style.width = `${width * slides}px`;
    // set width of slide to 80vw
    const slide = document.getElementsByClassName("slide");
    for (let i = 0; i < slide.length; i++) {
      slide[i].style.width = `${width}px`;
    }
    // set width of slidecontent to 80vw
    const slidecontent = document.getElementsByClassName("slidecontent");
    for (let i = 0; i < slidecontent.length; i++) {
      slidecontent[i].style.width = `${width}px`;
    }

    // get slidewraper and set width to 80vw and set overflow to scroll
    const slidewraper = document.getElementsByClassName("slidewraper");
    for (let i = 0; i < slidewraper.length; i++) {
      slidewraper[i].style.width = `${width}px`;
      //   slidewraper[i].style.overflow = "scroll";
      // just horizontal scroll
      slidewraper[i].style.overflowX = "scroll";
    }

    // get slidemain and set overflow to hidden
    slidemain.style.overflow = "hidden";

    // scroll the slidewraper to the right by width every 3 seconds
    let counter = 0;
    setInterval(() => {
      //   slidewraper[0].scrollBy(width, 0);
      //   slidewraper[0].scrollTo(width * counter, 0);
      // scroll slowly
      slidewraper[0].scrollTo({
        left: width * counter,
        behavior: "smooth",
      });
      counter++;
      if (counter === this.testimonials.length) {
        counter = 0;
      }
    }, 5000);
  },
};
</script>

<style scoped>
.main {
  /* background-image: url("../../assets/images/parents.jpg"); */
  /* background-color: #e77c52; */
  background-size: cover;
  background-repeat: no-repeat;
  color: black;
  padding: 1% 5%;
  display: flex;
  gap: 3rem;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}

.hr-line{
  color: #f16028;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
}

.main .text h2 {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}
.quote {
  font-size: 4rem;
  /* rotate 180deg */
  transform: rotate(180deg);
}

.quote span {
  font-size: 5rem;
}

.slidecontent h2{
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
}
p {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  text-align: center;
  border-bottom:1px solid #000;
}

.slidewraper {


  /* scroll width none */
  scroll-behavior: smooth;
  /* scroll thumb width  */
  /* scroll thumb color  */
  /* scroll thumb radius  */

}

.slidewraper::-webkit-scrollbar {
  width: 0.1rem;
  height: 0.1rem;
  background-color: #f1f1f1;
}

.slidemain {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw;
  overflow: hidden;
  margin-top: 1rem;
}

.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 12rem; */
  width: 60vw;
  overflow: hidden;
  margin-top: 2rem;
}

.slidecontent {
  background-color: #f16028;
  border:1px solid#f16028;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 12rem;
  width: 30vw;
  padding: 2rem;
  /* overflow: hidden; */
}

@media screen and (max-width: 720px) {
  .main {
    padding: 2%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
  }

  .main .text h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  .quote {
    font-size: 1.5rem;
    margin: 0;
  }
  h2 {
    font-size: 0.8rem;
    margin: 0;
  }
  .quote span {
    font-size: 1.5rem;
  }
  .slidewraper {
    margin-top: 0rem;
    /* scroll width none */
    scroll-behavior: smooth;

    /* scroll thumb width  */
    /* scroll thumb color  */
    /* scroll thumb ra
    dius  */
  }

  .slidemain {
    margin-top: 0.5rem;
  }

  .slidecontent {
    height: 9rem;
  }

  .slide {
    height: 9rem;
    margin-top: 0.5rem;
  }

  .slidecontent p {
    font-size: 0.8rem;
  }
}
</style>
