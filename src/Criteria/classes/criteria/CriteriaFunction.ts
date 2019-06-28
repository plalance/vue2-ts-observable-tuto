'use strict';

// -----------------------------------------------------------------------------------

import {Selectable, SelectableEnum, SelectableType} from './Selectable';
import {CriteriaFunctionEnum} from './CriteriaFunctionEnum';
import {TypeUtils} from '../utils/TypeUtils';

/**
 * Criteria function
 */
export class CriteriaFunction extends Selectable {

	/** Class type */
	type = SelectableEnum.FUNCTION;

	/** Alias name */
	name: string;

	/** Managed column */
	column: Selectable;

	/** Function */
	function: CriteriaFunctionEnum;

	/** Distinct (use with count) ? */
	distinct: boolean = false;

	// ---------------------------------------------------------------------------

	/**
	 * Constructor
	 * @param {Selectable} column
	 * @param {CriteriaFunctionEnum} function_
	 */
	constructor(column: SelectableType, function_: CriteriaFunctionEnum) {
		super();
		this.column = Selectable.create(column);
		this.function = function_;
	}

	// ---------------------------------------------------------------------------

	/**
	 * Sets the distinct.
	 *
	 * @param distinct
	 *            the distinct to set
	 * @return this
	 */
	public setDistinct = (distinct: boolean): CriteriaFunction => {
		this.distinct = distinct;
		return this;
	};

	/**
	 * Sets the name.
	 *
	 * @param pName
	 *            the name to set
	 */
	public as = (name: string): CriteriaFunction => {
		this.name = name;
		return this;
	};

	// ---------------------------------------------------------------------------

	/**
	 * Count function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static count = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.COUNT);
	};

	/**
	 * Count distinct function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static countDistinct = (column: SelectableType): CriteriaFunction => {
		return CriteriaFunction.count(column).setDistinct(true);
	};

	/**
	 * Sum function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static sum = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.SUM);
	};

	/**
	 * Average function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static avg = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.AVG);
	};

	/**
	 * Min function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static min = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.MIN);
	};

	/**
	 * Max function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static max = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.MAX);
	};

	/**
	 * Coalesce function.
	 *
	 * @param column
	 *            column
	 * @param replacement
	 *            value if column is null
	 * @return CriteriaFunction
	 */
	static coalesce = (column: SelectableType, replacement: any): Coalesce => {
		return new Coalesce(column, replacement);
	};

	/**
	 * Lower case function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static lower = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.LOWER);
	};

	/**
	 * Lower case function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static upper = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.UPPER);
	};

	/**
	 * Concat function
	 *
	 * @param x
	 *            x
	 * @param y
	 *            y
	 * @return CriteriaFunction
	 */
	static concat = (x: SelectableType, y: SelectableType): Concat => {
		return new Concat(x, y);
	};

	/**
	 * Lower case function.
	 *
	 * @param column
	 *            column
	 * @return CriteriaFunction
	 */
	static castString = (column: SelectableType): CriteriaFunction => {
		return new CriteriaFunction(column, CriteriaFunctionEnum.CAST_STRING);
	};

};

// -----------------------------------------------------------------------------------

/**
 * Coalesce function
 */
class Coalesce extends Selectable {

	/** Class type */
	type = SelectableEnum.FUNCTION_COALESCE;

	/** Alias name */
	name: string = null;

	/** Managed column */
	column : Selectable;

	/** Function */
	function = CriteriaFunctionEnum.COALESCE;

	/** Replacement selectable */
	replacementSelectable: Selectable;

	/** Replacement value */
	replacementValue: any;

	/**
	 * Constructor
	 * @param column
	 * @param replacement
	 */
	constructor(column: SelectableType, replacement: any) {
		super();
		this.column = Selectable.create(column);

		if (TypeUtils.isObject(replacement)) {
			/** Replacement selectable */
			this.replacementSelectable = replacement;
		} else {
			/** Replacement value */
			this.replacementValue = replacement;
		}
	}

	/**
	 * Sets the name.
	 *
	 * @param pName
	 *            the name to set
	 */
	public as = (name: string): Coalesce => {
		this.name = name;
		return this;
	};

};


// -----------------------------------------------------------------------
// Static methods used to create functions
// -----------------------------------------------------------------------

/**
 * Concat function
 */
class Concat extends Selectable {

	/** Class type */
	type = SelectableEnum.FUNCTION_CONCAT;

	/** Function */
	function = CriteriaFunctionEnum.CONCAT;

	/** Alias name */
	name = null;

	/** X as selectable */
	xAsSelectable: Selectable;

	/** X as value */
	xAsValue: any;

	/** Y as selectable */
	yAsSelectable: Selectable;

	/** Y as value */
	yAsValue: any;

	// ----------------------------------------

	/**
	 * Constructor
	 * @param x
	 * @param y
	 */
	constructor(x, y) {
		super();

		/** X column */
		if (TypeUtils.isObject(x)) {
			/** X as selectable */
			this.xAsSelectable = x;
		} else {
			/** X as value */
			this.xAsValue = x;
		}

		/** Y column */
		if (TypeUtils.isObject(y)) {
			/** Y as selectable */
			this.yAsSelectable = y;
		} else {
			/** Y as value */
			this.yAsValue = y;
		}

	}

	// ----------------------------------------

	/**
	 * Sets the name.
	 *
	 * @param pName
	 *            the name to set
	 */
	public as = (name: string): Concat => {
		this.name = name;
		return this;
	};

	/**
	 * Concat this with another expression
	 *
	 * @param y
	 * @return Concat
	 */
	public concat = (y: any): Concat => {
		return new Concat(this, y);
	};

};
