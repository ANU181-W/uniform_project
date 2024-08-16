<template>
  <div class="querymain">
    <div class="title">Query Values</div>
    <!-- localhost:5173?id=10&name=rajesh -->
    id : {{ this.id }} name : {{ this.name }}
  </div>
</template>

<script>
export default {
  name: "QueryValues",
  data() {
    return {
      id: "",
      name: "",
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.name = this.$route.query.name;

    // remove query params from url
    this.$router.replace({ path: "/query" });
  },
  methods: {},
};
</script>

<style></style>
