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
			border:	'3px double black',
			transform:	'scale(-1, 1)'
		});
		
		swal({
			title:	'Game Options',
			html:	`
				<div id="gameOptions" class="row">
					<div class="col-md-12">
						<label class="col-md-4">Black or White?</label>
						<div class="col">
							<select name="colour" class="form-control">
								<option selected>Black</option>
								<option>White</option>
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
		for (let x in [0,1,2,3,4,5,6,7,8]) {
			board += '<tr>';
			for (let y in [0,1,2,3,4,5,6,7,8]) {
				board += '<td></td>';
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
		$('#board td').each((index, item) => {
			if (data[index] != undefined) {
				let icon;
				if (data[index].name == 'King') {
					icon = window.pieces.getIcon.call(window.pieces, data[index].name, false, data[index].player);
				} else {
					icon = window.pieces.getIcon.call(window.pieces, data[index].name, data[index].promoted);
				}
				let piece = $(`<img src="${icon}" />`);
				piece = $(item).append(piece);
				if (data[index].player == 'white') {
					piece.addClass('white');
				}
			} else {
				$(item).empty();
			}
		});
	}
}