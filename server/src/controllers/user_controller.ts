import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send(req.body);
};

export const getUser = async (req: Request, res: Response) => {
	throw Error('TODO');
};

export const login = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send(req.body);
};
