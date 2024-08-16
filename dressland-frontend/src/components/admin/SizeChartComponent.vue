<template>
  <div class="over" v-if="showchart">
    <div class="image">
      <img
        :src=" 'http://localhost:3000/image/sizecharts/' + showchart   + '?width=400'"
        alt=""
      />
    </div>
    <div class="close">
      <button @click="showchart = null">X</button>
    </div>
  </div>
  <div class="schoolmain">
    <div class="over" v-if="over">
      <div class="close">
        <button @click="close">X</button>
      </div>
      <div class="form">
        <div class="input">
          <input type="text" placeholder="Name" v-model="name" />
        </div>
        <!-- <div class="input">
          <input type="text" placeholder="School Code" v-model="code" />
        </div> -->
        <!-- <div class="input">
          <textarea
            name="address"
            id="address"
            cols="30"
            rows="10"
            v-model="address"
            placeholder="Enter 
Address "
            style="white-space: pre"
          >
          </textarea>
        </div>
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
        </div> -->
        <!-- image -->
        <div class="input">
          <input type="file" placeholder="Image" @change="imgchange" />
        </div>

        <div class="button">
          <button @click="add" v-if="!sedit">Add</button>
          <button @click="commitedit" v-if="sedit">Edit</button>
        </div>
      </div>
    </div>
    <div class="title">
      <h1>Size Charts</h1>
      <button @click="over = true">Add</button>
    </div>
    <div class="search">
      <input type="text" placeholder="Search" v-model="search" />
    </div>
    <!-- {{ filteredSchools }} -->
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Chart</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="school in filteredSchools" :key="school.id">
            <td>{{ school.name }}</td>
            <td @click="showchart = school.chart">
              <img
                style="width: 200px"
                :src="
                  'http://localhost:3000/image/sizecharts/' +
                  school.chart + '?width=40'
                "
                alt=""
              />
            </td>
            <td>
              <button @click="edit(school.id)">Edit</button>
              <button @click="del(school.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "sizechart",
  data() {
    return {
      name: "",
      address: "",
      email: "",
      schools: null,
      over: false,
      sedit: false,
      id: null,
      search: "",
      Image: null,
      code: "",
      showchart: null,
    };
  },
  async created() {
    await this.getSchools();
  },

  computed: {
    filteredSchools() {
      if (this.search === "") return this.schools;
      return this.schools.filter((school) => {
        return school.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },

  methods: {
    async getSchools() {
      const res = await this.axios
        .get("http://localhost:3000/superuser/sizecharts", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.schools = res.data;
        });
    },
    imgchange(event) {
      // console.log("image changed");
      this.Image = event.target.files[0];
    },
    async add() {
      if (!this.name || !this.Image) {
        alert("Please fill all the fields");
        return;
      }
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("image", this.Image);

      const res = await this.axios.post(
        "http://localhost:3000/superuser/sizechart",
        formData,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.status === "success") {
        // alert(res.data);
        this.name = "";
        this.address = "";
        this.email = "";
        this.over = false;
        await this.getSchools();
      } else {
        alert(res.data.message);
      }
    },
    async del(id) {
      let school = this.schools.find((school) => school.id === id);
      let confirm = window.confirm(
        "Are you sure you want to delete this chart: " + school.name
      );
      if (!confirm) {
        return;
      }
      const res = await this.axios.delete(
        "http://localhost:3000/superuser/sizechart/" + id,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.status === "success") {
        // alert(res.data);
        await this.getSchools();
      } else {
        alert(res.data.message);
      }
    },

    async commitedit() {
      if (!this.name || !this.Image) {
        alert("Please fill all the fields");
        return;
      }

      let formData = new FormData();

      formData.append("name", this.name);
      formData.append("image", this.Image);

      const res = await this.axios.post(
        "http://localhost:3000/superuser/sizechart/" + this.id,
        formData,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.status === "success") {
        // alert(res.data);
        this.name = "";
        this.address = "";
        this.email = "";
        this.over = false;
        this.sedit = false;
        this.id = null;
        await this.getSchools();
      } else {
        alert(res.data.message);
      }
    },

    close() {
      this.over = false;
      this.name = "";
      this.address = "";
      this.email = "";
      this.sedit = false;
      this.id = null;
    },
    edit(id) {
      this.over = true;
      let school = this.schools.find((school) => school.id === id);
      this.name = school.name;
      this.sedit = true;
      this.id = id;
    },
  },
};
</script>

<style scoped>
.over .image {
  z-index: 999;
  width: 70%;
  height: 100%;
  max-height: 85vh;
}

.over .image img {
  width: 100%;
  height: 100%;
  max-height: 85vh;
  object-fit: contain;
}

.schoolmain {
  width: 75vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}
</style>
