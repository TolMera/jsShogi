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
		// Set board height and width to half screen.
		$('#board').css({
			height:			'50vh',
			'max-height':	'50vh',
			width:			'50vh',
			'max-width':	'50vh'
		});
		// After that has taken effect, it's height/width can be used in calculations
		$('#board').css({
			position: 'absolute',
			top:		window.innerHeight / 4,
			left:		(window.innerWidth / 2) - ($('#board').height() / 2)
		});
		
		$('#board').css({
			border:	'3px double black'
		});
		
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
		});
	}
	
	shogiBoardHtml() {
		let board = '<table id="board" class="table table-bordered">';
		for (let x of [0,1,2,3,4,5,6,7,8]) {
			board += '<tr>';
			for (let y of [1,2,3,4,5,6,7,8,9]) {
				board += `<td data-position="${(x*9)+y}"></td>`;
			}
			board += '</tr>';
		}
		board += '</table>';
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
		$('#board td').each((index, item) => {
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
				let td = $(`td[data-position=${start}]`);
				let clone = $(td).find('img').clone();
				$(`td[data-position=${end}]`).empty().append(clone);
				$(td).empty();
				
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
			$.getJSON({
				url:		`http://localhost:3000/engine/${this.gameId}`
			}).then((json) => {
				console.log(json);
				if (json.result == true) {
					this.readBoard().then(this.updateBoard);
					this.next();
				}
			});
		}
	}
}