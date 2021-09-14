<template>
  <div
    class="video-wrapper"
    tabindex="0"
    @mouseenter="() => this.hoverControls = true"
    @mousemove="() => this.lastMove = new Date().getMilliseconds()"
    @mouseleave="() => this.hoverControls = false"
    @click="$refs.control.onVideoClick"
    @keydown="$refs.control.onKeyDown">

    <video class="video-player"></video>
    <PlayerControl ref="control"
      :player="player"
      :toggleFullscreen="toggleFullscreen"
      :hover="hoverControls"
      :lastMove="lastMove" />
  </div>
</template>

<script>
import PlayerControl from './PlayerControl';
import dashjs from 'dashjs';
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

export default {

  components: {
    PlayerControl
  },

  data: () => ({
      menu: null,
      qualities: [],
      player: dashjs.MediaPlayer().create(),
      hoverControls: false,
      lastMove: new Date().getTime(),
      /** @type {ResizeObserver} */
      resizeObserver: null
    }),

  props: {
    src: String,
    embedded: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    let playerEl = this.$el.querySelector(".video-player");

    this.player.on("canPlay", this.setObjectFit);
    this.player.updateSettings({
      streaming: {
        buffer: {
          stableBufferTime: 15
        }
      }
    });
    this.player.initialize(playerEl, this.$props.src, false);

    const ResizeObserver = window.ResizeObserver || Polyfill;
    this.resizeObserver = new ResizeObserver(this.setObjectFit);
    this.resizeObserver.observe(playerEl);
  },

  unmounted() {
    this.player.reset();
    this.resizeObserver.disconnect();
  },

  methods: {
    toggleFullscreen() {
      if(document.fullscreenElement == this.$el)
        document.exitFullscreen();
      else
        this.$el.requestFullscreen();
    },

    setObjectFit() {
      var infoList = this.player.getBitrateInfoListFor("video");
      var info = infoList[infoList.length - 1 ];
      var el = this.$el.querySelector(".video-player");
      
      if(this.$props.embedded) {
        if(Math.abs(el.clientHeight - info.height * el.clientWidth / info.width) <= 1)
          el.style.objectFit = "fill";
        else
          el.style.objectFit = null;
      }
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
    outline: none;
    user-select: none;
  }

  .video-player {
    width: 100%;
    outline: none;
    position: relative;
    display: block;
    cursor: none;
  }
</style>