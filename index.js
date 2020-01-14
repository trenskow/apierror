'use strict';

const
	merge = require('merge');

class ApiError extends Error {

	static parse(data, statusCode, origin) {
		return new ApiError(merge(data, {
			statusCode: statusCode,
			origin: origin
		}));
	}

	static _correctArguments(message, options) {
		
		if (typeof message === 'object' && message !== null && !options) {
			options = message;
			message = options.message;
		}

		options = options || {};

		return [ message, options ];

	}

	constructor(message, options) {

		[ message, options ] = ApiError._correctArguments(message, options);

		if (typeof message !== 'string') throw TypeError('Message must be of type string.');

		super(message);

		this._name = options.name;
		this._entity = options.entity;
		this._statusCode = options.statusCode || 500;

		if (typeof options.keyPath === 'string') options.keyPath = options.keyPath.split('.');

		this._keyPath = options.keyPath;

		this._origin = options.origin;

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

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Not authorized.', merge(options, {
			name: 'not-authorized',
			statusCode: 401
		}));
	}

}

class NotFound extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Resource not found.', merge(options, {
			name: 'not-found',
			statusCode: 404
		}));
	}

}

class Conflict extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Resource already exists.', merge(options, {
			name: 'already-exists',
			statuCode: 409
		}));
	}

}

class MethodNotAllowed extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Method is not allowed.', merge(options, {
			name: 'method-not-allowed',
			statusCode: 405
		}));
	}

}

class BadRequest extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Bad request', merge(options, {
			name: 'bad-request',
			statusCode: 400
		}));
	}

}

class TooManyRequests extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Too many requests.', merge(options, {
			name: 'too-many-requests',
			statusCode: 429
		}));
	}

}

class PayloadTooLarge extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Payload too large.', merge(options, {
			name: 'payload-too-large',
			statusCode: 413
		}));
	}

}

class InternalError extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Internal error.', merge(options, {
			name: 'internal-error',
			statusCode: 500
		}));
	}

}

class ServiceUnavailable extends ApiError {

	constructor(message, options) {
		[ message, options ] = ApiError._correctArguments(message, options);
		super(message || 'Service unavailable.', merge(options, {
			name: 'service-unavailable',
			statusCode: 503
		}));
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
exports.ServiceUnavailable = ServiceUnavailable;
