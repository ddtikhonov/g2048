<template>
  <div
    ref="playingFieldWrapper"
    class="playing-field-wrapper"
    tabindex="0"
    @keyup.up="makeMoveUp"
    @keyup.down="makeMoveDown"
    @keyup.left="makeMoveLeft"
    @keyup.right="makeMoveRight"
  >
    <div class="playing-field-container">
      <div class="controls-block">
        <div class="controls-item up-btn">
            <span
                class="control-btn shift-up-btn"
                @click="makeMoveUp">UP</span>
        </div>
        <div class="controls-item down-btn">
            <span
                class="control-btn shift-down-btn"
                @click="makeMoveDown">DOWN</span>
        </div>
        <div class="controls-item left-btn">
            <span
                class="control-btn shift-left-btn"
                @click="makeMoveLeft">LEFT</span>
        </div>
        <div class="controls-item right-btn">
            <span
                class="control-btn shift-right-btn"
                @click="makeMoveRight">RIGHT</span>
        </div>

        <div class="playing-field">
          <template v-for="row in cells">
            <div v-for="cell in row" :key="cell.id" class="playing-field-cell"></div>
          </template>
        </div>

        <div class="numbers-field-wrapper">
          <div class="numbers-field">
            <template v-for="row in cells">
              <template v-for="cell in row">
                <PlayingFieldCell :key="cell.id" :cell="cell"></PlayingFieldCell>
              </template>
            </template>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PlayingField',
  components: { PlayingFieldCell: () => import("./PlayingFieldCell") },
  data() {
    return {
      userMoveMutex: false,
    }
  },
  computed: {
    ...mapGetters('field', {
      cells: 'getCells',
      empty: 'getEmptyCells',
      fieldSize: 'getFieldSize',
      column: 'getColumn',
      row: 'getRow',
    }),
  },
  created() {
    this.newGame();
  },
  mounted() {
    this.$refs.playingFieldWrapper.focus();
  },
  methods: {
    //
    // method starts a new game: generates two random cells
    //
    newGame() {
      this.$store.dispatch('field/initNewGame');
    },
    //
    // generates one random cell
    //
    rand() {
      this.$store.dispatch('field/generateRandomNumber');
    },
    //
    // method checks the possibility for shift in row
    //
    canMakeShift(list) {
      for ( let i = 0; i < list.length; i++ ) {
        if ( list[i + 1] !== undefined) {
          if (
              list[i].value === 0 &&
              list[i + 1].value !== 0) {
            return true;
          } else if (
              list[i].value !== 0 &&
              list[i].value === list[i + 1].value &&
              !list[i].changed &&
              !list[i + 1].changed
          ) {
            return true;
          }
        }
      }
      return false;
    },
    //
    // method checks the possibility for another move
    //
    canMakeStep() {
      //
      // firstly simple check - for empty fields
      //
      if (this.empty.length > 0 ) {
        return true;
      }

      for (let index = 0; index < this.fieldSize; index++) {
        if (this.canMakeShift(this.row(index))) {
          return true;
        }

        if (this.canMakeShift(this.row(index).reverse())) {
          return true;
        }

        if (this.canMakeShift(this.column(index))) {
          return true;
        }

        if (this.canMakeShift(this.column(index).reverse())) {
          return true;
        }
      }

      return false;
    },
    //
    // computes changes for column/row
    //
    shift(coordinate, isVertical, isReversed) {
      let isChanged = true;
      let changeCnt = 0;
      isVertical = typeof isVertical === 'undefined' ? true : isVertical;
      isReversed = typeof isReversed === 'undefined' ? false : isReversed;

      let cellsList = isVertical
          ? this.column(coordinate)
          : this.row(coordinate);

      cellsList = isReversed ? cellsList.reverse() : cellsList;

      while(isChanged) {
        isChanged = false;

        for ( let i = 0; i < cellsList.length; i++ ) {
          if ( cellsList[i + 1] !== undefined) {
            if (
                cellsList[i].value === 0 &&
                cellsList[i + 1].value !== 0
            ) {
              this.$store.commit('field/setSingleCell', {
                id: cellsList[i].id,
                value: cellsList[i + 1].value,
                prevValue: cellsList[i + 1].prevValue,
                nextValue: cellsList[i + 1].nextValue,
                xCoordinateFrom:
                    cellsList[i + 1].xCoordinateFrom === null
                        ? cellsList[i + 1].xCoordinateDefault
                        : cellsList[i + 1].xCoordinateFrom,
                yCoordinateFrom:
                    cellsList[i + 1].yCoordinateFrom === null
                      ? cellsList[i + 1].yCoordinateDefault
                      : cellsList[i + 1].yCoordinateFrom,
                xCoordinateTo: cellsList[i].xCoordinateDefault,
                yCoordinateTo: cellsList[i].yCoordinateDefault,
              });

              this.$store.commit('field/setSingleCell', {
                id: cellsList[i + 1].id,
                value: 0,
                prevValue: 0,
                nextValue: 0,
                xCoordinateFrom: null,
                yCoordinateFrom: null,
                xCoordinateTo: null,
                yCoordinateTo: null,
              });

              isChanged = true;
              changeCnt++;
            } else if (
                cellsList[i].value !== 0 &&
                cellsList[i].value === cellsList[i + 1].value &&
                !cellsList[i].changed &&
                !cellsList[i + 1].changed
            ) {
              this.$store.commit('field/setSingleCell', {
                id: cellsList[i].id,
                value: cellsList[i].value,
                prevValue: cellsList[i].value,
                nextValue: cellsList[i].value * 2,
                changed: true,
                xCoordinateFrom: null,
                yCoordinateFrom: null,
                xCoordinateTo: null,
                yCoordinateTo: null,
              });

              this.$store.commit('field/setSingleCell', {
                id: cellsList[i + 1].id,
                value: 0,
                prevValue: cellsList[i + 1].value,
                nextValue: 0,
                xCoordinateFrom:
                    cellsList[i + 1].xCoordinateFrom === null
                        ? cellsList[i + 1].xCoordinateDefault
                        : cellsList[i + 1].xCoordinateFrom,
                yCoordinateFrom:
                    cellsList[i + 1].yCoordinateFrom === null
                        ? cellsList[i + 1].yCoordinateDefault
                        : cellsList[i + 1].yCoordinateFrom,
                xCoordinateTo: cellsList[i].xCoordinateDefault,
                yCoordinateTo: cellsList[i].yCoordinateDefault,
              });

              isChanged = true;
              changeCnt++;
            }
          }
        }
      }
      return changeCnt;
    },
    //
    // user action - move up
    //
    makeMoveUp() {
      if (this.userMoveMutex) {
        return;
      }
      this.userMoveMutex = true;

      let changeCnt = 0;
      for (let colCnt = 0; colCnt < this.fieldSize; colCnt++) {
        const tmp = this.shift(colCnt, true);

        if (tmp > changeCnt) {
          changeCnt = tmp;
        }
      }
      if (changeCnt !== 0) {
        this.nextStep();
      } else {
        this.userMoveMutex = false;
      }
    },
    //
    // user action - move down
    //
    makeMoveDown() {
      if (this.userMoveMutex) {
        return;
      }
      this.userMoveMutex = true;

      let changeCnt = 0;
      for (let colCnt = 0; colCnt < this.fieldSize; colCnt++) {
        const tmp = this.shift(colCnt, true, true);

        if (tmp > changeCnt) {
          changeCnt = tmp;
        }
      }
      if (changeCnt !== 0) {
        this.nextStep();
      } else {
        this.userMoveMutex = false;
      }
    },
    //
    // user action - move left
    //
    makeMoveLeft() {
      if (this.userMoveMutex) {
        return;
      }
      this.userMoveMutex = true;

      let changeCnt = 0;
      for (let colCnt = 0; colCnt < this.fieldSize; colCnt++) {
        const tmp = this.shift(colCnt, false, false);

        if (tmp > changeCnt) {
          changeCnt = tmp;
        }
      }
      if (changeCnt !== 0) {
        this.nextStep();
      } else {
        this.userMoveMutex = false;
      }
    },
    //
    // user action - move right
    //
    makeMoveRight() {
      if (this.userMoveMutex) {
        return;
      }
      this.userMoveMutex = true;

      let changeCnt = 0;
      for (let colCnt = 0; colCnt < this.fieldSize; colCnt++) {
        const tmp = this.shift(colCnt, false, true);

        if (tmp > changeCnt) {
          changeCnt = tmp;
        }
      }
      if (changeCnt !== 0) {
        this.nextStep();
      } else {
        this.userMoveMutex = false;
      }
    },
    //
    // preparations for new step
    //
    nextStep() {
      //
      // prepare animations
      //
      this.$store.dispatch('field/prepareAnimations').then(() => {
        //
        // launch animations
        //
        setTimeout(() => {
          this.$store.dispatch('field/launchAnimations').then(() => {
            this.$store.commit('field/incrementSteps');
            this.$store.dispatch('field/clearChangedFlags');
            setTimeout(() => {
              this.$store.dispatch('field/generateRandomNumber')
              .then(() => {
                this.canMakeStep() ? this.userMoveMutex = false : this.gameOver()
              })
            }, 300);
          });
        }, 100);
      });
    },
    //
    // no more steps left
    //
    gameOver() {
      alert('GAME OVER');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/assets/css/playing-field-style";
</style>
