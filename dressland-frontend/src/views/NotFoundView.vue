<template>
  <div class="not-found">
    <div class="container">
      <div class="logo">
        <img src="../assets/images/header-logo.png" alt="logo" />
      </div>
      <div class="title">
        <h1>404</h1>
      </div>
      <div class="text">
        <p>Page Not Found</p>
      </div>
      <div class="button">
        <button @click="$router.push('/')">Go Home</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.not-found {
  width: 100%;
  height: 90vh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-found .container {
  width: 50%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.not-found .container .logo {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-found .container .logo img {
  width: 100%;
  height: 100%;
}

.not-found .container .title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-found .container .title h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #000;
}

.not-found .container .text {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-found .container .text p {
  font-size: 1.5rem;
  font-weight: 400;
  color: #000;
}

.not-found .container .button {
  width: 100%;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-found .container .button button {
  width: 100%;
  height: 100%;
  background: #000;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 400;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
