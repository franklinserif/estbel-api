/**
 * Determines the background color for a table row based on its index.
 * This function is typically used to apply alternating row colors in a table for better readability.
 *
 * @param {number} rowIndex - The index of the current row in the table.
 * @returns {string | null} - The background color for the row. Returns `#ebebeb` for even rows (excluding the first row), and `null` for odd rows or the first row.
 */
export function fillColorTable(rowIndex: number): string | null {
  return rowIndex % 2 === 0 && rowIndex !== 0 ? '#ebebeb' : null;
}
