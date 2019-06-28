'use strict';

import {SimpleCriterion} from './SimpleCriterion';
import {LogicalCriterion} from './LogicalCriterion';
import {Order, OrderDirection} from './Order';
import {Selectable, SelectableType} from './Selectable';

// -----------------------------------------------------------------------------------
/** Define a Criterion */
export enum CriterionTypeEnum {
  SIMPLE = "simple",
  LOGICAL = "logical"
};

export type Criterion = LogicalCriterion | SimpleCriterion

// -----------------------------------------------------------------------------------
/**
 * Criteria object
 * @constructor
 */
export class Criteria {

    /** Entity name */
    entityName : string = null;

    /** List criterions */
    listSelect : Array<Selectable> = [];

    /** List criterions */
	listCriterion : Array<Criterion> = [];

    /** List groupBy */
    listGroupBy : Array<Selectable> = [];

    /** List Having */
	listHaving : Array<Criterion> = [];

    /** List order */
	listOrder : Array<Order> = [];

	// -----------------------------------------------------------------------------------

	/**
	 * Constructor
	 * @param {string} code
	 */
	constructor() {
	}

	// -----------------------------------------------------------------------------------

    /**
     * Get, if defined, SimpleCriterion for column definition. If Column is in a complex Criterion (with Logical criterion) then no criterion
     * will be found
     *
     * @param column
     *            column definition
     * @return Criterion
     */
    getCriterion = (column : SelectableType) : Criterion => {

		let columnSelectable = Selectable.create(column);

		for (let i = 0; i < this.listCriterion.length; i++) {
			let criterion = this.listCriterion[i];

            // Handle only simple criterion
            if (criterion.type == CriterionTypeEnum.SIMPLE)
                if ((<SimpleCriterion>criterion).column == columnSelectable)
                    return criterion;
        }

        return null;
    };

    /**
     * Remove criterion from column. Work only with a SimpleCriterion.
     *
     * @param column
     *            Column
     * @return Criterion removed
     */
	removeCriterion = (column : SelectableType) : Criterion => {
        let removedCriterion : Criterion = null;
		let columnSelectable = Selectable.create(column);

        for (let i = 0; i < this.listCriterion.length; i++) {
            let criterion = this.listCriterion[i];
            // Handle only simple criterion
            if (criterion.type == CriterionTypeEnum.SIMPLE) {
				if ((<SimpleCriterion>criterion).column == columnSelectable){
                    this.listCriterion.splice(i, 1);
                    removedCriterion = criterion;
                }
            }
        }

        return removedCriterion;
    }

    // -----------------------------------------------------------------------
    // Orders columns
    // -----------------------------------------------------------------------

    /**
     * Add column order DESC
     *
     * @param column
     *            column to sort
     */
	addOrderByDesc = (column : SelectableType) : Criteria => {
        this.addOrder(column, OrderDirection.DESC);
        return this;
    };

    /**
     * Add column order ASC
     *
     * @param column
     *            Column
     */
	addOrderByAsc = (column : SelectableType) : Criteria => {
        this.addOrder(column, OrderDirection.ASC);
        return this;
    };

    /**
     * Get order for a column. Return null if no order is set
     *
     * @param column
     *            column
     * @return Order
     */
	getOrder = (column : SelectableType) : Order => {
	    let columnSelectable = Selectable.create(column);

		for (let i = 0; i < this.listOrder.length; i++) {
			let order = this.listOrder[i];
            if (order.column == columnSelectable) {
                return order;
            }
        }

        return null;
    };

    /**
     * Get number of ordered columns
     *
     * @return int
     */
	getOrderCount = () : number => {
        return this.listOrder.length;
    };

    /**
     * Remove order for column.
     *
     * @param column
     *            column
     * @return Order removed
     */
	removeOrder = (column : SelectableType) : Order => {
		let columnSelectable = Selectable.create(column);

        for (let i = 0; i < this.listOrder.length; i++) {
            let order = this.listOrder[i];
            if (order.column == columnSelectable) {
                this.listOrder.splice(i, 1);
                return order;
            }
        }

        return null;
    };

    /**
     * Remove all orders criterion
     *
     * @return List of removed orders
     */
	removeListOrder = () : Array<Order> => {
        let listRemovedOrder = this.listOrder;
        this.listOrder = [];

        return listRemovedOrder;
    };

    /**
     * Get number of criterion
     */
	getCriteriaCount = () : number => {
        return this.listCriterion.length;
    };

    // -----------------------------------------------------------------------
    // Usefull methods
    // -----------------------------------------------------------------------

    /**
     * Indicate whether the column is used in the criteria as an restrictions or in an order.
     *
     * @param column
     *            column
     * @return boolean
     */
	isUsed = (column : SelectableType) : boolean => {
        return this.getCriterion(column) != null || this.getOrder(column) != null;
    };

    /**
     * Add a criterion
     *
     * @param criterion
     *            criterion
     * @return Criteria
     */
	add = (criterion : Criterion) : Criteria => {
        if (criterion == undefined || criterion == null) {
            return this;
        }

        // Add criterion to list
        this.listCriterion.push(criterion);

        return this;
    };

    /**
     * Add order
     *
     * @param column
     *            column
     * @param orderDirection
     *            order direction
     * @return Criteria
     */
	addOrder = (column: SelectableType, orderDirection: OrderDirection) : Criteria => {
        if (column == undefined) {
            return this;
        }

        // Add order to list
        this.listOrder.push(new Order(column, orderDirection));

        return this;
    };

    /**
     * Add column selection
     * todo ajout ...args
     * @param columns
     * @return
     */
	addSelect = (args : SelectableType[]) : Criteria => {
        if (args.length == 0)
            return this;

        for (let i = 0; i < args.length; i++) {
            this.listSelect.push(Selectable.create(args[i]));
        }

        return this;
    };

    /**
     * Add column group By
     * todo ajout ...args
     * @param columns
     * @return
     */
	addGroupBy = (args : SelectableType[]) : Criteria => {
        if (args.length == 0)
            return this;

        for (let i = 0; i < args.length; i++) {
            this.listGroupBy.push(Selectable.create(args[i]));
        }

        return this;
    };

    /**
     * Add crition to having statement
     * todo ajout ...args
     * @param critrons
     * @return
     */
	addHaving = (args : Criterion[]) : Criteria => {
        if (args.length == 0)
            return this;

        for (let i = 0; i < args.length; i++) {
            this.listHaving.push(args[i]);
        }

        return this;
    }

};

