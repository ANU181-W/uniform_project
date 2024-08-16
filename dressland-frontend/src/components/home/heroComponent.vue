<template>
  <!-- <div class="hero">
    <div class="image">
      <img src="../../assets/images/kids-school-uniform-500x500.webp" alt="iamge" />
    </div>
    <div class="text">
      <h4>Dressland uniforms</h4>
      <h2>YOUR DESTINATION FOR PREMIUM UNIFORM CLOTHING <span> Dressland</span></h2>
      <p>
        We are manufacturers and cupplierz of the School, College and
        Institutional Uniform: and Garments.
      </p>
      <button @click="$router.push('/uniforms')">view our uniforms</button>
    </div>
   
  </div>
  <hr> -->

  <div class="hero">

    <div class="image">
      <div class="div"><img src="../../assets/two-kids.jpg" alt="" class="img1"></div>
      <div class="div"><img src="../../assets/images/449019862-1024x700.jpg" alt="" class="img2"></div>
      <div class="div"><img src="../../assets/images/449019862-1024x700.jpg" alt="" class="img3"></div>
      
    </div>
    <div class="text">
      <h4>Dressland uniforms</h4>
      <h2>YOUR DESTINATION FOR PREMIUM UNIFORM CLOTHING <span> Dressland</span></h2>

      <button @click="$router.push('/uniforms')">view our uniforms</button>
    </div>
  </div>
  <hr>
</template>

<script>
export default {};
</script>

<style scoped>
.hero {
  position: relative;
  height: 90vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  /* align-items: flex-end; */
  /* padding: 0 5%; */
}
.text h4{
  margin-bottom: 1rem;
  border-bottom: 2px solid #f16028;
  text-transform: capitalize;
}
.hero .text {
  height: 100%;
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.icon{

  position: relative;
  bottom: 0;

}

.hero .text h2 {
  font-size: 2.5rem;
  font-weight: 700;
}
hr{
  color: #f16028;
}
.hero .text h2 span {
  color: #f16028;
}

.hero .text p {
  font-size: 1rem;
  font-weight: 300;
  margin-top: 1rem;
}

.hero .text button {
  height: 3rem;
  background-color: #fff;
  color: #f16028;
  font-size: 1rem;
  padding: 0 1rem;
  font-weight: 300;
  border: 1px solid #f16028;
  margin-top: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: 0.3s ease-in;
border-radius: 10px;
}
.hero .text button:hover{
  cursor: pointer;
  background-color: #f16028;
  color: #fff;
  transition: 0.3s ease-in;

}

.div {
  width: fit-content;
  height: fit-content;
  border: 2px solid #000; 
  border-radius: 10px; 
  object-fit: cover;
}
.img1{
  height: 50%;
  bottom: 10;
  border: 1px solid #f16028; 
  border-radius: 20px;
  position: absolute;
  transform: rotate(-20deg);
}
.img3{
  height: 40%;
  bottom: 0;
  right: 0;
  left: 10;
  margin-right: 2rem;
  margin-bottom: 9rem;
  border: 1px solid #f16028; 
  border-radius: 20px;
  position: absolute;
  
}
.img2{
  right: 0;
  height: 30%;
  border: 1px solid #f16028; 
  border-radius: 20px;
  position: absolute;
  transform: rotate(30deg);
}


.hero .image {
  position: relative;
  height: 110%;
  width: 110%;
  /* display: flex; */
  
}


@media screen and (max-width: 768px) {
  .hero {
    height: 80vh;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .hero .text {
    width: 100%;
    height: 50%;
    align-items: center;
  }

  .hero .text h2 {
    font-size: 2rem;
    text-align: center;
  }

  .hero .text p {
    text-align: center;
  }

  .hero .image {
    height: fit-content;
    width: 100%;
    justify-content: center;
    align-items: flex-end;
  }

  .hero .image img {
    height: auto;
    width: 100%;
  }
}
</style>
