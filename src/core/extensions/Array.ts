Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.progress = function () {
	const element = this.shift();
	this.push(element);

	return element;
};
