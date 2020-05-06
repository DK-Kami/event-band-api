import https from 'https';
import app from './app';

const HOSTNAME = '127.0.0.1';
const PORT = '5000';

const server = https.createServer(app);
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at https://${HOSTNAME}:${PORT}/`);
});
