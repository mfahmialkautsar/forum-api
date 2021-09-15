const AuthenticationError = require('./AuthenticationError');
const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_CHAR_LIMIT': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTERS': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat mendapatkan detail thread karena properti yang dibutuhkan tidak ada'),
  'GET_DETAIL_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('tidak dapat mendapatkan detail thread karena tipe data tidak sesuai'),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('tidak dapat menambahkan comment baru karena tipe data tidak sesuai'),
  'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat menghapus comment karena properti yang dibutuhkan tidak ada'),
  'DELETE_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('tidak dapat menghapus comment karena tipe data tidak sesuai'),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat menambahkan reply baru karena properti yang dibutuhkan tidak ada'),
  'ADD_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('tidak dapat menambahkan reply baru karena tipe data tidak sesuai'),
  'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat menghapus reply karena properti yang dibutuhkan tidak ada'),
  'DELETE_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION': new InvariantError('tidak dapat menghapus reply karena tipe data tidak sesuai'),
};

module.exports = DomainErrorTranslator;
