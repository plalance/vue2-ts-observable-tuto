'use strict';

/**
 * Criteria function enum
 */
export enum CriteriaFunctionEnum {
    /** Count */
    COUNT = "count",

    /** Sum */
    SUM = "sum",

    /** Average */
    AVG = "avg",

    /** Min */
    MIN = "min",

    /** Max */
    MAX = "max",

    /** Coalesce */
    COALESCE = "coalesce",

    /** Concact */
    CONCAT = "concat",

    /** Lower case */
    LOWER = "lower",

    /** Upper case */
    UPPER = "upper",

    /** Cast to String */
    CAST_STRING = "cast"
}
