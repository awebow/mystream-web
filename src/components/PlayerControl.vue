<template>
  <div
    class="player-control"
    ref="control"
    :class="{ hidden: playing && !visibility, fadeOut: playing && fadeOut }">

    <PlayerMenu class="video-settings" v-if="menu == 'settings'" :items="settingItems" />
    <PlayerMenu class="quality-settings" v-if="menu == 'quality'" :items="qualityItems()" />
    <PlayerMenu class="speed-settings" v-if="menu == 'speed'" :items="speedItems()" />

    <div class="control-bar">
      <SeekBar
        class="video-seek"
        v-model="seek"
        :max="duration"
        :graphs="[{begin: 0, end: seek + bufferLength}]"
        :onSeek="() => player.seek(seek)"
        :immediately="false" />
      <div class="bottom">
        <button type="button" @click="player.play()" v-if="!playing">
          <ion-icon name="play"></ion-icon>
        </button>
        <button type="button" @click="player.pause()" v-else>
          <ion-icon name="pause"></ion-icon>
        </button>
        <button type="button" @click="setMute(true)" v-if="!muted">
          <ion-icon name="volume-high"></ion-icon>
        </button>
        <button type="button" @click="setMute(false)" v-else>
          <ion-icon name="volume-mute"></ion-icon>
        </button>
        <SeekBar class="volume-bar" v-model="volume" :max="1" />
        <span class="current-time">{{ formatTime(seek) }}</span>
        <span class="time-divider">/</span>
        <span class="duration">{{ formatTime(duration) }}</span>

        <button type="button" class="settings" @click="toggleSettings">
          <ion-icon name="settings"></ion-icon>
        </button>

        <button type="button" @click="toggleFullscreen">
          <ion-icon name="scan"></ion-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerMenu from './PlayerMenu';
import SeekBar from './SeekBar.vue';

export default {
  data() {
    return {
      menu: null,
      settingItems: [
        {
          label: "화질",
          value: "자동",
          onClick: () => this.menu = "quality"
        },
        {
          label: "재생 속도",
          value: "1배속",
          onClick: () => this.menu = "speed"
        }
      ],

      visibility: true,
      fadeOut: false,
      visHandler: null,

      qualities: [],
      quality: "auto",
      speed: 1,

      ready: false,
      playing: false,
      muted: false,
      volume: 0.5,
      duration: 0,
      seek: 0,
      bufferLength: 0
    }
  },

  components: {
    PlayerMenu,
    SeekBar
  },

  props: {
    /** @type { import('@vue/runtime-core').PropType<import('dashjs').MediaPlayerClass> } */
    player: Object,
    toggleFullscreen: Function,
    hover: Boolean,
    lastMove: Number
  },

  mounted() {
    this.$props.player.on("manifestLoaded", this.menifestLoaded);
    this.$props.player.on("canPlay", this.canPlay);
    this.$props.player.on("playbackPlaying", this.playbackPlaying);
    this.$props.player.on("playbackPaused", this.playbackPaused);
    this.$props.player.on("playbackEnded", this.playbackEnded);
    this.$props.player.on("playbackTimeUpdated", this.playbackTimeUpdated);
    this.$props.player.on("bufferLevelUpdated", this.bufferLevelUpdated);
  },

  methods: {
    menifestLoaded(e) {
      for(let adapt of e.data.Period_asArray[0].AdaptationSet_asArray) {
        for(let rep of adapt.Representation_asArray) {
          if((adapt.mimeType != null && adapt.mimeType.split("/")[0] == "video")
            || (rep.mimeType != null && rep.mimeType.split("/")[0] == "video")) {
            this.qualities.push({
              width: rep.width,
              height: rep.height,
              frameRate: rep.frameRate,
              bitrate: rep.bandwidth
            })
          }
        }
      }
    },

    canPlay() {
      this.duration = this.$props.player.duration();
      this.$props.player.setVolume(this.volume);

      var arr = this.$props.player.getBitrateInfoListFor("video");
      for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < this.qualities.length; j++) {
          if(arr[i].bitrate == this.qualities[j].bitrate
            && arr[i].width == this.qualities[j].width
            && arr[i].height == this.qualities[j].height) {
              
              let temp = this.qualities[i];
              this.qualities[i] = this.qualities[j];
              this.qualities[j] = temp;
          }
        }
      }

      this.ready = true;
    },

    playbackPlaying() { this.playing = true; },
    playbackPaused() { this.playing = false; },
    playbackEnded() { this.playing = false; },
    playbackTimeUpdated(e) { this.seek = e.time; },
    bufferLevelUpdated() { this.bufferLength = this.$props.player.getBufferLength(); },

    qualityItems() {
      return [{
        label: "자동",
        selected: this.quality == "auto",
        onClick: () => this.setQuality("auto")
      }].concat(this.qualities.map((e, i) => ({
        label: this.qualityName(e),
        selected: this.quality == i,
        onClick: () => this.setQuality(i)
      })).reverse());
    },

    speedItems() {
      return [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25].map(e => ({
        label: `${e}배속`,
        selected: this.speed == e,
        onClick: () => this.speed = e
      }));
    },

    qualityName: quality => `${quality.width}×${quality.height}@${quality.frameRate}Hz`,
    
    toggleSettings() {
      if(this.menu == "settings" || this.menu == "quality" || this.menu == "speed")
        this.menu = null;
      else
        this.menu = "settings";
    },

    qualityChanged(quality) {
      this.quality = quality;
      this.settingItems[0].value = quality == "auto" ? "자동" : this.qualityName(this.qualities[quality]);
    },

    formatTime(value) {
      var integer = Math.floor(value);
      var hours = Math.floor(integer / 3600).toString().padStart(2, '0');
      var minutes = Math.floor(integer % 3600 / 60).toString().padStart(2, '0');;
      var seconds = Math.floor(integer % 60).toString().padStart(2, '0');;

      if(this.duration >= 3600)
        return `${hours}:${minutes}:${seconds}`;
      else
        return `${minutes}:${seconds}`;
    },

    setMute(value) {
      this.$props.player.setMute(value);
      this.muted = value;
    },

    toggleSettings() {
      if(this.menu == null)
        this.menu = "settings";
      else
        this.menu = null;
    },

    setQuality(quality) {
      this.$props.player.updateSettings({
        streaming: {
          abr: {
            autoSwitchBitrate: { video: quality == "auto" }
          }
        }
      });

      if(quality != "auto")
        this.$props.player.setQualityFor("video", quality, true);
      
      this.quality = quality;
    },

    show() {
      if(this.visHandler)
        clearTimeout(this.visHandler);
      
      this.visibility = true;
      this.fadeOut = false;
      this.visHandler = setTimeout(this.hide, 3000);
    },

    hide() {
      if(this.visHandler)
        clearTimeout(this.visHandler);

      this.visibility = true;
      this.fadeOut = true;
      this.visHandler = setTimeout(() => {
        this.visibility = false;
        this.fadeOut = false;
      }, 100);
    }
  },

  watch: {
    volume() {
      this.$props.player.setVolume(this.volume);
    },

    speed() {
      this.$props.player.setPlaybackRate(this.speed);
    },

    "$props.hover": function() {
      if(this.hover)
        this.show();
      else
        this.hide();
    },

    "$props.lastMove": function() {
      this.show();
    }
  }
}
</script>

<style lang="scss">
  .player-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: white;
    opacity: 1;

    background: linear-gradient(0deg, #000000AA 0%, #00000000 30%);

    &.hidden {
      display: none;
    }

    &.fadeOut {
      transition: opacity 0.1s;
      opacity: 0;
    }

    .control-bar {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      height: 45px;
      padding: 0 6px;

      .video-seek {
        width: 100%;
      }

      .bottom {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .current-time {
        margin-left: 8px;
      }

      .time-divider {
        margin: 0 6px;
      }

      .current-time, .time-divider, .duration {
        font-size: 14px;
      }

      .volume-bar {
        width: 72px;
        height: 3px;

        .progress::after {
          display: block;
          position: absolute;
          top: 50%;
          right: 0;

          transform: translate(50%, -50%);

          width: 12px;
          height: 12px;
          background: inherit;
          border-radius: 6px;
          
          content: "";
        }
      }

      button.settings {
        margin-left: auto;
      }
    }

    button {
      display: flex;
      align-items: center;
      background: none;
      outline: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      color: white;
    }
  }
</style>