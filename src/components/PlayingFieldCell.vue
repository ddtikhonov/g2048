<template>
  <div
    v-if="value"
    :ref="'cellContainer' + cell.id"
    :class="['cell-container', cell.isAnimating ? 'animating' : '']"
    :style="'top:' + xCoordinate + 'px;left:' + yCoordinate + 'px;'"
  >
    <div class="cell-aligner">
      <div class="cell">
        <span class="number" :data="JSON.stringify(cell)">
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
    cell: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    xCoordinate() {
      return this.cell.xCoordinateCurrent * 98.5;
    },
    yCoordinate() {
      return this.cell.yCoordinateCurrent * 98.5;
    },
    value() {
      return this.cell.currentValue;
    }
  },
}
</script>

<style lang="scss" scoped>
@import "./src/assets/css/playing-field-cell-style";
</style>
