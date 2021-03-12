const state = () => ({
	cells: [],
	movesCount: 0,
	fieldSize: 4,
	steps: 0,
});

const getters = {
	getFieldSize: (state) => {
		return state.fieldSize
	},
	getCells: (state) => {
		return state.cells;
	},
	getEmptyCells: (state) => {
		let out = [];
		state.cells.map( row => {
			out = out.concat(row.filter( cell => cell.currentValue === 0));
		});
		return out;
	},
	getColumn: (state) => (coordinate) => {
		let out = [];
		state.cells.map( row => {
			out = out.concat(row.filter( cell => cell.yCoordinateDefault === coordinate ));
		})
		return out;
	},
	getRow: (state) => (coordinate) => {
		return [...state.cells[coordinate]];
	}
};

const actions = {
	initNewGame: ({ commit, dispatch }) => {
		let cells = [];
		for( let i = 0; i < state().fieldSize; i++ ) {
			let row = [];
			for( let j = 0; j < state().fieldSize; j++ ) {
				row.push({
					id: i*state().fieldSize + j + 1,
					xCoordinateDefault: i,
					yCoordinateDefault: j,
					xCoordinateCurrent: i,
					yCoordinateCurrent: j,
					xCoordinateFrom: null,
					yCoordinateFrom: null,
					xCoordinateTo: null,
					yCoordinateTo: null,
					value: 0,
					currentValue: 0,
					prevValue: 0,
					nextValue: 0,
					changed: false,
					isAnimating: false,
				})
			}
			cells.push(row);
		}
		commit('setCells', {cells: cells});
		dispatch('generateRandomNumber');
		dispatch('generateRandomNumber');
	},
	generateRandomNumber: ({commit, getters}) => {
		return new Promise((resolve) =>
		{
			let emptyCells = getters.getEmptyCells.slice();

			const newItem = Math.floor(Math.random() * 10 ) % emptyCells.length;
			if ( !isNaN(newItem) ) {
				let newCells = getters.getCells.slice();
				newCells[emptyCells[newItem].xCoordinateDefault][emptyCells[newItem].yCoordinateDefault] =
					Object.assign(newCells[emptyCells[newItem].xCoordinateDefault][emptyCells[newItem].yCoordinateDefault], {
						currentValue: 2,
						value: 2,
						nextValue : 2,
						prevValue: 2,
						xCoordinateCurrent: emptyCells[newItem].xCoordinateDefault,
						yCoordinateCurrent: emptyCells[newItem].yCoordinateDefault,
					});

				commit('setCells', {cells: newCells});
			}

			resolve();
		});
	},
	clearChangedFlags: ({commit, getters}) => {
		let cells = getters.getCells;
		cells.map(row => {
			row.map(item => item.changed = false)
		});
		commit('setCells', {cells});
	},
	prepareAnimations: ({commit, getters}) => {
		return new Promise((resolve) => {
			let cells = getters.getCells;
			cells.map(row => {
				row.map(item => {
					if( item.xCoordinateFrom !== null )
					{
						item.isAnimating = false;
						item.xCoordinateCurrent = item.xCoordinateFrom;
						item.yCoordinateCurrent = item.yCoordinateFrom;
						item.xCoordinateFrom = null;
						item.yCoordinateFrom = null;
					}
					item.currentValue = item.prevValue;
				})
			});
			commit('setCells', {cells});

			resolve();
		})
	},
	launchAnimations: ({commit, getters}) => {
		return new Promise((resolve) => {
			let cells = getters.getCells;
			cells.map(row => {
				row.map(item => {
					if( item.xCoordinateTo !== null )
					{
						item.isAnimating = true;
						item.xCoordinateCurrent = item.xCoordinateTo;
						item.yCoordinateCurrent = item.yCoordinateTo;
						item.xCoordinateTo = null;
						item.yCoordinateTo = null;
					}
					setTimeout(() => {
						item.currentValue = item.nextValue;
						item.value = item.nextValue;
						item.prevValue = item.nextValue;
					}, 150);
				})
			});
			commit('setCells', {cells});

			resolve();
		})
	}
};

const mutations = {
	setCells (state, payload) {
		state.cells = payload.cells
	},
	setSingleCell (state, payload ) {
		const {
			id,
			value,
			prevValue,
			nextValue,
			changed,
			xCoordinateFrom,
			yCoordinateFrom,
			xCoordinateTo,
			yCoordinateTo,
		} = payload;
		state.cells.map(row => {
			row.map(item => {
				if( item.id === id ) {
					item.value =
						typeof value === 'undefined' ? item.value : value;
					item.prevValue = prevValue;
					item.nextValue = nextValue;
					item.changed =
						typeof changed === 'undefined' ? item.changed : changed;
					item.xCoordinateFrom = xCoordinateFrom;
					item.yCoordinateFrom = yCoordinateFrom;
					item.xCoordinateTo = xCoordinateTo;
					item.yCoordinateTo = yCoordinateTo;
				}
			});
		});
	},
	incrementSteps: (state) => {
		state.steps++;
	}
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
