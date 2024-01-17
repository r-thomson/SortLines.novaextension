/** Matches LF, CR, or CRLF */
const NEWLINE_REGEX = /\n|\r\n|\r/;

nova.commands.register('SortLines.sortLinesAsc', (editor) => {
	editor.edit((textEdit) => {
		for (const range of editor.selectedRanges) {
			const lineRange = editor.getLineRangeForRange(range);

			/** @type {string[]} */
			const lines = editor.getTextInRange(lineRange).split(NEWLINE_REGEX);

			// After the split, there will be one empty string ('') at the end of the array
			// because of the final newline. Ensure it stays at the end of the array.
			lines.pop();
			lines.sort((lhs, rhs) =>
				lhs.localeCompare(rhs, undefined, { sensitivity: 'base' }),
			);
			lines.push('');

			textEdit.replace(
				lineRange,
				lines.join(editor.document.eol),
				InsertTextFormat.PlainText,
			);
		}
	});
});

nova.commands.register('SortLines.sortLinesDesc', (editor) => {
	editor.edit((textEdit) => {
		for (const range of editor.selectedRanges) {
			const lineRange = editor.getLineRangeForRange(range);

			/** @type {string[]} */
			const lines = editor.getTextInRange(lineRange).split(NEWLINE_REGEX);

			lines.pop();
			lines.sort((lhs, rhs) =>
				lhs.localeCompare(rhs, undefined, { sensitivity: 'base' }),
			);
			lines.push('');

			textEdit.replace(
				lineRange,
				lines.join(editor.document.eol),
				InsertTextFormat.PlainText,
			);
		}
	});
});

nova.commands.register('SortLines.reverseLines', (editor) => {
	editor.edit((textEdit) => {
		for (const range of editor.selectedRanges) {
			const lineRange = editor.getLineRangeForRange(range);

			/** @type {string[]} */
			const lines = editor.getTextInRange(lineRange).split(NEWLINE_REGEX);

			lines.pop();
			lines.reverse();
			lines.push('');

			textEdit.replace(
				lineRange,
				lines.join(editor.document.eol),
				InsertTextFormat.PlainText,
			);
		}
	});
});
