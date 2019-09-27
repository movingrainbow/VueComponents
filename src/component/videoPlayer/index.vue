<template>
  <div class="vcs-video-content">
    <vcsVideo :url="theUrl"></vcsVideo>
  </div>
</template>
<script>
import vcsVideo from "./vcs-video.vue";
export default {
  props: ["url"],
  components: { vcsVideo },
  data() {
    return {
      theUrl: this.url || ""
    };
  }
};
</script>
<style lang="scss">
</style>