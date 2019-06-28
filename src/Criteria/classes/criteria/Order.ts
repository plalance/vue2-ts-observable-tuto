'use strict';

// -----------------------------------------------------------------------------------
/** Order direction */
import {Selectable, SelectableType} from './Selectable';

/**
 * Order direction
 */
export enum OrderDirection {
	ASC = 'ASC',
	DESC = 'DESC'
}

// -----------------------------------------------------------------------------------
/**
 * Order
 * @param column column
 * @param orderDirection
 * @constructor
 */
export class Order {

	/** Managed column (String : column name)*/
	column: Selectable;

	/** Order direction */
	orderDirection = OrderDirection.ASC;

	/**
	 * Constructor
	 * @param column
	 * @param orderDirection
	 */
	constructor(column: SelectableType, orderDirection?: OrderDirection) {
		this.column = Selectable.create(column);

		/** Order direction */
		if (orderDirection == undefined)
			this.orderDirection = OrderDirection.ASC;
		else
			this.orderDirection = orderDirection;
	}
}
