<template>
  <Player class="embedded" :src="videoUrl()" />
</template>

<script>
import Player from "@/components/Player.vue";
import storage from "../utils/storage";

export default {

  components: {
    Player
  },

  methods: {
    videoUrl() {
      let path = window.location.pathname;
      return storage.videoUrl(path.substring(path.lastIndexOf("/"), path.length) + "/video.mpd");
    }
  }

}
</script>

<style lang="scss">
  html, body {
    margin: 0;
    font-family: "Noto Sans CJK KR", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  .embedded {
    width: 100vw;
    height: 100vh;
  }
</style>