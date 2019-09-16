<template>
  <div>
    <input type="text" />
    <br />
    <input type="text" />
    <numberKeyBoard></numberKeyBoard>
  </div>
</template>
<script>
import numberKeyBoard from "../component/numberKeyBoard/index.vue";
export default {
  data() {
    return {};
  },
  components: { numberKeyBoard }
};
</script>
<style lang="scss">
</style>