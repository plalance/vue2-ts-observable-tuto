'use strict';

import {CriterionOperator} from './CriterionOperator';
import {Criterion, CriterionTypeEnum} from './Criteria';
import {Selectable, SelectableType} from './Selectable';
import {TypeUtils} from '../utils/TypeUtils';

/**
 * Simple Criterion
 */
export class SimpleCriterion {

	/** Class type */
	type = CriterionTypeEnum.SIMPLE;

	/** Managed columns */
	column: Selectable;

	/** Operator */
	operator: CriterionOperator;

	/** values */
	listValues = [];

	/** Ignore case ? */
	ignoreCase = false;

	/** Property value ? (means that the column is compare to an another column) */
	propertyValue = false;

	/** Negate criterion */
	negate = false;

	// ------------------------------------------------------------------------------------------
	/**
	 * Constructor
	 * @param column
	 * @param operator
	 * @param values
	 */
	constructor(column: SelectableType, operator: CriterionOperator, values?: any) {

		this.column = Selectable.create(column);
		this.operator = operator;

		// Set values
		if (Array.isArray(values))
			this.listValues = values;

		else if (values != undefined)
			this.listValues.push(values);
	}

	// ------------------------------------------------------------------------------------------

	/**
	 * Set ignoreCase
	 *
	 * @param ignoreCase
	 *            the ignoreCase to set
	 */
	public setIgnoreCase = (ignoreCase): SimpleCriterion => {
		this.ignoreCase = ignoreCase;
		return this;
	};


	/**
	 * Set propertyValue
	 *
	 * @param propertyValue
	 *            the propertyValue to set
	 * @return SimpleCriterion
	 */
	public setPropertyValue = (propertyValue): SimpleCriterion => {
		this.propertyValue = propertyValue;
		return this;
	};

	/**
	 * @param negate
	 *            the negate to set
	 */
	public setNegate = (negate): SimpleCriterion => {
		this.negate = negate;
		return this;
	};

	/**
	 * @param values
	 *            the values to set
	 */
	public setValues = (values): SimpleCriterion => {
		this.listValues = values;
		return this;
	};

	// -----------------------------------------------------------------------
	// Methods used to create criterion
	// -----------------------------------------------------------------------

	/**
	 * Add an equals condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addEquals = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return new SimpleCriterion(column, CriterionOperator.EQUALS, values);
	};

	/**
	 * Add a greater (strictly) condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addGreater = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return new SimpleCriterion(column, CriterionOperator.GREATER, values);
	};


	/**
	 * Add a greater or equal condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addGreaterEquals = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return new SimpleCriterion(column, CriterionOperator.GREATER_EQUALS, values);
	};

	/**
	 * Add a less (strictly) condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addLess = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return new SimpleCriterion(column, CriterionOperator.LESS, values);
	};


	/**
	 * Add a less or equals condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addLessEquals = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return new SimpleCriterion(column, CriterionOperator.LESS_EQUALS, values);
	};

	/**
	 * Add a "different off" (not equal) condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addNotEquals = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		let notEqualsCriterion = SimpleCriterion.addEquals(column, values);
		return notEqualsCriterion.setNegate(true);
	};

	/**
	 * Add a "like" condition on a column. The jocker char is '%'
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addLike = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return new SimpleCriterion(column, CriterionOperator.LIKE, values);
	};

	/**
	 * Add a "ilike" condition on a column. The jocker char is '%'
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addLikeIgnoreCase = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return SimpleCriterion.addLike(column, values).setIgnoreCase(true);
	};


	/**
	 * Add a "in" condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addIn = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;
		return new SimpleCriterion(column, CriterionOperator.IN, values);
	};

	/**
	 * Add a "not in" condition on a column
	 *
	 * @param column
	 *            managed column
	 * @param values
	 *            values
	 * @return SimpleCriterion
	 */
	static addNotIn = (column: SelectableType, values: any): SimpleCriterion => {
		if (TypeUtils.isEmpty(values))
			return null;

		let criterion = SimpleCriterion.addIn(column, values);
		return criterion.setNegate(true);
	};


	/**
	 * Add a "is null" condition on a column
	 *
	 * @param column
	 *            managed column
	 * @return SimpleCriterion
	 */
	static addIsNull = (column: SelectableType): SimpleCriterion => {
		return new SimpleCriterion(column, CriterionOperator.IS_NULL);
	};

	/**
	 * Add a "is not null" condition on a column
	 *
	 * @param column
	 *            managed column
	 * @return SimpleCriterion
	 */
	static addIsNotNull = (column: SelectableType): SimpleCriterion => {
		let criterion = SimpleCriterion.addIsNull(column);
		return criterion.setNegate(true);
	};
};
