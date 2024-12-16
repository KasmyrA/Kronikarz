/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Send, Query, ParamsDictionary } from 'express-serve-static-core';
import { User } from './userInterfaces.js';

export interface Request<
    BodyType = {},
    QueryType extends Query = {},
    ParamsType extends ParamsDictionary = {}
> extends ExpressRequest {
    body: BodyType;
    params: ParamsType;
    query: QueryType;
}

export interface ProtectedRequest<
    BodyType = {},
    QueryType extends Query = {},
    ParamsType extends ParamsDictionary = {}
> extends ExpressRequest {
    body: BodyType;
    params: ParamsType;
    query: QueryType;
    user: User
}

export interface Request<
    BodyType = {},
    QueryType extends Query = {},
    ParamsType extends ParamsDictionary = {}
> extends ExpressRequest {
    body: BodyType;
    params: ParamsType;
    query: QueryType;
}

export interface Response<ResBody = never> extends ExpressResponse {
    json: Send<ResBody, this>;
}

export type ErrorResponse<T extends string> = {
    error: T;
};