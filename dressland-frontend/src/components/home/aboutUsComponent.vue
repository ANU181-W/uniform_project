<template>
  <div class="about" id="about">
    <div class="text">
      <h4>OUR HISTORY</h4>
      <h2>about <span>us</span></h2>
      <p class="text-p">
        At DressLand Uniforms, we understand the importance of quality, comfort, and style when it comes to school uniforms. Our mission is to provide schools, students, and parents with a seamless shopping experience, offering a wide range of uniforms.....
      </p>
      <button>SHOW UNIFORMS</button>
    </div>
    <div class="image">
      <div class="img-1"><img src="../../assets/school-girl.jpg" alt="about" /></div>
      <div class="img-2"><img src="../../../public/360_F_65951648_pBOJEK7yMiZo5m9dsgABB4cgawCB5rtl.jpg" alt="about" /></div>

    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.about {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  padding: 0% 5%;
  background-color: #fff;
}
.text ul li {
  list-style:none;
}
.text p{
text-wrap:balance;
}
.about .text {
  height: 100%;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.about .text h2 {
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
}

.about .text h2 span {
  color: #f16028;
}

.about .text p {
  font-size: 1rem;
  font-weight: 300;
  margin-top: 1rem;
}

.about .text h4 {
  margin-bottom: 1rem;
  border-bottom: 2px solid #f16028;
  text-transform: capitalize;
  margin-top: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.text button {
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
.text button:hover{
  cursor: pointer;
  background-color: #f16028;
  color: #fff;
  transition: 0.3s ease-in;

}
/* center dash before h3
.about .text h3:before {
  content: "——————————————————";
  margin-right: 0.5rem;
  /* remove space between characters 
  letter-spacing: -0.5em;
}
.about .text h3::after {
  content: "——————————————————";
  margin-right: 0.5rem;
  /* remove space between characters 
  letter-spacing: -0.5em;
} */
.about .image {
  display: flex;
  /* flex-direction: column; */
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
.about .image div{
  /* height: 100%; */
}

.img-1{
  height: 400px;
}
.img-2{
  padding-top: 40%;
  padding-bottom: 0px;
  height: 600px;
  /* width: 100%; */
}
.about .image img {
  border: 1px solid #f16028;
  border-radius: 30px;
  height: 60%;
  width: 100%;
  object-fit: cover;
}

@media screen and (max-width: 768px) {
  .about {
    flex-direction: column;
    padding: 5% 5%;
  }

  .about .text {
    width: 100%;
    margin-bottom: 3rem;
  }

  .about .image {
    display: none;
  }
}
</style>
