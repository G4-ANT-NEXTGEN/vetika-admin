/**
 * Data Exporter Utility
 * Export data to CSV, JSON, or generate printable format
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Column headers (optional, defaults to object keys)
 * @returns {string} CSV formatted string
 */
export const toCSV = (data, headers = null) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn('No data to export')
        return ''
    }

    // Get headers from first object if not provided
    const keys = headers || Object.keys(data[0])

    // Create CSV header row
    const headerRow = keys.map((key) => `"${key}"`).join(',')

    // Create data rows
    const dataRows = data.map((row) => {
        return keys
            .map((key) => {
                const value = row[key]
                // Escape quotes and wrap in quotes
                if (value === null || value === undefined) {
                    return ''
                }
                return `"${String(value).replace(/"/g, '""')}"` // Excel escaping
            })
            .join(',')
    })

    return [headerRow, ...dataRows].join('\n')
}

/**
 * Convert array of objects to JSON string
 * @param {Array} data - Array of objects to export
 * @param {Boolean} pretty - Pretty print JSON (default: true)
 * @returns {string} JSON formatted string
 */
export const toJSON = (data, pretty = true) => {
    if (!data || !Array.isArray(data)) {
        console.warn('No data to export')
        return ''
    }

    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
}

/**
 * Download data as CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Output filename (without extension)
 * @param {Array} headers - Column headers (optional)
 */
export const downloadCSV = (data, filename = 'export', headers = null) => {
    const csv = toCSV(data, headers)
    if (!csv) return

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up URL object
    URL.revokeObjectURL(url)
}

/**
 * Download data as JSON file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Output filename (without extension)
 * @param {Boolean} pretty - Pretty print JSON (default: true)
 */
export const downloadJSON = (data, filename = 'export', pretty = true) => {
    const json = toJSON(data, pretty)
    if (!json) return

    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.json`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up URL object
    URL.revokeObjectURL(url)
}

/**
 * Generate print-friendly HTML from data
 * @param {Array} data - Array of objects
 * @param {string} title - Table title
 * @param {Array} headers - Column headers
 * @returns {string} HTML string
 */
export const generatePrintHTML = (data, title = 'Export', headers = null) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return '<p>No data to display</p>'
    }

    const keys = headers || Object.keys(data[0])

    const headerRows = keys.map((key) => `<th>${key}</th>`).join('')

    const dataRows = data
        .map((row) => {
            const cells = keys.map((key) => {
                const value = row[key] || ''
                return `<td>${String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`
            })
            return `<tr>${cells.join('')}</tr>`
        })
        .join('')

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f5f5f5; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
          td { padding: 10px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead><tr>${headerRows}</tr></thead>
          <tbody>${dataRows}</tbody>
        </table>
        <p style="text-align: center; color: #999; margin-top: 30px; font-size: 12px;">
          Exported on ${new Date().toLocaleString()}
        </p>
      </body>
    </html>
  `
}

/**
 * Open print dialog with data table
 * @param {Array} data - Array of objects
 * @param {string} title - Table title
 * @param {Array} headers - Column headers
 */
export const printData = (data, title = 'Export', headers = null) => {
    const html = generatePrintHTML(data, title, headers)

    const printWindow = window.open('', '_blank')
    printWindow.document.write(html)
    printWindow.document.close()

    // Trigger print dialog after content loads
    setTimeout(() => {
        printWindow.print()
    }, 250)
}

/**
 * Export filtered table data
 * Utility function that handles common export scenarios
 * @param {Array} items - Array of objects
 * @param {string} format - Export format ('csv', 'json', 'print')
 * @param {string} filename - Output filename
 * @param {Array} columns - Column definitions or headers
 */
export const exportTableData = (items, format = 'csv', filename = 'export', columns = null) => {
    if (!items || items.length === 0) {
        console.warn('No items to export')
        return
    }

    const headers = columns ? columns.map((col) => col.label || col.key) : null

    switch (format.toLowerCase()) {
        case 'csv':
            downloadCSV(items, filename, headers)
            break
        case 'json':
            downloadJSON(items, filename)
            break
        case 'print':
            printData(items, filename, headers)
            break
        default:
            console.warn(`Unknown export format: ${format}`)
    }
}

export default {
    toCSV,
    toJSON,
    downloadCSV,
    downloadJSON,
    generatePrintHTML,
    printData,
    exportTableData,
}
