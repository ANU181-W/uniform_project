<template>
  <footer>
    <div class="cyan">
      <div class="container">
        <div class="address">
          <p>
            1st floor, Rashmi Industrial Estate, S.no.70/A1/2/2A, Lane, 2,
            Salunke Vihar Rd. Wanwadi, Pune, Maharashtra 411040
          </p>
          <p>
            Customer Care: +91 77740 80207 <br />
            Email ld: dresslanduniforms.in
          </p>
          <div class="social">
            FOLLOW US
            <div class="slink">
              <a href="#"><i class="bx bxl-facebook"></i></a>
              <a href="#"><i class="bx bxl-instagram"></i></a>
              <a href="#"><i class="bx bxl-linkedin"></i></a>
            </div>
          </div>
        </div>

        <div class="links">
          <!-- <div class="subscribe">
            <div class="input">
              <input type="text" placeholder="Subscribe us for new updates!" />
              <button>Submit</button>
            </div>
          </div> -->
          <div class="quicklinks">
            <div class="qlinks">
              <h3>brand</h3>
              <a href="#">About Us</a>
              <a href="#">Uniforms</a>
              <a href="#">Why Us?</a>
              <a href="/contact-us">Contact Us</a>
            </div>
            <div class="qlinks">
              <h3>SUPPORT</h3>
              <router-link to="/privacy-policy">Policies</router-link>
              <a href="#">Disclaimer</a>
              <router-link to="/privacy-policy">Terms & Conditions</router-link>
              <router-link to="/privacy-policy">Refund Policy</router-link>
            </div>
            <div class="qlinks">
              <h3>For Students</h3>

              <router-link to="/login">Login</router-link>
              <!-- <a href="#">Sign Up</a> -->
              <router-link to="/signup">Register</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grey">
      <p>&copy; 2023 Dressland Uniforms. All Rights Reserved</p>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
footer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

footer .cyan {
  width: 100%;
  padding: 3% 5%;
  background-color: #1954a1;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

footer .cyan .container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

footer .cyan .container .address {
  width: 40%;
  height: 100%;
  padding-right: 7%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

footer .cyan .container .address p {
  color: #fff;
  font-size: 1rem;
  font-weight: 300;
}

footer .cyan .container .address .social {
  color: #fff;
  font-size: 1rem;
  font-weight: 300;
}

footer .cyan .container .address .social .slink {
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

footer .cyan .container .address .social .slink a {
  text-decoration: none;
  color: #f16028;
  background-color: #fff;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 300;
  transition: all 0.3s ease-in-out;
}

footer .cyan .container .address .social .slink a:hover {
  /* background-color: #f16028; */
  color: #fff;
  outline: 1px solid #fff;
}

footer .cyan .container .links {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

footer .cyan .container .links .subscribe {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

footer .cyan .container .links .subscribe .input {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

footer .cyan .container .links .subscribe .input input {
  /* background-color: #078a84; */
  color: black;
  width: 80%;
  height: 2rem;

  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 300;
}

/* placeholder color */
footer
  .cyan
  .container
  .links
  .subscribe
  .input
  input::-webkit-input-placeholder {
  color: black;
}

footer .cyan .container .links .subscribe .input button {
  background-color: #f16028;
  color: #fff;
  width: 20%;
  height: 2rem;
  border: none;
  outline: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 300;
  transition: all 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}
footer .cyan .container .links .subscribe .input button:hover {
  background-color: #fff;
  color: #f16028;
  border: 1px solid #f16028;
}

footer .cyan .container .links .quicklinks {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}

footer .cyan .container .links .quicklinks .qlinks {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

footer .cyan .container .links .quicklinks .qlinks h3 {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

footer .cyan .container .links .quicklinks .qlinks a {
  color: #ffffffaf;
  font-size: 1rem;
  font-weight: 300;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
}

footer .cyan .container .links .quicklinks .qlinks a:hover {
  color: #fff;
}

footer .grey {
  width: 100%;
  height: 50px;
  background-color: #1a1a18;
  display: flex;
  justify-content: center;
  align-items: center;
}

footer .grey p {
  color: #fff;
  font-size: 1rem;
  font-weight: 300;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
}

@media screen and (max-width: 768px) {
  footer .cyan .container .links .quicklinks {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  footer .cyan .container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  footer .cyan .container .address {
    width: 100%;
    height: 100%;
    padding-right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  footer .cyan .container .address p {
    text-align: center;
  }

  footer .cyan .container .links {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  footer .cyan .container .address .social {
    margin-bottom: 1rem;
  }

  footer .cyan .container .links .subscribe {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  footer .cyan .container .links .subscribe .input {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  footer .cyan .container .links .subscribe .input input {
    background-color: #078a84;
    color: #fff;
    width: 80%;
    height: 2rem;

    border: none;
    outline: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 300;
  }

  footer .cyan .container .links .quicklinks .qlinks {
    margin-bottom: 1rem;
    width: 100%;
  }
}
</style>
