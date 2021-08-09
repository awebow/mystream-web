<template>
  <div class="textbox" contenteditable="true"
    role="textbox" :aria-label="placeholder"
    @input="updateValue"></div>
</template>

<script>
export default {

  data: () => ({
    text: ""
  }),

  props: {
    placeholder: String,
    modelValue: {
      type: String,
      default: ""
    }
  },

  emits: ["update:modelValue"],

  mounted() {
    this.updateContent();
  },

  methods: {
    updateValue(e) {
      var children = e.target.childNodes;
      if(children.length == 1 && children[0].textContent == "")
        e.target.innerHTML = "";

      var text = "";
      for(let i = 0; i < children.length; i++) {
        if(i > 0)
          text += "\n";
        
        text += children[i].textContent;
      }

      this.text = text;
      this.$emit("update:modelValue", text);
    },

    
    updateContent() {
      if(this.modelValue == "")
        return "";

      var html = "";
      var lines = this.modelValue.split('\n');
      for(let l of lines) {
        if(l == '')
          html += "<div><br /></div>"
        else
          html += `<div>${l}</div>`;
      }

      this.$el.innerHTML = html;
    }
  },

  watch: {
    modelValue(value) {
      if(value != this.text) {
        this.updateContent();
      }
    }
  }
}
</script>

<style lang="scss">
  .textbox:empty::before {
    pointer-events: none;
    content: attr(aria-label);
    display: block;
  }
</style>