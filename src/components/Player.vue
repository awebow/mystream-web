<template>
  <div class="video-wrapper" @mouseenter="mouseenter()" @mouseleave="mouseleave()">
    <video class="video-player video-js" controls>
      <source :src="src" type="application/dash+xml" />
      <track kind="captions" v-if="captions" :src="captions" default />
    </video>
  </div>
</template>

<script>
import { createApp } from 'vue';
import videojs from 'video.js';
import PlayerControl from './PlayerControl';
import 'videojs-contrib-quality-levels';
import axios from 'axios';

export default {

  data: () => ({
    menu: null,
    qualities: [],
    player: null
  }),

  props: ['src', 'captions'],

  mounted() {
    axios.get(this.$props.src).then((res) => {
      var mpd = new DOMParser().parseFromString(res.data, 'text/xml');
      var representations = mpd.getElementsByTagName("Representation");
      for(var i = 0; i < representations.length; i++) {
        if(representations[i].getAttribute("mimeType") == "video/mp4"
          || representations[i].parentElement.getAttribute("mimeType") == "video/mp4") {

          this.qualities.push({
            width: parseInt(representations[i].getAttribute("width")),
            height: parseInt(representations[i].getAttribute("height")),
            frameRate: parseFloat(representations[i].getAttribute("frameRate"))
          });
        }
      }

      this.player = videojs(this.$el.querySelector('.video-player'), {
        html5: {
          nativeTextTracks: false,
          vhs: {
            limitRenditionByPlayerDimensions: false
          }
        }
      });

      var controlApp = document.createElement('div');
      this.$el.querySelector('.video-player').append(controlApp);
      var vm = createApp(PlayerControl, {
        qualities: this.qualities,
        setQuality: quality => {
          var qualityLevels = this.player.qualityLevels();
          for(var i = 0; i < qualityLevels.length; i++) {
            //console.log(i);
            qualityLevels[i].enabled = quality == 'auto' || quality == i;
          }
          vm.qualityChanged(quality);
        },

        setSpeed: speed => {
          this.player.playbackRate(speed);
          vm.speedChanged(speed);
        }
      }).mount(controlApp);

      var playIcon = this.addIcon(".vjs-play-control .vjs-icon-placeholder", "play");
      var volumeIcon = this.addIcon(".vjs-mute-control .vjs-icon-placeholder", "volume-high");
      this.addIcon(".vjs-fullscreen-control .vjs-icon-placeholder", "scan");
      this.addButton("settings", () => vm.toggleSettings());
      
      this.player.on('play', () => {playIcon.setAttribute("name", "pause")});
      this.player.on('pause', () => {playIcon.setAttribute("name", "play")});
      this.player.on('volumechange', () => {
        volumeIcon.setAttribute("name", this.player.muted() ? "volume-mute" : "volume-high")
      });

      this.player.ready(() => {
        this.player.textTrackSettings.setValues({
          backgroundOpacity: "0",
          edgeStyle: "uniform",
          fontFamilty: "Noto Sans CJK KR"
        });
        this.player.textTrackSettings.updateDisplay();

        var qualityLevels = this.player.qualityLevels();
        qualityLevels.on('addqualitylevel', (event) => {
          console.log(event);
        });
      });
    });
  },

  methods: {
    addIcon(selector, name) {
        var parent = this.$el.querySelector(selector);
        var icon = document.createElement("ion-icon");
        icon.setAttribute("name", name);
        parent.append(icon);

        return icon;
      },

      addButton(iconName, onClick) {
        var parent = document.querySelector(".vjs-custom-control-spacer");
        var button = document.createElement("button");
        button.classList.add("vjs-button");

        var icon = document.createElement("ion-icon");
        icon.setAttribute("name", iconName);
        button.append(icon);
        button.addEventListener('click', onClick);

        parent.append(button);
      },

      mouseenter() {
        if(this.player != null && this.player.hasStarted())
          this.player.userActive(true);
      },

      mouseleave() {
        if(this.player != null && this.player.hasStarted()) {
          this.player.userActive(false);
          this.player.userActivity_ = false;
        }
      }
  }

}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .video-wrapper {
    position: relative;
  }

  .vjs-loading-spinner {
    display: none;
  }

  .vjs-big-play-button {
    display: none;
  }

  .vjs-error-display, .vjs-text-track-settings {
    display: none;
  }

  .vjs-control-bar {
    $seekbar_height: 5px;

    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    height: 40px + $seekbar_height;
    display: flex;
    align-items: center;
    z-index: 10;
    padding: $seekbar_height 6px 0 6px;
    padding-top: $seekbar_height;
    user-select: none;

    .vjs-button {
      padding: 0 6px;
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
      display: flex;
    }

    .vjs-icon-placeholder {
      display: flex;
    }

    .vjs-control {
      display: none;
    }

    .vjs-time-control {
      display: none;
    }

    .vjs-play-control {
      display: block;
    }

    .vjs-volume-panel {
      display: flex;

      .vjs-mute-control {
        display: block;
      }

      .vjs-volume-control {
        display: flex;
        width: 72px;
        cursor: pointer;

        align-items: center;

        $bar-height: 3px;

        .vjs-volume-tooltip {
          display: none;
        }

        .vjs-volume-bar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;

          &::after {
            display: block;
            flex: 1;
            height: $bar-height;
            background: #ffffff99;
            content: "";
          }
        }

        .vjs-volume-level {
          width: 100%;
          height: $bar-height;
          background: $theme-blue;
          position: relative;

          &::after {
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
      }
    }

    .vjs-progress-control {
      display: block;
      position: relative;
      height: $seekbar_height;
      background: #ffffff33;
      position: absolute;
      top: 0;
      left: 8px;
      right: 8px;
      cursor: pointer;

      .vjs-progress-holder > * {
        position: absolute;
        top: 0;
        bottom: 0;
      }

      .vjs-load-progress {
        background: #ffffff66;
      }

      .vjs-play-progress {
        background: $theme-blue;
        position: absolute;
        top: 0;
        bottom: 0;

        .vjs-time-tooltip {
          display: none;
        }
      }

      &:hover .vjs-mouse-display {
        display: block;
      }

      .vjs-mouse-display {
        display: none;
        pointer-events: none;

        .vjs-time-tooltip {
          width: 52px;
          margin-left: -26px;
          transform: translateY(-28px);
          text-align: center;
          color: white;
        }
      }
    }

    .vjs-current-time, .vjs-time-divider, .vjs-duration {
      display: block;
      color: white;
      font-size: 14px;

      .vjs-control-text {
        height: 0;
      }
    }
    
    .vjs-current-time {
      margin-left: 16px;
    }

    .vjs-time-divider {
      margin: 0 4px;
    }

    .vjs-custom-control-spacer {
      display: flex;
      margin-left: auto;
      align-items: center;
    }

    .vjs-fullscreen-control {
      display: block;
    }

    ion-icon {
      color: white;
      font-size: 24px;
      pointer-events: none;
    }
  }

  .vjs-control-text {
    display: block;
    width: 1px;
    height: 1px;
    overflow: hidden;
    color: transparent;
  }

  video.video-player {
    display: none;
  }

  .video-player {
    width: 100%;
    height: auto;
    outline: none;
    position: relative;
    display: flex;
    align-items: center;

    &::after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(0deg, #000000AA 0%, #00000000 30%);
      content: "";
    }

    &.vjs-user-inactive {
      &::after, .vjs-control-bar {
        display: none;
      }

      &:fullscreen {
        cursor: none;
      }
    }

    video {
      width: 100%;
    }

    .vjs-text-track-display {
      background-color: transparent;
    }
  }
</style>