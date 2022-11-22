const {nanoid} = require('nanoid');
const books = require('./book');

// Kriteria 1 : API dapat menyimpan buku
const addBooks = (request, h) => {
	const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
	const id = nanoid(16);
	const finished = (pageCount === readPage);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	
	if(name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	}
	
	if(readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}
	
	const newBooks = {id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt};
	books.push(newBooks);
	
	const isSuccess = books.filter((book) => book.id === id).length > 0;
	if(isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			}
		});
		response.code(201);
		return response;
	}
	const response = h.response({
		status: 'error',
		message: 'Buku gagal ditambahkan',
	});
	response.code(500);
	return response;
};

// Kriteria 2 : API dapat menampilkan seluruh buku
// Saran : Fitur query parameters ?(name, reading, finished)
const getAllBooks = (request, h) => {
	const {name, reading, finished} = request.query;
	
	if(name !== undefined) {
		const byname = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
		const response = h.response({
			status: 'success',
			data: {
				books: byname.map((n) => ({
					id: n.id,
					name: n.name,
					publisher: n.publisher
				})),
			},
		});
		response.code(200);
		return response;
	}
	
	if(reading !== undefined) {
		if(reading === '1') {
			const read = books.filter((r) => r.reading === true);
			const response = h.response({
				status: 'success',
				data: {
					books: read.map((r) => ({
						id: r.id,
						name: r.name,
						publisher: r.publisher
					})),
				},
			});
			response.code(200);
			return response;
		} else
		if(reading === '0') {
			const read = books.filter((r) => r.reading === false);
			const response = h.response({
				status: 'success',
				data: {
					books: read.map((r) => ({
						id: r.id,
						name: r.name,
						publisher: r.publisher
					})),
				},
			});
			response.code(200);
			return response;
		}
	}
	
	if(finished !== undefined) {
		if(finished === '1') {
			const finish = books.filter((f) => f.finished === true);
			const response = h.response({
				status: 'success',
				data: {
					books: finish.map((f) => ({
						id: f.id,
						name: f.name,
						publisher: f.publisher
					})),
				},
			});
			response.code(200);
			return response;
		} else
		if(finished === '0') {
			const finish = books.filter((f) => f.finished === false);
			const response = h.response({
				status: 'success',
				data: {
					books: finish.map((f) => ({
						id: f.id,
						name: f.name,
						publisher: f.publisher
					})),
				},
			});
			response.code(200);
			return response;
		}
	}
	
	const response = h.response({
		status: 'success',
		data: {
			books: books.map((book) => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			})),
		},
	});
	response.code(200);
	return response;
};

// Kriteria 3 : API dapat menampilkan detail buku
const getBookById = (request, h) => {
	const {bookId} = request.params;
	const book = books.filter((n) => n.id === bookId)[0];
	
	if(book !== undefined) {
		const response = h.response({
			status: 'success',
			data: {
				book
			}
		});
		response.code(200);
		return response;
	}
	
	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});
	response.code(404);
	return response;
};

// Kriteria 4 : API dapat mengubah data buku
const editBookById = (request, h) => {
	const {bookId} = request.params;
	const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
	const updatedAt = new Date().toISOString();
	const index = books.findIndex((book) => book.id === bookId);
	
	if(name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku'
		});
		response.code(400);
		return response;
	}
	
	if(readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
		});
		response.code(400);
		return response;
	}
	
	if(index !== -1) {
		books[index] = {...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt};
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});
		response.code(200);
		return response;
	}
	
	const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

// Kriteria 5 : API dapat menghapus buku
const delBookById = (request, h) => {
	const {bookId} = request.params;
	const index = books.findIndex((book) => book.id === bookId);
	
	if(index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus'
		});
		response.code(200);
		return response;
	}
	
	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

module.exports = {
	addBooks, getAllBooks, getBookById, editBookById, delBookById
};