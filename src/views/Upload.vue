<template>
  <form class="upload-form mystream-form">
      <input type="text" placeholder="제목" v-model="title" maxlength="100" />
      <TextBox class="textfield" placeholder="설명" v-model="description"></TextBox>
      <div class="video-file">
        <div class="file-name field" :class="{ 'no-file': file == null }">{{ fileLabel() }}</div>
        <button type="button" class="gray-btn"
          @click="$refs.file.click()" :disabled="uploading" >파일 선택</button>
        <input id="upload-video" type="file" ref="file"
          accept=".avi,.mp4,.mkv,.mov,.wmv"
          @change="fileSelected" />
      </div>
      <button type="button" class="blue-btn"
        @click="uploadVideo" :disabled="uploadDisabled">업로드</button>

      <div class="upload-progress" role="progressbar" v-if="uploading"
        aria-valuemin="0" aria-valuemax="100" :aria-valuenow="progress">
        <div class="progress" :style="{ width: progress + '%' }"></div>
        <div class="label">{{ progressText }}</div>
      </div>
  </form>
</template>

<script>
import api from '../utils/api'
import * as tus from "tus-js-client";
import TextBox from '../components/TextBox.vue';

export default {

  components: { TextBox },

  data: () => ({
    title: "",
    description: "",
    file: null,
    uploading: false,
    progress: 0
  }),

  methods: {
    async uploadVideo() {
        try {
          this.uploading = true;
          let res = await api.post("/videos", {
            channel_id: this.$route.params.id,
            title: this.title,
            description: this.description
          });

          let upload = new tus.Upload(this.file, {
            endpoint: `${process.env.VUE_APP_ENCODER_URL}/videos/`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
              filename: this.file.name,
              filetype: this.file.type,
            },
            headers: {
              "Authorization": "Bearer " + res.data.token
            },
            onError: function(error) {
              console.log("Failed because: " + error)
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              this.progress = bytesUploaded / bytesTotal * 100;
              /*var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
              console.log(bytesUploaded, bytesTotal, percentage + "%")*/
            },
            onSuccess: () => this.$router.push(`/videos/${res.data.id}`)
        });

        upload.start();
      } catch(err) {
          console.log(err);
          this.uploading = false;
      }
    },

    fileLabel() {
      if(this.file == null)
        return "선택된 파일이 없습니다.";
      
      return this.file.name;
    },

    fileSelected(e) {
      this.file = e.target.files[0];
    }
  },

  computed: {
    progressText() {
      return Math.round(this.progress) + "%";
    },

    uploadDisabled() {
      return this.title.length == 0 || this.file == null || this.uploading;
    }
  }
}
</script>

<style lang="scss">
  @import "../stylesheets/form.scss";
  @import "../stylesheets/colors.scss";

  .upload-form {
    .video-file {
      display: flex;
      position: relative;

      .file-name {
        flex: 1;
        display: flex;
        align-items: center;
        margin: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        font-size: 14px;

        &.no-file {
          color: $text-light-grey;
        }
      }

      button {
        width: 84px;
        margin: 0;
        border: 1px solid #c7c7c7;
        border-left: none;
        border-start-start-radius: 0;
        border-end-start-radius: 0;
        /*position: absolute;
        top: 0;
        right: 0;
        margin: 0;*/
      }

      input {
        display: none;
      }
    }

    .upload-progress {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 18px;

      .progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: $theme-blue;
        border-radius: 9px;
      }

      .label {
        z-index: 10;
        color: white;
        text-shadow: 0 0 3px #000000;
        font-size: 14px;
      }
    }
  }
</style>