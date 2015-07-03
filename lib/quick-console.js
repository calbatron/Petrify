var colors 	= 	require('colors/safe');

module.exports = {
	mode: 0,
	c : function(v, a, c)	{
		if (this.mode >= a)		{
			switch (c) {
				case 1 : { console.log(colors.rainbow(v)); break; }
				case 2 : { console.log(colors.green(v)); break; }
				case 3 : { console.log(colors.yellow(v)); break; }
				case 4 : { console.log(colors.red(v)); break; }
				case 5 : { console.log(colors.inverse(v)); break; }
				default : { console.log(v); break; }
			}
		}
	}
}
