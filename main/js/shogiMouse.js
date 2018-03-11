window.shogiMouse = class {
	constructor() {
		// enable a state machine
		this._state = {};
		
		console.log('Attaching mouse controller');
		
		$('body').on('click', '#board td', (trigger) => {
			this.clickPiece.call(this, trigger);
		});
	}
	
	clickPiece(trigger) {
		if ($(trigger.target).is('td') && this._state.piece != undefined) {
			this.movePiece.call(this, trigger);
		} else if ($(trigger.target).hasClass('shogiPiece') == true && this._state.piece != undefined) {
			if ($(trigger.target).hasClass(window.game.player)) {
				window.log("new piece selected");
				this._state.piece = trigger.target;
			} else {
				window.log("Moving piece");
				this.movePiece.call(this, trigger);
			}
		} else if ($(trigger.target).hasClass('shogiPiece') == true) {
			if ($(trigger.target).hasClass(window.game.player)) {
				window.log("piece selected");
				this._state.piece = trigger.target;
			} else {
				window.log("not your piece");
				// this is not your piece, so do nothing
			}
		}
	}
	
	movePiece(trigger) {
		// Get the start and end positions.
		let start = $(this._state.piece).parent().data('position');
		let end = undefined;
		if ($(trigger.target).is('td')) {
			end = $(trigger.target).data('position');
		} else {
			end = $(trigger.target).parent().data('position');
		}
		
		// move piece
		window.game.move(start, end);
		this._state.piece = undefined;
	}
}