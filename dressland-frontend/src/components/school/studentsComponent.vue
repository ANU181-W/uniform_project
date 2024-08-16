<template>
  <div class="usersmain">
    <div class="usersmain__title">
      <h1>Users</h1>
    </div>
    <div class="search">
      <input type="text" placeholder="Search" v-model="search" />
    </div>
    <div class="usersmain__table">
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>School</th>
          <th>Role</th>
        </tr>
        <tr v-for="(usr, index) in filteredusers" :key="index">
          <td>{{ usr.name }}</td>
          <td>{{ usr.email }}</td>
          <td>{{ usr.school.name }}</td>
          <td>
            <select
              name="role"
              id="role"
              @change="rolechanged(usr)"
              v-model="usr.role"
            >
              <option value="user">user</option>
              <option value="blocked">blocked</option>
            </select>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "studentsComponent",
  data() {
    return {
      search: "",
      users: [],
    };
  },
  created() {
    this.getusers();
  },
  computed: {
    filteredusers() {
      return this.users.filter((user) => {
        return (
          user.name.toLowerCase().includes(this.search.toLowerCase()) ||
          user.email.toLowerCase().includes(this.search.toLowerCase()) ||
          user.school.name.toLowerCase().includes(this.search.toLowerCase()) ||
          user.role.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },
  methods: {
    async getusers() {
      try {
        await this.axios
          .get("http://localhost:3000/school/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            this.users = res.data;
            // console.log(this.users);
          });
      } catch (err) {
        // console.log(err);
      }
    },
    async rolechanged(e) {
      try {
        await this.axios
          .put(
            `http://localhost:3000/school/user/${e.id}`,
            {
              role: e.role,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            // console.log(res.data);
          });
      } catch (err) {
        // console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.usersmain {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 90vh;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: scroll;
}

.usersmain::-webkit-scrollbar {
  width: 0.5rem;
}

.usersmain__title {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 2rem;
}

.usersmain__title h1 {
  font-size: 2rem;
  font-weight: 600;
}

.search {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 2rem;
}

.search input {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #000;
  font-size: 1rem;
  font-weight: 400;
}

.usersmain__table {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.usersmain__table table {
  width: 100%;
  border-collapse: collapse;
}

.usersmain__table table tr th {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #000;
}

.usersmain__table table tr td {
  font-size: 1rem;
  font-weight: 400;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #000;
}

.usersmain__table table tr td button {
  font-size: 1rem;
  font-weight: 400;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #000;
  cursor: pointer;
}

.usersmain__table table tr td button:hover {
  background-color: #000;
  color: #fff;
}
</style>
