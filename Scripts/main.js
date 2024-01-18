const {
	sortLinesAscCommand,
	sortLinesDescCommand,
	reverseLinesCommand,
} = require('./commands');

nova.commands.register('SortLines.sortLinesAsc', sortLinesAscCommand);
nova.commands.register('SortLines.sortLinesDesc', sortLinesDescCommand);
nova.commands.register('SortLines.reverseLines', reverseLinesCommand);
