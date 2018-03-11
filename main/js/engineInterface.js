var engineInterface = class {
	constructor() {
		var obj = this;
		$('body').prepend(`
			<div id="menu" class="pos-f-t">
				<div class="collapse" id="menuCollapse">
					<div class="bg-dark p-4">
					<ul class="navbar-nav">
						<li class="nav-item"><button class="btn" name="refresh">Refresh</button></li>
					</ul>
				</div>
				</div>
					<nav class="navbar navbar-dark bg-dark">
						<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#menuCollapse" aria-controls="menuCollapse" aria-expanded="false" aria-label="Toggle navigation">
							<span class="navbar-toggler-icon"></span>
						</button>
					</nav>
				</div>
			</div>
		`);
		
		$('body').on('click', '#menu button[name]', function(trigger) {
			obj[$(trigger.target).attr('name')].call(obj, trigger);
		});
	}
	
	refresh() {
		let prom = window.game.readBoard();
		prom.then((data) => {
			window.game.updateBoard(data);
		});
	}
}