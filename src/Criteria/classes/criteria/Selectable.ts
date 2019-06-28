'use strict';

import {TypeUtils} from '../utils/TypeUtils';

/** Selectable type */
export type SelectableType = string | Selectable;

/** Selectable enum */
export enum SelectableEnum {
	COLUMN = 'column',
	FUNCTION = 'function',
	FUNCTION_COALESCE = 'coalesce',
	FUNCTION_CONCAT = 'concat'
}

/**
 * Selectable type
 */
export class Selectable {

	/**
	 * Constructor
	 */
	constructor() {
	}

	/**
	 * Create a selectable
	 */
	static create = (selectable: SelectableType): Selectable => {
		// If selectable is column name, create column object
		if (TypeUtils.isString(selectable)) {
			let columnName = <string> selectable;
			return new CriteriaColumn(columnName);
		}

		// Return selectable object
		return <Selectable>selectable;
	};
};

/**
 * Criteria Column
 */
export class CriteriaColumn extends Selectable {

	/** Class type */
	type = SelectableEnum.COLUMN;

	/** Managed columns */
	name: string;

	/**
	 * Constructor
	 * @param {string} name
	 */
	constructor(name: string) {
		super();
		this.name = name;
	}
};
