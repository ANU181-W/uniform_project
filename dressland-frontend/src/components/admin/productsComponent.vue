<template>
  <div class="main">
    <div class="over" v-if="over">
      <div class="close">
        <button @click="close">X</button>
      </div>
      <div class="form">
        <div class="input">
          <select
            name="school"
            id="school"
            v-model="school"
            placeholder="Select School"
          >
            <option value="">Select School</option>
            <option
              v-for="school in schools"
              :key="school.id"
              :value="school.name"
            >
              {{ school.name }}
            </option>
          </select>
        </div>
        <div class="input">
          <select name="sku" id="sku" v-model="selsku" placeholder="Select sku">
            <option value="">new sku</option>
            <option v-for="s in sku" :key="s.id" :value="s.sku">
              {{ s.sku }}
            </option>
          </select>
        </div>
        <div class="input">
          <select
            name="sku"
            id="sku"
            v-model="selschart"
            placeholder="Select Sizechart"
          >
            <option value="">Select Sizechart</option>
            <option v-for="s in sizeCharts" :key="s.id" :value="s.name">
              {{ s.name }}
            </option>
          </select>
        </div>
        <div class="input">
          <input
            ref="input"
            type="file"
            name="image"
            accept="image/*"
            @change="setImage"
          />

          <div class="ccontent">
            <section class="cropper-area">
              <div class="img-cropper">
                <vue-cropper
                  ref="cropper"
                  :aspect-ratio="2.5 / 3"
                  :src="imgSrc"
                  preview=".preview"
                />
              </div>
              <div class="actions">
                <a href="#" role="button" @click.prevent="showFileChooser">
                  Upload Image
                </a>
                <a href="#" role="button" @click.prevent="cropImage">
                  Crop(click once satisfied with preview image)
                </a>
                <a href="#" role="button" @click.prevent="rotate(90)">
                  Rotate +90deg
                </a>
                <a href="#" role="button" @click.prevent="rotate(-90)">
                  Rotate -90deg
                </a>
                <a ref="flipX" href="#" role="button" @click.prevent="flipX">
                  Flip X
                </a>
                <a ref="flipY" href="#" role="button" @click.prevent="flipY">
                  Flip Y
                </a>
              </div>
            </section>
            <section class="preview-area">
              <p>Preview</p>
              <div class="preview" />
              <p>Cropped Image</p>
              <div class="cropped-image">
                <img v-if="cropImg" :src="cropImg" alt="Cropped Image" />
                <div v-else class="crop-placeholder" />
              </div>
            </section>
          </div>
        </div>
        <div class="input">
          <input type="text" placeholder="Name" v-model="name" />
        </div>
        <div class="input">
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
            placeholder="Description"
            style="white-space: pre"
            v-model="description"
          ></textarea>
        </div>
        <div class="input">
          <input type="text" placeholder="Category" v-model="category" />
        </div>
        <div class="sizes">
          <div class="size" v-for="size in sizes" :key="size.barcodeNumber">
            Size: {{ size.size }} <br />
            Price: {{ size.price }} <br />
            barcodeNumber: {{ size.barcodeNumber }}
            <button @click="remove(size.size)">Remove</button>
          </div>
        </div>
        <div class="multiip">
          <div class="input">
            <input type="text" placeholder="Size" v-model="size" />
          </div>
          <div class="input">
            <input type="text" placeholder="Price" v-model="price" />
          </div>
          <div class="input">
            <input
              type="text"
              placeholder="barcodeNumber"
              v-model="barcodeNumber"
            />
          </div>
          <div class="button">
            <button @click="addsize">Add Size</button>
          </div>
        </div>
        <div class="button">
          <button @click="add" v-if="!pedit">Add</button>
          <button @click="commitedit" v-if="pedit">Save</button>
        </div>
      </div>
    </div>
    <div class="title">
      <h1>Products</h1>
      <button @click="over = true">Add</button>
    </div>
    <div class="search">
      <input type="text" placeholder="Search" v-model="search" />
      <select name="school" id="school" v-model="search">
        <option value="">Select School</option>
        <option v-for="school in schools" :key="school.id" :value="school.name">
          {{ school.name }}
        </option>
      </select>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <!-- <th>School</th> -->
            <th>Image</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <!-- {{
              product.school
            }} -->
            <!-- <td>{{ product.school.name }}</td> -->
            <td>
              <img
                :src="
                  'http://localhost:3000/image/' + product.image + '?width=100'
                "
                alt="Image"
                style="width: 100px"
              />
            </td>
            <td>
              {{ product.name }} <small>{{ product.school.name }}</small>
            </td>
            <td>
              <button @click="edit(product.id)">Edit</button>
              <button @click="del(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  name: "productsComponent",
  components: {
    VueCropper,
  },
  data() {
    return {
      over: false,
      school: "",
      name: "",
      description: "",
      category: "",
      sizes: [],
      products: [],
      schools: [],
      pedit: false,
      id: "",
      search: "",
      sku: "",
      image: null,
      sku: [],
      selsku: "",
      selschart: "",
      sizeCharts: [],

      imgSrc: "/assets/images/berserk.jpg",
      cropImg: "",
      data: null,
    };
  },
  created() {
    this.getProducts();
    this.getSchools();
    this.getSkus();
    this.getSizeCharts();
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(this.search.toLowerCase()) ||
          product.school.name
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
          product.category.toLowerCase().includes(this.search.toLowerCase()) ||
          product.description.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
    imageurl() {
      return URL.createObjectURL(this.image);
    },
  },
  watch: {
    // sort sizes in assending order
    sizes: {
      handler: function (val) {
        val.sort((a, b) => {
          return a.size - b.size;
        });
      },
      deep: true,
    },
  },

  methods: {
    close() {
      this.over = false;
      this.pedit = false;
      this.name = "";
      this.description = "";
      this.category = "";
      this.sizes = [];
      this.image = null;
      this.selsku = "";
      this.selschart = "";
      this.imgSrc = "/assets/images/berserk.jpg";
      this.cropImg = "";
      this.data = null;
    },

    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    flipX() {
      const dom = this.$refs.flipX;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleX(scale);
      dom.setAttribute("data-scale", scale);
    },
    flipY() {
      const dom = this.$refs.flipY;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleY(scale);
      dom.setAttribute("data-scale", scale);
    },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;

      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;

      this.$refs.cropper.setData(JSON.parse(this.data));
    },
    setImage(e) {
      const file = e.target.files[0];

      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.image = file;
    },

    imageCropped(image) {
      this.image = image;
      // console.log(this.image);
    },

    async remove(size) {
      this.sizes = this.sizes.filter((s) => s.size !== size);
    },

    addsize() {
      // check if size already exists in sizes array then update it
      const exists = this.sizes.find((s) => s.size === this.size);

      if (exists) {
        exists.price = this.price;
        exists.barcodeNumber =
          Number(this.barcodeNumber) + Number(exists.barcodeNumbe);
        this.size = "";
        this.price = "";
        this.barcodeNumber = "";
        return;
      }

      const size = {
        size: this.size,
        price: this.price,
        barcodeNumber: this.barcodeNumber,
      };
      this.sizes.push(size);
      this.size = "";
      this.price = "";
      this.barcodeNumber = "";
    },

    async getProducts() {
      const response = await this.axios
        .get("http://localhost:3000/superuser/products", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.products = res.data;
          // console.log(this.products);
        });
    },

    async getSkus() {
      await this.axios
        .get("http://localhost:3000/superuser/skus", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.sku = res.data;
        });

      // console.log(this.sku);
    },

    async getSizeCharts() {
      await this.axios
        .get("http://localhost:3000/superuser/sizecharts", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.sizeCharts = res.data;
        });
    },

    async getSchools() {
      const res = await this.axios
        .get("http://localhost:3000/superuser/schools", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.schools = res.data;
        });
    },

    filechange(e) {
      this.image = e.target.files[0];
    },

    async add() {
      const formData = new FormData();
      // formData.append('image', this.image);
      const blobBin = atob(this.cropImg.split(",")[1]);
      const array = [];
      for (let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      const file = new Blob([new Uint8Array(array)], { type: "image/png" });
      formData.append("image", file);
      formData.append("school", this.school);
      formData.append("sku", this.selsku);
      formData.append("sizechart", this.selschart);
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("category", this.category);
      formData.append("sizes", JSON.stringify(this.sizes));

      console.log(formData);

      const response = await this.axios.post(
        "http://localhost:3000/superuser/product",
        formData,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.data;
      if (data.status === "success") {
        this.getProducts();
        this.over = false;
        this.name = "";
        this.description = "";
        this.category = "";
        this.image = null;
        this.sizes = [];
      } else {
        alert(data.message);
      }

      this.over = false;
    },

    async edit(id) {
      this.pedit = true;
      this.over = true;
      this.id = id;

      const product = this.products.find((p) => p.id === id);
      // console.log(product);
      this.name = product.name;
      this.selsku = product.sku.sku;
      this.description = product.description;
      this.category = product.category;
      this.sizes = product.Productsize;
      this.school = product.school.name;
      this.selschart = product.sizeChart.name;
    },

    async commitedit() {
      const formData = new FormData();
      // formData.append('image', this.image);

      let file = null;
      if (this.cropImg) {
        const blobBin = atob(this.cropImg.split(",")[1]);
        const array = [];
        for (let i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
        }
        file = new Blob([new Uint8Array(array)], { type: "image/jpg" });
      }
      // const blobBin = atob(this.cropImg.split(",")[1]);
      // const array = [];
      // for (let i = 0; i < blobBin.length; i++) {
      //   array.push(blobBin.charCodeAt(i));
      // }
      // file = new Blob([new Uint8Array(array)], { type: "image/png" });
      formData.append("image", file);
      formData.append("school", this.school);
      formData.append("sku", this.selsku);
      formData.append("sizechart", this.selschart);
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("category", this.category);
      formData.append("sizes", JSON.stringify(this.sizes));
      // console.log(this.id);
      console.log(this.sizes);

      const response = await this.axios.post(
        "http://localhost:3000/superuser/ProductImage/" + this.id,
        formData,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await response.data;
      if (data.status === "success") {
        this.getProducts();
        this.over = false;
        this.name = "";
        this.description = "";
        this.category = "";
        this.image = null;
        this.sizes = [];
      } else {
        alert(data.message);
      }

      this.over = false;
    },

    async del(id) {
      const res = await this.axios.delete(
        "http://localhost:3000/superuser/product/" + id,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.status === "success") {
        this.getProducts();
      } else {
        alert(res.data.message);
      }
    },
  },
};
</script>

<style scoped>
.main {
  width: 75vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.form {
  padding-top: 1rem;
  justify-content: flex-start;

  height: 75%;
  width: 60vw;
  overflow-y: auto;
  margin-top: 10vh;
}

.sizes {
  width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.size {
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid black;
  margin: 1vw;
}

.input {
  height: fit-content;
}
/* textarea */
.input textarea {
  /* 5lines */
  height: 5em;
}

input[type="file"] {
  display: none;
}

.ccontent {
  margin-top: 2rem;
  width: 60vw;
  display: flex;
  justify-content: space-between;
}

.cropper-area {
  width: 50%;
}

.actions {
  margin-top: 1rem;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  height: 100px;
}

.preview-area {
  width: 307px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}

.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}

.cropped-image img {
  max-width: 100%;
}

.cropper-crop-box {
  width: 50%;
}

/* .search input[type="select"] {
  width: 30vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
} */

select {
  width: 50%;
  border-radius: 5px;
  border: 1px solid black;
  padding: 0.5rem;
  margin-top: 1rem;
}
</style>
