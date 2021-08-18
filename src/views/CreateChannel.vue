<template>
  <form class="create-channel mystream-form">
    <h1>채널 생성</h1>
    <button type="button" class="upload-picture" @click="$el.querySelector('input').click()">
      <img :src="pictureSrc" />
      <input type="file" @change="fileSelected" />
    </button>
    <input type="text" placeholder="채널명" v-model="form.name" maxlength="100" />
    <textarea class="textfield" placeholder="채널 설명" v-model="form.description"></textarea>
    <button type="button" class="blue-btn" :disabled="form.name.length == 0" @click="createChannel">생성</button>
  </form>
</template>

<script>
import default_pic_ch from "@/assets/default_pic_ch.svg";
import api from '../utils/api';
import autosize from "autosize";

export default {

  data: () => ({
    form: {
      name: "",
      description: ""
    },
    uploadPicture: null
  }),

  mounted() {
    autosize(this.$el.querySelector("textarea"));
  },

  beforeUnmount() {
    autosize.destroy(this.$el.querySelector("textarea"));
  },

  methods: {
    fileSelected(e) {
      this.uploadPicture = e.target.files[0];
    },

    createChannel() {
      api.post("/channels", this.form).then(res => {
        var id = res.data.id;
        if(this.uploadPicture == null) {
          window.location.href = `/channels/${id}`;
          return;
        }

        var form = new FormData();
        form.append("file", this.uploadPicture);
        api.put(`/channels/${id}/picture`, form).then(() => {
          window.location.href = `/channels/${id}`;
        });
      });
    }
  },

  computed: {
    pictureSrc() {
      return this.uploadPicture == null ? default_pic_ch : URL.createObjectURL(this.uploadPicture);
    }
  }

}
</script>

<style lang="scss">
  @import "../stylesheets/form.scss";

  .create-channel {
    .upload-picture {
      width: 128px;
      height: 128px;
      cursor: default;

      background: none;
      padding: 0;
      margin: 16px auto;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
        object-fit: cover;
      }

      input[type=file] {
        display: none;
      }
    }
  }
</style>