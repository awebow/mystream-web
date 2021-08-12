<template>
  <div class="seekbar" @mousedown="mouseDown">
    <div class="graph" v-for="g in graphs" :style="{
      left: valueToPercent(g.begin),
      width: valueToPercent(g.end - g.begin)
    }"></div>

    <div class="progress" :style="{ width: progressWidth() }"></div>
  </div>
</template>

<script>
export default {

  props: {
    modelValue: Number,
    max: Number,
    onSeek: Function,
    immediately: {
      type: Boolean,
      default: true
    },
    graphs: {
      type: Array,
      default: []
    }
  },

  data: () => ({
    seeking: false,
    seekingValue: 0,
  }),

  mounted() {
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
  },

  unmounted() {
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mouseup", this.mouseUp);
  },

  methods: {
    /** @param {MouseEvent} e */
    mouseDown(e) {
      this.seeking = true;
      this.onMouse(e);
    },

    /** @param {MouseEvent} e */
    mouseMove(e) {
      if(!this.seeking)
        return;

      e.preventDefault();
      this.onMouse(e);
    },

    /** @param {MouseEvent} e */
    mouseUp(e) {
      if(!this.seeking)
        return;

      this.seeking = false;
      this.onMouse(e);

      //let value = e.target.
      this.$emit("update:modelValue", this.seekingValue);

      if(this.$props.onSeek)
        this.$props.onSeek();
    },

    onMouse(e) {
      var rect = this.$el.getBoundingClientRect();
      this.seekingValue = Math.min(Math.max((e.x - rect.x) / rect.width * this.$props.max, 0), this.$props.max);

      if(this.$props.immediately)
        this.$emit("update:modelValue", this.seekingValue);
    },

    progressWidth() {
      if(this.seeking)
        return this.valueToPercent(this.seekingValue);
      
      return this.valueToPercent(this.$props.modelValue);
    },

    valueToPercent(value) {
      if(this.$props.max == 0)
        return "0";
      
      return (value / this.$props.max * 100) + "%";
    }
  },

  /*watch: {
    '$props.modelValue': function() {
      console.log(this.$props.modelValue);
    }
  }*/

}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .seekbar {
    position: relative;
    background-color: #ffffff33;
    height: 5px;
    cursor: pointer;

    .graph {
      position: absolute;
      height: 100%;
      background-color: #ffffff66;
    }

    .progress {
      position: relative;
      height: 100%;
      background-color: $theme-blue;
      pointer-events: none;
    }
  }
</style>