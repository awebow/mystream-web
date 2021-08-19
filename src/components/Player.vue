<template>
  <div
    class="video-wrapper"
    @mouseenter="() => this.hoverControls = true"
    @mousemove="() => this.lastMove = new Date().getMilliseconds()"
    @mouseleave="() => this.hoverControls = false">

    <video class="video-player"></video>
    <PlayerControl
      :player="player"
      :toggleFullscreen="toggleFullscreen"
      :hover="hoverControls"
      :lastMove="lastMove" />
  </div>
</template>

<script>
import PlayerControl from './PlayerControl';
import dashjs from 'dashjs';

export default {

  components: {
    PlayerControl
  },

  data: () => ({
    menu: null,
    qualities: [],
    player: dashjs.MediaPlayer().create(),
    hoverControls: false,
    lastMove: new Date().getTime()
  }),

  props: ['src', 'captions'],

  mounted() {
    this.player.on("canPlay", this.setObjectFit);
    this.player.initialize(this.$el.querySelector(".video-player"), this.$props.src, false);
  },

  methods: {
    toggleFullscreen() {
      if(document.fullscreenElement == this.$el)
        document.exitFullscreen();
      else
        this.$el.requestFullscreen();
    },

    setObjectFit() {
      var info = this.player.getBitrateInfoListFor("video")[0];
      var el = this.$el.querySelector(".video-player");
      if(Math.abs(el.clientHeight - info.height * el.clientWidth / info.width) <= 1)
        el.style.objectFit = "fill";
      else
        el.style.objectFit = null;
    }
  }

}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .video-wrapper {
    position: relative;
    display: flex;
    background-color: black;
  }

  .video-player {
    width: 100%;
    outline: none;
    position: relative;
    display: block;
    cursor: none;
  }
</style>