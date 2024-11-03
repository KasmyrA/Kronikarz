import { useState } from "react";

export interface KeyedState<T> {
	value: T;
	key: string;
}

export function useKeyedState<T>(initialState: T[]) {
	const [value, setValue] = useState<KeyedState<T>[]>(initialState.map((v, i) => ({ value: v, key: `${new Date().getTime()}${i}` })));

	const add = (v: T) => setValue([...value, { value: v, key: new Date().getTime().toString() }]);

	const update = (key: string, v: T) => {
		const entry = value.find((t) => t.key === key);
		if (entry) entry.value = v;
		setValue([...value]);
	}

	const deleteV = (key: string) => setValue(value.filter((t) => t.key !== key));

	return [value, add, update, deleteV] as const;
}