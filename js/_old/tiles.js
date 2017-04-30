app.tiles = (function() {
	var _tiles = document.getElementsByClassName('box');

	/**
	*   Create the 3D tiles in the progress section
	*/
	function _tiles(tile) {
		var tileWidth = tile.offsetWidth;
		var depth = '100px';

		for (var i = 0; i < tile.children.length; i++) {
			var tileSide = tile.children[i];
			tileSide.style.width = tileWidth + 'px';
			switch (tileSide.className) {
				case 'box-top':
					tileSide.style.height = tileWidth + 'px';
					tileSide.style.transform = 'rotateX(90deg) rotateZ(90deg) translate3D(0, ' + -(tileWidth / 2) + 'px, ' + (tileWidth / 2) + 'px)';
					tileSide.style.transformOrigin = 'left center';
					tileSide.style.width = depth;
					break;
				case 'box-bottom':
					tileSide.style.height = tileWidth + 'px';
					tileSide.style.transform = 'rotateX(-90deg) rotateZ(90deg) translate3D(-100px, ' + -(tileWidth / 2) + 'px, ' + -((tileWidth / 2) - 10) + 'px)';
					tileSide.style.transformOrigin = 'left center';
					tileSide.style.width = depth;
					break;
				case 'box-left':
					tileSide.style.transform = 'rotateY(-90deg) translate3D(50px, 0, 50px)';
					tileSide.style.width = depth;
					break;
				case 'box-right':
					tileSide.style.transform = 'rotateY(90deg) translate3D(-50px, 0, ' + (tileWidth - 50) + 'px)';
					tileSide.style.width = depth;
					break;
				case 'box-front':
					tileSide.style.transform = 'translateZ(' + 100 + 'px)';
					break;
				case 'box-back':
					break;
			}
		}
	}

	/**
	 *   Set the tiles in the education section
	 */
	function _setTiles() {
		if (tiles[0].offsetParent === null) return;
		Array.prototype.forEach.call(tiles, Tiles);
		_tilesConnector();
	}
		
	/**
	*   Establish the connectors with the tiles
	*/
	function _tilesConnector() {
		var cards = document.getElementsByClassName('card');

		Array.prototype.forEach.call(cards, function (item) {
			var card = item.getAttribute('data-card'),
				tile = document.querySelector('.tile-container[data-card="' + card + '"]'),
				connector = item.getElementsByClassName('card-connector')[0];

			var cardBox = item.getBoundingClientRect(),
				tileBox = tile.getBoundingClientRect();

			connector.style.height = (tileBox.top + (tileBox.height / 2) - (cardBox.top + cardBox.height)) + 'px';
		});
	}


	if (_tiles.length) _setTiles();
});