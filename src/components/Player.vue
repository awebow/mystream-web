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
    this.player.initialize(this.$el.querySelector(".video-player"), this.$props.src, false);
  },

  methods: {
    toggleFullscreen() {
      if(document.fullscreenElement == this.$el)
        document.exitFullscreen();
      else
        this.$el.requestFullscreen();
      }
  }

}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .video-wrapper {
    position: relative;
    display: flex;
  }

  .video-player {
    width: 100%;
    outline: none;
    position: relative;
    display: block;
    cursor: none;
  }
</style>