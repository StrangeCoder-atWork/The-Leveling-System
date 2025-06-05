// Create a new ping endpoint
export default function handler(req, res) {
  res.status(200).json({ status: 'ok' });
}