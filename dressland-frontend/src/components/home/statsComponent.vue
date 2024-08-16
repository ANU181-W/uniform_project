<template>
  <hr class="hr-line">
  <div class="stats main">

    <div class="info">
      
      <h4>Dressland Uniforms</h4>
      
      we take pride in our years of <span>experience</span> and commitment to <span>quality</span>.</div>
    <div class="container">
      <div>
      <div class="stat">
        <div class="logo">
          <img src="../../assets/icon-1.png" alt="" />
        </div>
        <div class="text">
          30+
          <br />
          <span>schools associated</span>
        </div>
      </div>
      <div class="stat">
        <div class="logo">
          <!-- <span class="material-symbols-outlined"> home_work </span> -->
          <img src="../../assets/icon-2.png" alt="" />
        </div>
        <div class="text">
          25+
          <br />
          <span>years of experience</span>
        </div>
      </div></div>

      <div>
      <div class="stat">
        <div class="logo">
          <!-- <span class="material-symbols-outlined"> home_work </span> -->
          <img src="../../assets/icon-3.png" alt="" />
        </div>
        <div class="text">
          20000+
          <br />
          <span>satisfied students</span>
        </div>
      </div>
      <div class="stat">
        <div class="logo">
          <!-- <span class="material-symbols-outlined"> home_work </span> -->
          <img src="../../assets/icon-4.png" alt="" />
        </div>
        <div class="text">
          6000+
          <br />
          <span>monthly production</span>
        </div>
      </div></div>
    </div>
  </div>
  <hr class="hr-line">
</template>

<script>
export default {};
</script>

<style scoped>
.hr-line{
  color: #f16028;
}
.main .info{
  text-transform: uppercase;
  font-size: 2.5rem;
  font-weight: 700;
  width: 100%;
  height: 100%;
  margin: auto;
}
.info h4{
  width:fit-content;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f16028;
  text-transform: capitalize;
  margin-top: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.main .info span{
  color: #f16028;
}
.main{
  color: black;
}
.stats {
  height: 70vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  padding: 4rem;
}

.stats .container {
  height: 100%;
  width: 100%;
  margin: 0;
  gap: 4rem;
  max-width: 100%;
  box-sizing: border-box;
  /* background-color: #0f7036d6; */
  display: flex;
  justify-content:flex-end;
  align-items: center;
}

.stats .container .stat {
  height: 100%;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stats .container .stat .logo {
  height: 4rem;
  /* width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats .container .stat .logo img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.stats .container .stat .logo span {
  font-size: 3rem;
  /* color: #f16028; */
}

.stats .container .stat .text {
  height: 30%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* color: #fff; */
  font-size: 2rem;
  font-weight: 800;
  margin: 0.5rem;
}

.stats .container .stat .text span {
  font-size: 1rem;
  font-weight: 700;
  /* color: #fff; */
}

@media screen and (max-width: 768px) {
  .stats {
    font-size: 1em;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-size: cover;
  }

  .stats .container {
    height: 100%;
    width: 100%;
    margin: 0;

    max-width: 100%;
    box-sizing: border-box;
    /* background-color: #0f7036d6; */
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .stats .container .stat {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .stats .container .stat .logo {
    margin-top: 0.5rem;
    height: 2.5rem;
    /* width: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .stats .container .stat .logo span {
    font-size: 2rem;
    color: #f16028;
  }

  .stats .container .stat .text {
    height: 30%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* color: #fff; */
    font-size: 1rem;
    font-weight: 600;
    margin: 0.5rem;
    text-align: center;
  }

  .stats .container .stat .text span {
    font-size: 0.8rem;
    font-weight: 500;
    /* color: #fff; */
  }
}
</style>
