<template>
  <div class="NumberkeyBoard" ref="NumberkeyBoard" :style="NumberkeyBoardStyle">
    <div class="keyBoard" @mousedown="BoardNumberKeyDown($event)" @click="BoardNumberClick($event)">
      <div
        v-html="number"
        class="numberTD"
        v-for="(number,index) in keyNumberArr"
        :key="index"
      >{{number}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyNumberArr: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, ".", "&#8592;"],
      NumberkeyBoardStyle: "display:none",
      inputTarget: null
    };
  },
  mounted() {
    let $this = this;
    let inputElement = document.getElementsByTagName("input");
    [...inputElement].forEach(ipele => {
      ipele.addEventListener("focus", function(e) {
        $this.inputTarget = e.target;
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        let scrollLeft =
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft;
        $this.NumberkeyBoardStyle =
          "top:" +
          (e.target.getBoundingClientRect().top +
            scrollTop +
            e.target.offsetHeight) +
          "px;left:" +
          (e.target.getBoundingClientRect().left +
            scrollLeft +
            e.target.offsetWidth) +
          "px";
      });
      ipele.addEventListener("blur", function(e) {
        $this.inputTarget = null;
        $this.NumberkeyBoardStyle = "display:none";
      });
    });
  },
  methods: {
    //阻止input失去焦点
    BoardNumberKeyDown(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue = false;
        return false;
      }
    },
    BoardNumberClick(e) {
      let inputTarget = this.inputTarget;
      let Pointstart = inputTarget.selectionStart;
      let PointEnd = inputTarget.selectionEnd;
      let wordLength = inputTarget.value.length;
      if (e.target.className == "numberTD" && e.target.innerText != "←") {
        inputTarget.value =
          inputTarget.value.slice(0, Pointstart) +
          e.target.innerText +
          inputTarget.value.slice(PointEnd, wordLength);
        //一个小数点和开头不能有小数点
        inputTarget.value = inputTarget.value.replace(/^\./g, "");
        inputTarget.value = inputTarget.value
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        inputTarget.selectionStart = Pointstart + 1;
        inputTarget.selectionEnd = Pointstart + 1;
        //让光标显示在input可视区域
        inputTarget.blur();
        inputTarget.focus();
      } else if (
        e.target.className == "numberTD" &&
        e.target.innerText == "←" &&
        //PointEnd==0时会复制整个input的value
        PointEnd != 0
      ) {
        inputTarget.value =
          inputTarget.value.slice(0, Pointstart - 1) +
          inputTarget.value.slice(PointEnd, wordLength);
        inputTarget.selectionStart = Pointstart - 1;
        inputTarget.selectionEnd = Pointstart - 1;
        //让光标显示在input可视区域
        inputTarget.blur();
        inputTarget.focus();
      }
    }
  }
};
</script>
<style lang="scss">
.NumberkeyBoard {
  position: fixed;
  width: 165px;
}
.keyBoard {
  width: 165px;
  background: #000000;
}
.numberTD {
  display: inline-block;
  width: 43px;
  height: 35px;
  color: #fff;
  line-height: 35px;
  text-align: center;
  background: black;
  border: 1px solid #6f6e6f;
  box-shadow: 0px 0px 2px 2px #fff;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background: #e860ff;
  }
  &:active {
    transform: scale(0.8);
  }
}
</style>