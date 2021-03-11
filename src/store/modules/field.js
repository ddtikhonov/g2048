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
			out = out.concat(row.filter( cell => cell.value === 0));
		});
		return out;
	},
	getColumn: (state) => (coordinate) => {
		let out = [];
		state.cells.map( row => {
			out = out.concat(row.filter( cell => cell.yCoordinate === coordinate ));
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
					xCoordinate: i,
					yCoordinate: j,
					value: 0,
					changed: false,
				})
			}
			cells.push(row);
		}
		commit('setCells', {cells: cells});
		dispatch('generateRandomNumber');
		dispatch('generateRandomNumber');
	},
	generateRandomNumber: ({commit, getters}) => {
		let emptyCells = getters.getEmptyCells.slice();

		const newItem = Math.floor(Math.random() * 10 ) % emptyCells.length;
		if ( !isNaN(newItem) ) {
			let newCells = getters.getCells.slice();
			newCells[emptyCells[newItem].xCoordinate][emptyCells[newItem].yCoordinate].value = 2;

			commit('setCells', {cells: newCells});
		}
	},
	clearChangedFlags: ({commit, getters}) => {
		let cells = getters.getCells;
		cells.map(row => {
			row.map(item => item.changed = false)
		});
		commit('setCells', {cells});
	}
};

const mutations = {
	setCells (state, payload) {
		state.cells = payload.cells
	},
	setSingleCell (state, payload ) {
		const { id, value, changed } = payload;
		state.cells.map(row => {
			row.map(item => {
				if( item.id === id ) {
					item.value = value;
					item.changed = changed;
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
