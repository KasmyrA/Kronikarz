import { ErrorResponse } from "../../types/helperTypes.js";


// create tree
export type CreateTreeRequest = {
  treeName: string
};

export const TREE_NAME_REQUIRED = 'Tree name is required';
export const INT_CREATE_TREE_ERROR = 'Internal create tree error';
export type CreateTreeResponse = ErrorResponse<typeof INT_CREATE_TREE_ERROR | typeof TREE_NAME_REQUIRED> | {
  _id: string;
};