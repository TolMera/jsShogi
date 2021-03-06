var singlePlayer = class {
	/**
	 * Requires jQuery
	 * starts a new single player game
	 */
	constructor() {
		// Record when the game started
		this.startTime = new Date();
		
		// Clear the body of the browser and layout a new Shogi board
		$('body').empty();
		$('body').append(this.shogiBoardHtml());
		
		swal({
			title:	'Game Options',
			html:	`
				<div id="gameOptions" class="row">
					<div class="col-md-12">
						<label class="col-md-4">Black or White?</label>
						<div class="col">
							<select name="colour" class="form-control">
								<option value="black" selected>Black</option>
								<option value="white">White</option>
							</select>
						</div>
					</div>
					<div class="col-md-12">
					<label class="col-md-4">Handicap?</label>
						<div class="col">
							<select name="handicap" class="form-control">
								<option value="0" selected>None</option>
								<option value="1">Level: 1</option>
								<option value="2">Level: 2</option>
								<option value="3">Level: 3</option>
								<option value="4">Level: 4</option>
								<option value="5">Level: 5</option>
								<option value="6">Level: 6</option>
								<option value="7">Level: 7</option>
								<option value="8">Level: 8</option>
								<option value="9">Level: 9</option>
								<option value="10">Level: 10</option>
								<option value="11">Level: 11</option>
								<option value="12">Level: 12</option>
								<option value="13">Level: 13</option>
								<option value="14">Level: 14</option>
								<option value="15">Level: 15</option>
							</select>
						</div>
					</div>
				</div>
			`,
			showConfirmButton: false,
			showCancelButton: false,
			footer: `<button id="startGameButton" class="btn btn-primary pull-right">Start Game</button>`
		});
		$('#startGameButton').click(function(trigger) {
			game.create.call(game, trigger);
			swal.close();
		});
	}
	
	shogiBoardHtml() {
		let board = '<div id="board">';
		for (let x of [0,1,2,3,4,5,6,7,8]) {
			for (let y of [1,2,3,4,5,6,7,8,9]) {
				board += `<div class="text-center" data-position="${(x*9)+y}">&nbsp;</div>`;
			}
		}
		board += '</div>';
		return board;
	}
	
	create(trigger) {
		var form = $('#gameOptions');
		let vals = {};
		$(form).find(':input').each((index, item) => {
			vals[$(item).attr('name')] = $(item).val();
		});

		this.player = vals.colour;
		this.turn = 'black';
		
		$.getJSON({
			url:		`http://localhost:3000/newGame/${vals.handicap}`,
			dataType:	'json'
		}).then((json) => {
			this.gameId = json.gameId;
			this.readBoard().then((data) => {
				this.updateBoard(data);
			});
		}, (json, error, other) => {
			$(trigger.target).parent().prepend(`<span class="col pull-left">An error occured, please try again later (sorry) - error: ${error}</span>`);
		});
	}
	
	readBoard() {
		this._readBoard = $.getJSON({
			url:		`http://localhost:3000/read/${this.gameId}`,
		});
		
		return this._readBoard;
	}
	
	updateBoard(data) {
		window.log('Updating board');
		$('#board > div').each((index, item) => {
			index++;
			$(item).empty();
			if (data[index] != undefined) {
				let icon;
				if (data[index].name == 'King') {
					icon = window.pieces.getIcon.call(window.pieces, data[index].name, false, data[index].player);
				} else {
					icon = window.pieces.getIcon.call(window.pieces, data[index].name, data[index].promoted);
				}
				let piece = $(`<img src="${icon}" />`);
				$(item).append(piece);
				if (data[index].player == 'white') {
					piece.addClass('white');
				} else {
					piece.addClass('black');
				}
				piece.addClass('shogiPiece');
			} else {
				$(item).empty();
			}
		});
	}
		
	move(start, end, player) {
		let before = $('#board').clone();
		this._move = $.getJSON({
			url:		`http://localhost:3000/move/${this.gameId}/${player||this.player}/${start}/${end}`
		}).then((json) => {
			if (json.result == false) {
				swal(json.error);
				$('#board').replaceWith(before);
			} else if (json.result == true) {
				let div = $(`div[data-position=${start}]`);
				let clone = $(div).find('img').clone();
				$(`div[data-position=${end}]`).empty().append(clone);
				$(div).empty();
				
				this.next();
			}
			// Move complete, check did user 'take' a piece, and add it to the hand.
			console.log(json);
		}, (json, state) => {
			// Shit happened
		});
	}
	
	next() {
		// next player turn
		switch (this.turn) {
			case 'white': this.turn = 'black'; break;
			case 'black': this.turn = 'white'; break;
		}
		if (this.turn != this.player) {
			// Computers turn
			let loopCount = 0;
			let ajax = $.getJSON({
				url:		`http://localhost:3000/engine/${this.gameId}`
			}).then((json) => {
				if (json.result == true) {
					this.readBoard().then(this.updateBoard);
					this.next();
				} if (json.result == false) {
					swal({
						title:	'Engine Failure',
						text:	`Sorry but the AI engine can't find a move, would you like to make a move for the engine?  (TODO: Under Development)`,
						type:	'error'
					});
				}
			});
		}
	}
}