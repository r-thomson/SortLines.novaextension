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
 * Perform an edit on the selected lines. `callback` should mutate the array in-place.
 * @param callback {(lines: string[]) => void}
 */
function performLineEdit(editor, callback) {
	editor.edit((textEdit) => {
		for (const range of editor.selectedRanges) {
			const lineRange = editor.getLineRangeForRange(range);

			/** @type {string[]} */
			const lines = editor.getTextInRange(lineRange).split(NEWLINE_REGEX);

			// After the split, there will be one empty string ('') at the end of the array
			// because of the final newline. Ensure it stays at the end of the array.
			lines.pop();
			callback(lines);
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
