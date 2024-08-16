<template>
  <div class="schoolmain">
    <div class="over" v-if="over">
      <div class="close">
        <button @click="close">X</button>
      </div>
      <div class="form">
        <div class="input">
          <input type="text" placeholder="Name" v-model="name" />
        </div>
        <div class="input">
          <input type="text" placeholder="School Code" v-model="code" />
        </div>
        <div class="input">
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
        </div>
        <!-- school.schoolDelivery = Boolean(body.schoolDelivery);
    school.homeDelivery = Boolean(body.homeDelivery); -->
        <div class="input cbox">
          <input
            type="checkbox"
            id="schoolDelivery"
            name="schoolDelivery"
            value="1"
            v-model="schoolDelivery"
          />

          <label for="schoolDelivery">School Delivery</label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="checkbox"
            id="homeDelivery"
            name="homeDelivery"
            value="1"
            v-model="homeDelivery"
            placeholder="Home Delivery"
          />

          <label for="homeDelivery">Home Delivery</label>
        </div>

        <!-- image -->
        <div class="input">
          <!-- image -->
          <input
            type="file"
            placeholder="Image"
            @change="imgchange"
            accept="image/*"
          />
        </div>

        <div class="button">
          <button @click="add" v-if="!sedit">Add</button>
          <button @click="commitedit" v-if="sedit">Save</button>
        </div>
      </div>
    </div>
    <div class="title">
      <h1>Schools</h1>
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
            <th>Address</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="school in filteredSchools" :key="school.id">
            <td>{{ school.name }}</td>
            <td>{{ school.address }}</td>
            <td>{{ school.email }}</td>
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
  name: "school",
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
      schoolDelivery: false,
      homeDelivery: true,
    };
  },
  async created() {
    await this.getSchools();
  },

  computed: {
    filteredSchools() {
      if (this.search === "") return this.schools;
      return this.schools.filter((school) => {
        return (
          school.name.toLowerCase().includes(this.search.toLowerCase()) ||
          school.address.toLowerCase().includes(this.search.toLowerCase()) ||
          school.email.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },

  methods: {
    async getSchools() {
      const res = await this.axios
        .get("http://localhost:3000/superuser/schools", {
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
      if (!this.name || !this.address || !this.email) {
        alert("Please fill all the fields");
        return;
      }
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("address", this.address);
      formData.append("email", this.email);
      formData.append("image", this.Image);
      formData.append("code", this.code);
      formData.append("schoolDelivery", this.schoolDelivery);
      formData.append("homeDelivery", this.homeDelivery);

      console.log(this.schoolDelivery);
      console.log(this.homeDelivery);

      const res = await this.axios.post(
        "http://localhost:3000/superuser/school",
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
        "Are you sure you want to delete this school: " + school.name
      );
      if (!confirm) {
        return;
      }
      const res = await this.axios.delete(
        "http://localhost:3000/superuser/school/" + id,
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
      if (!this.name || !this.address || !this.email) {
        alert("Please fill all the fields");
        return;
      }

      let formData = new FormData();

      formData.append("name", this.name);
      formData.append("address", this.address);
      formData.append("email", this.email);
      if (this.Image) {
        formData.append("image", this.Image);
      }
      formData.append("code", this.code);
      formData.append("schoolDelivery", Boolean(this.schoolDelivery));
      formData.append("homeDelivery", Boolean(this.homeDelivery));

      const res = await this.axios.post(
        "http://localhost:3000/superuser/school/" + this.id,
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
      this.code = school.code;
      this.address = school.address;
      this.email = school.email;
      this.sedit = true;
      this.schoolDelivery = school.schoolDelivery;
      this.homeDelivery = school.homeDelivery;
      this.id = id;
    },
  },
};
</script>

<style scoped>
.schoolmain {
  width: 75vw;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.cbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.cbox input {
  margin-right: 10px;
  width: 1rem;
  height: 1rem;
}
</style>
