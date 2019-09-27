<template>
  <div :class="isVideoOrAudio==1?'vcs-video':'vcs-audio'" @mousemove="videoControlShowOrHidden">
    <video
      :class="['vcs-real-video',isVideoOrAudio==1?'':'not-show']"
      :src="theUrl"
      ref="vcsVideo"
      @play="onPlay"
      @pause="onPause"
      @loadedmetadata="onLoadedmetadata"
      @timeupdate="onTimeupdate"
    ></video>
    <div
      class="vcs-audio-control"
      :style="videoControlShow?'visibility:visible':'visibility:hidden'"
    >
      <i :class="playing?'vcs-pauseIcon':'vcs-playIcon'" @click="startPlayOrPause"></i>
      <div :class="isFullScreen?'vcs-video-fullscreen-progress':'vcs-video-progress'">
        <div class="vcsvp-seek-bar" @click="onSeekBarClick($event)" ref="vscVpSeekar">
          <div class="vcsvp-play-bar" :style="{width:sliderTime+'%'}">
            <div
              class="vcsvp-bar-point"
              @click="onbarPointClick($event)"
              @mousedown="onbarPointDgDown($event)"
            ></div>
          </div>
        </div>
      </div>
      <span class="vcs-audio-time">{{remainTime}} / {{maxTime}}</span>
      <div
        :class="[isFullScreen?'vcs-video-exitfullscreen':'vcs-video-fullscreen',isVideoOrAudio==1?'':'not-show']"
        @click="vscVideoFullScreen"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["url"],
  data() {
    return {
      theUrl: this.url,
      playing: false,
      maxTime: 0,
      currentTime: 0,
      sliderTime: 0,
      draging: false,
      isFullScreen: false,
      videoControlShow: true,
      isVideoOrAudio: null
    };
  },
  computed: {
    remainTime() {
      return this.formatTime(this.currentTime);
    }
  },
  created() {
    this.isVideoOrAudio =
      this.theUrl.match(/\.(ogv|mp4|rmvb|ogg|flv|avi|mpeg|)(\?.*)?$/) == null
        ? 2
        : 1;
  },
  mounted() {
    this.$nextTick(() => {
      this.videoControlShowOrHidden();
    });
  },
  methods: {
    videoControlShowOrHidden() {
      if (this.isVideoOrAudio == 1) {
        this.videoControlShow = true;
        setTimeout(() => {
          this.videoControlShow = false;
        }, 5000);
      }
    },
    formatTime(time) {
      let secondType = typeof time;
      let second = parseInt(time);
      if (secondType === "number" || secondType === "string") {
        var hours = Math.floor(second / 3600);
        second = second - hours * 3600;
        var mimute = Math.floor(second / 60);
        second = second - mimute * 60;
        return (
          hours +
          ":" +
          ("0" + mimute).slice(-2) +
          ":" +
          ("0" + second).slice(-2)
        );
      } else {
        return "0:00:00";
      }
    },
    startPlayOrPause() {
      this.playing ? this.pausePlay() : this.startPlay();
    },
    // 开始播放
    startPlay() {
      this.$refs.vcsVideo.play();
    },
    // 暂停
    pausePlay() {
      this.$refs.vcsVideo.pause();
    },
    // 当音频暂停
    onPause() {
      this.playing = false;
    },
    //音频播放时
    onPlay(res) {
      this.playing = true;
      this.loading = false;
      // if(!this.onlyOnePlaying){
      //   return
      // }
      let target = res.target;
      let video = document.getElementsByTagName("video");
      [...video].forEach(item => {
        if (item !== target) {
          item.pause();
        }
      });
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.currentTime / res.target.duration) * 100
      );
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.maxTime = this.formatTime(parseInt(res.target.duration));
    },
    // onended(res) {
    //   this.currentTime = 0;
    //   res.target.currentTime = 0;
    // },
    onSeekBarClick(e) {
      var left = this.$refs.vscVpSeekar.getBoundingClientRect().left;
      this.sliderTime = parseInt(
        ((e.clientX - left) / this.$refs.vscVpSeekar["clientWidth"]) * 100
      );
      this.$refs.vcsVideo.currentTime =
        (this.sliderTime / 100) * this.$refs.vcsVideo.duration;
    },
    onbarPointClick(e) {
      e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
    },
    onbarPointDgDown(e) {
      e.preventDefault();
      this.draging = true;
      window.addEventListener("mouseup", this.onDragEnd);
      window.addEventListener("mousemove", this.onDragging);
    },
    onDragEnd() {
      if (this.draging == true) {
        this.draging = false;
      }
      window.removeEventListener("mouseup", this.onDragEnd);
      window.removeEventListener("mousemove", this.onDragging);
    },
    onDragging(e) {
      if (this.draging) {
        var left = this.$refs.vscVpSeekar.getBoundingClientRect().left;
        if (e.clientX - left < this.$refs.vscVpSeekar["clientWidth"]) {
          this.onSeekBarClick(e);
        }
      }
    },
    vscVideoFullScreen() {
      var video = document.getElementsByClassName("vcs-video")[0];
      if (this.isFullScreen) {
        this.exitFullScreen();
      } else {
        this.requestFullScreen(video);
      }
      this.isFullScreen = !this.isFullScreen;
    },
    requestFullScreen(element) {
      var requestMethod =
        element.requestFullscreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
        //for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    exitFullScreen() {
      var exitMethod =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.webkitExitFullscreen;
      if (exitMethod) {
        exitMethod.call(document);
      } else if (typeof window.ActiveXObject !== "undefined") {
        //for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    }
  }
};
</script>
<style lang="scss">
@mixin inlineBlock {
  display: inline-block;
}
.vcs-video {
  position: relative;
  width: 500px;
  height: 400px;
}
.vcs-audio {
  position: relative;
  width: 500px;
  height: 48px;
}
.vcs-real-video {
  height: 100%;
  width: 100%;
  background: black;
}
.vcs-audio-control {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  line-height: 48px;
  vertical-align: middle;
  background: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  color: #fff;
  transition: 0.5s;
}
.vcs-playIcon {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  cursor: pointer;
  &:before {
    position: absolute;
    top: 1px;
    left: 8px;
    content: "";
    border: {
      width: 8px;
      style: solid;
      color: transparent transparent transparent #fff;
    }
  }
}
.vcs-pauseIcon {
  @extend .vcs-playIcon;
  &:before {
    top: 3px;
    width: 3px;
    height: 12px;
    border: none;
    background: #fff;
  }
  &:after {
    position: absolute;
    top: 3px;
    left: 14px;
    content: "";
    width: 3px;
    height: 12px;
    background: #fff;
  }
}
.vcs-video-progress {
  @include inlineBlock();
  width: 57%;
  vertical-align: middle;
  margin-left: 20px;
}
.vcs-video-fullscreen-progress {
  @extend .vcs-video-progress;
  width: 85%;
}
.vcsvp-seek-bar {
  cursor: pointer;
  width: 100%;
  height: 4px;
  background: #fff;
  vertical-align: middle;
}
.vcsvp-play-bar {
  position: relative;
  background: #ff1b82;
  width: 41%;
  height: 100%;
}
.vcsvp-bar-point {
  position: absolute;
  top: -3px;
  right: -9px;
  width: 5px;
  height: 5px;
  background: red;
  border-radius: 50%;
  border: 3px solid #fff;
}
.vcs-audio-time {
  display: inline-block;
  width: 110px;
  height: 100%;
  margin-left: 13px;
  text-align: center;
}
.vcs-video-fullscreen {
  @include inlineBlock();
  cursor: pointer;
  vertical-align: middle;
  position: relative;
  width: 20px;
  height: 20px;
  margin-left: 8px;
  border: 1px solid #fff;
  &::before {
    position: absolute;
    top: -11px;
    left: -1px;
    content: "↙";
    font-size: 13px;
  }
  &:after {
    position: absolute;
    top: -18px;
    left: 6px;
    content: "↗";
    font-size: 13px;
  }
}
.vcs-video-exitfullscreen {
  @extend .vcs-video-fullscreen;
  &:before {
    content: "↗";
  }
  &:after {
    content: "↙";
  }
}
.not-show {
  display: none;
}
</style>