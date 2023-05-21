import cluster from 'cluster';
import os from 'os';
import path from 'path';
import './sqlite';

if (cluster.isPrimary) {
	// Take advantage of multiple CPUs
	const cpus = os.cpus().length;

	for (let i = 0; i < cpus; i++) {
		cluster.fork(process.env);
	}

	cluster.on('exit', (worker, code) => {
		if (code !== 0 && !worker.exitedAfterDisconnect) {
			const nw = cluster.fork();
		}
	});
} else {
	require(path.join(__dirname, 'cluster'));
}
