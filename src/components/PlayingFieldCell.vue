<template>
  <div class="cell-container">
    <div class="cell-aligner">
      <div v-if="value" class="cell">
        <span class="number">
          {{ value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayingFieldCell',
  props: {
    value: {
      type: Number,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/assets/css/playing-field-cell-style";
</style>