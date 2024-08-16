<template>
  <div class="item-card" @click="$router.push('/item/' + product.id)">
    <div class="item_image" @mouseenter="blurImage(true)" @mouseleave="blurImage(false)">
      <img
        :src="'http://localhost:3000/image/' + product.image  + '?width=200' "
        alt="image"                                         
        
      />
    </div>
    <div class="item_content">
      <h3>{{ product.name }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: { product: Object },
  data() {
    return {
      isHovered: false
    };
  },
  methods: {
    blurImage(value) {
      this.isHovered = value;
    }
  }
};
</script>

<style scoped>
.item-card {

  margin-top: 2rem;
  width: 200px;
  /* height: 280px; Adjust height as needed */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add subtle shadow */
  transition: box-shadow 0.3s ease-in-out;
}


.item-card:hover{
cursor: pointer;
  box-shadow: 1px 8px 12px rgba(0, 0, 0, 0.8);

}

.item_image img {
  border: 10px;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Maintain aspect ratio */
  transition: filter 0.3s ease-in-out;
}

.item_content {
  background-color: #f16028; /* Semi-transparent background */
  padding: 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  /* transform: translateY(100%); */
  transition: transform 0.3s ease-in-out;
}

.item_content h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
  text-align: center;
}
/* 
.item-card:hover .item_content {
  transform: translateY(0);
} */
</style>
