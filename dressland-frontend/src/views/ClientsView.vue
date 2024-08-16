<template>
  <div class="clientsmain">
    <div class="flexwrap">
      <div class="school" v-for="school in schools" :key="school.name">
        <div class="logo">
          <img
            :src="'http://localhost:3000/image/school/' + school.image  +  '?width=200'" 
            alt="School logo"
          />
        </div>
        <div class="name">
          <h2>{{ school.name }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      schools: [],
    };
  },
  async created() {
    await this.getSchools();
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
.clientsmain {
  width: 100%;
  height: 100%;
  padding: 5%;
}

.flexwrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}

.school {
  width: 40%;
  height: 20%;
  background-color: #fff;
  border-bottom: #f16028 1px solid;

  margin: 1rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.school .logo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.school .logo img {
  height: 100%;
  object-fit: cover;
  max-height: 6rem;
}

.school .name {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.school .name h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .school {
    width: 80%;
    justify-content: space-between;
  }

  .flexwrap {
    flex-direction: column;
  }

  .school .name {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .school .name h2 {
    font-size: 1rem;
    font-weight: 600;
  }

  .school .logo {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .school .logo img {
    height: 100%;
    object-fit: cover;
    max-height: 4rem;
  }
}
</style>
