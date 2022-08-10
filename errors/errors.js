const { ErrBadRequest } = require('./errBadRequest');
const { ErrAutorization } = require('./errAutorization');
const { ErrConflict } = require('./errConflict');
const { ErrForbidden } = require('./errFrobidden');
const { ErrNotFound } = require('./errNotFound');

module.exports = {
  ErrBadRequest,
  ErrAutorization,
  ErrConflict,
  ErrForbidden,
  ErrNotFound,
};
