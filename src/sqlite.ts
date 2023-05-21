import Database from 'better-sqlite3';
import cluster from 'cluster';
import { ICachedImage } from './types';
const cache = Database('cache.db', {
	//fileMustExist: true,
});

if (cluster.isPrimary) {
	// fix concurrency issues
	cache.pragma('journal_mode = WAL');

	cache.pragma('wal_checkpoint(RESTART)');

	cache
		.prepare(
			`
    CREATE TABLE IF NOT EXISTS images(
        id TEXT PRIMARY KEY,
        data BLOB NOT NULL,
    ) WITHOUT ROWID;
    `
		)
		.run();
}

const GetCachedResizeStatement = cache.prepare<Pick<ICachedImage, 'id'>>(
	'SELECT * FROM images WHERE id=@id'
);

const GetAllCachedResizeStatement = cache.prepare('SELECT * FROM images');

const InsertNewImageStatement = cache.prepare<ICachedImage>(
	`INSERT INTO images (id,data) VALUES (@id,@data)`
);

export function getStoredImage(id: string) {
	const result = GetCachedResizeStatement.all({
		id: id,
	}) as ICachedImage[];

	if (result.length === 0) {
		return undefined;
	}

	return result[0]?.data;
}

export function getStoredImages() {
	return GetAllCachedResizeStatement.all() as ICachedImage[];
}

export const tCacheImage = cache.transaction((data: ICachedImage) => {
	return InsertNewImageStatement.run(data).changes > 0;
});
