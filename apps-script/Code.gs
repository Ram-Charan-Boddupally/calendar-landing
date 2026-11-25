/**
 * Logs website enquiries into a Google Sheet ("Login in sheet" step).
 *
 * Setup:
 * 1. Create a Google Sheet. Extensions > Apps Script. Paste this file.
 * 2. Deploy > New deployment > Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 3. Copy the web app URL into js/config.js -> sheetWebhook.
 *
 * Each enquiry becomes a row. Use the Status column to track the order:
 * New > Chatting > Paid > Dates added > Preview approved > Printing > Packed > Shipped > Delivered
 */
const SHEET_NAME = 'Enquiries';
const HEADERS = [
  'Received', 'Name', 'WhatsApp', 'City', 'Calendar', 'Gift box', 'Occasion', 'Needed by', 'Notes',
  'Status', 'Address', 'Paid (₹)', 'Payment ref', 'Custom dates', 'Canva link', 'Printer', 'Tracking'
];

function doPost(e) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  let d = {};
  try { d = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { d = {}; }
  sheet.appendRow([
    new Date(), d.name || '', "'" + (d.phone || ''), d.city || '', d.calendar || '', d.tier || '',
    d.occasion || '', d.needby || '', d.notes || '', 'New'
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
