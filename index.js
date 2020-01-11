'use strict';

class ApiError extends Error {

	static parse(data, statusCode, origin) {
		let error = new ApiError(data.name, data.message, data.entity, statusCode, data.keyPath);
		error._origin = origin;
		return error;
	}

	constructor(name, message, entity, statusCode = 400, keyPath = []) {
		super(message);
		this._name = name;
		this._entity = entity;
		this._statusCode = statusCode;
		if (typeof keyPath === 'string') keyPath = keyPath.split('.');
		this._keyPath = keyPath;
	}

	get name() {
		return this._name;
	}

	get entity() {
		return this._entity;
	}

	get statusCode() {
		return this._statusCode;
	}

	get keyPath() {
		return this._keyPath;
	}

	get origin() {
		return this._origin;
	}

	toJSON() {
		return {
			name: this.name.split(/(?=[A-Z])/).join('-').toLowerCase(),
			message: this.message,
			entity: this.entity,
			keyPath: this.keyPath ? (this.keyPath.length > 0 ? this.keyPath.join('.') : undefined) : undefined
		};
	}

}

class NotAuthorized extends ApiError {

	constructor(entity) {
		super('not-authorized', 'Not authorized.', entity, 401);
	}

}

class NotFound extends ApiError {

	constructor(entity) {
		super('not-found', 'Resource not found.', entity, 404);
	}

}

class Conflict extends ApiError {

	constructor(keyPath = []) {
		super('already-exists', 'Resource already exists.', undefined, 409, keyPath);
	}

}

class MethodNotAllowed extends ApiError {
	constructor() {
		super('method-not-allowed', 'Method is not allowed.', undefined, 405);
	}
}

class BadRequest extends ApiError {

	constructor(message, keyPath) {
		super('bad-request', message, undefined, 400, keyPath);
	}

}

class TooManyRequests extends ApiError {

	constructor(message) {
		super('too-many-requests', message || 'Too many requests.', undefined, 429);
	}

}

class PayloadTooLarge extends ApiError {

	constructor(message) {
		super('payment-too-large', message || 'Payload too large.', undefined, 413);
	}

}

class InternalError extends ApiError {

	constructor(underlayingError) {
		super('internal-error', 'Internal error.', undefined, 500);
		if (underlayingError) this.stack = underlayingError.stack;
	}

}

module.exports = exports = ApiError;
exports.NotAuthorized = NotAuthorized;
exports.NotFound = NotFound;
exports.Conflict = Conflict;
exports.MethodNotAllowed = MethodNotAllowed;
exports.BadRequest = BadRequest;
exports.TooManyRequests = TooManyRequests;
exports.PayloadTooLarge = PayloadTooLarge;
exports.InternalError = InternalError;
