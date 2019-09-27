<template>
  <div>
    <div class="vcs-videoplayer">
      <videoPlay v-show="value=='1'" :url="'static/media/movie.ogv'"></videoPlay>
      <videoPlay v-show="value=='2'" :url="'static/media/SleepAway.mp3'"></videoPlay>
    </div>
    <div>
      <select v-model="value">
        <option value="1">视频</option>
        <option value="2">音频</option>
      </select>
    </div>
  </div>
</template>
<script>
import videoPlay from "../component/videoPlayer/index.vue";
export default {
  components: {
    videoPlay
  },
  data() {
    return {
      value: "1"
    };
  }
};
</script>
<style lang="scss">
.vcs-videoplayer {
  height: 400px;
}
</style>