var shogiPieces = class {
	constructor() {
		// Maybe set piece colours?  English/Japanese?  There's probably some 'config' that people would like to pass in
		
		// Set Paths
		this.assets = './assets/icons/';
		
		this.pieces = {
			// Piece and Pieces
			king: {
				name: 'King',
				icon: {
					black:	'lowKing.png',
					white:	'king.png'
				}
			},
			rook: {
				name: 'Rook',
				icon: {
					normal:	'rook.png',
					promoted:	'rookP.png'
				},
				promoted: false
			},
			bishop: {
				name: 'Bishop',
				icon: {
					normal:	'bishop.png',
					promoted:	'bishopP.png'
				},
				promoted: false
			},
			gold: {
				name: 'Gold',
				icon: {
					normal:	'gold.png',
					promoted:	'goldP.png'
				},
				promoted: false
			},
			silver: {
				name: 'Silver',
				icon: {
					normal:	'silver.png',
					promoted:	'silverP.png'
				},
				promoted: false
			},
			knight: {
				name: 'Knight',
				icon: {
					normal:	'knight.png',
					promoted:	'knightP.png'
				},
				promoted: false
			},
			lance: {
				name: 'Lance',
				icon: {
					normal:	'lance.png',
					promoted:	'lanceP.png'
				},
				promoted: false
			},
			pawn: {
				name: 'Pawn',
				icon: {
					normal:	'pawn.png',
					promoted:	'pawnP.png'
				},
				promoted: false
			}
		}
		
		this.ready = true;
	}
	
	getIcon(piece, promoted, colour) {
		piece = piece.toLowerCase();
		if (colour != undefined) {
			if (piece != 'king') return false;
			return (this.assets + this.pieces.king.icon[colour]);
		} else {
			return (this.assets + this.pieces[piece].icon[(promoted?'promoted':'normal')]);
		}
	}
}