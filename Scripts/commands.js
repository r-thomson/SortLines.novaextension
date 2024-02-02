const { shuffleArray } = require('./utils');

/** Matches LF, CR, or CRLF */
const NEWLINE_REGEX = /\n|\r\n|\r/;

const NovaConfig = {
	/** @type {boolean} */
	get ignoreWhitespace() {
		return nova.config.get('SortLines.ignoreWhitespace', 'bool');
	},
	/** @type {"lowerFirst" | "upperFirst"} */
	get caseOrder() {
		return nova.config.get('SortLines.caseOrder', 'string');
	},
	/** @type {boolean} */
	get useNumericCollation() {
		return nova.config.get('SortLines.useNumericCollation', 'bool');
	},
	/** @type {boolean} */
	get smartCommas() {
		return nova.config.get('SortLines.smartCommas', 'bool');
	},
};

/**
 * Make a `.sort()` compare function based on the user's preferences.
 * @returns {(a: string, b: string) => number}
 */
function getCompareFn() {
	const { caseOrder, ignoreWhitespace, useNumericCollation } = NovaConfig;

	const collator = Intl.Collator(undefined, {
		caseFirst: caseOrder === 'upperFirst' ? 'upper' : 'lower',
		numeric: useNumericCollation,
		sensitivity: 'case',
	});

	return (lhs, rhs) =>
		collator.compare(
			ignoreWhitespace ? lhs.trimStart() : lhs,
			ignoreWhitespace ? rhs.trimStart() : rhs,
		);
}

/**
 * @param array {string[]}
 * @returns {boolean}
 */
function allExceptLastEndWithComma(array) {
	return array.every((line, index) => {
		if (index < array.length - 1) {
			return line.endsWith(',');
		} else {
			return !line.endsWith(',');
		}
	});
}

/**
 * Perform an edit on the selected lines. `callback` should mutate the array
 * in-place.
 * @param callback {(lines: string[]) => void}
 */
function performLineEdit(editor, callback) {
	const { smartCommas } = NovaConfig;

	editor.edit((textEdit) => {
		for (const range of editor.selectedRanges) {
			const lineRange = editor.getLineRangeForRange(range);

			/** @type {string[]} */
			const lines = editor.getTextInRange(lineRange).split(NEWLINE_REGEX);

			// After the split, there will be one empty string ('') at the end of the
			// array because of the final newline. Remove now and re-add after sorting.
			lines.pop();

			// For the smart comma case, make every line end in a comma, then remove
			// the last line's comma after sorting.
			const commaAdded = smartCommas && allExceptLastEndWithComma(lines);
			if (commaAdded) {
				lines[lines.length - 1] += ',';
			}

			// Mutate the array here
			callback(lines);

			if (commaAdded) {
				lines[lines.length - 1] = lines.at(-1).slice(0, -1);
			}

			lines.push('');

			textEdit.replace(
				lineRange,
				lines.join(editor.document.eol),
				InsertTextFormat.PlainText,
			);
		}
	});
}

exports.sortLinesAscCommand = function (editor) {
	const compare = getCompareFn();

	performLineEdit(editor, (lines) => {
		lines.sort((lhs, rhs) => compare(lhs, rhs));
	});
};

exports.sortLinesDescCommand = function (editor) {
	const compare = getCompareFn();

	performLineEdit(editor, (lines) => {
		lines.sort((lhs, rhs) => -compare(lhs, rhs));
	});
};

exports.reverseLinesCommand = function (editor) {
	performLineEdit(editor, (lines) => {
		lines.reverse();
	});
};

exports.shuffleLinesCommand = function (editor) {
	performLineEdit(editor, (lines) => {
		shuffleArray(lines);
	});
};
