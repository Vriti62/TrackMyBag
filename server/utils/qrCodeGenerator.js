const QRCode = require('qrcode');

exports.generateQRCode = async (text) => {
  try {
    const url = await QRCode.toDataURL(text);
    return url;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate QR code');
  }
};
