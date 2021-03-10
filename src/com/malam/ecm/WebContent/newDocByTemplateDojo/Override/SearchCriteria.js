/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2020
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang"
], function(array, declare, lang) {
	
	/**
	 * Constructs a search criteria object.
	 * 
	 * @param properties
	 *            The properties for the search criteria object. The properties can be any of the public fields as defined
	 *            below.
	 * @name ecm.model.SearchCriterion
	 * @class Represents a set of criteria that is joined by AND/OR in a search.
	 * @augments ecm.model._ModelObject
	 * @since 3.0.8
	 */
	var SearchCriteria = declare("ecm.model.SearchCriteria", null, {
		/** @lends ecm.model.SearchCriteria.prototype */
		
		/**
		 * Indicates whether a search will match all of the search criteria.
		 */
		anded: true,
		
		/**
		 * An array of {@link ecm.model.SearchCriterion} objects.
		 */
		criteria: null,
		
		/**
		 * @private
		 */
		constructor: function(args) {
			lang.mixin(this, args);
			if (!this.criteria)
				this.criteria = [];
		},
		
		clone: function() {
			return new SearchCriteria({
				anded: this.anded,
				criteria: array.map(this.criteria, "return item.clone();")
			});
		},
		
		/**
		 * Returns true if the other object is equal to this one.
		 * 
		 * @param searchCriteria
		 *            A {@link ecm.model.SearchCriteria} object
		 */
		equals: function(searchCriteria) {
			var sc = searchCriteria;
			if (!sc)
				return false;
			
			if (this.anded != sc.anded)
				return false;
			
			if (this.criteria instanceof Array != sc.criteria instanceof Array)
				return false;
			
			if (this.criteria instanceof Array) {
				if (this.criteria.length != sc.criteria.length)
					return false;
				
				if (!array.every(this.criteria, "return item.equals(this[index]);", sc.criteria))
					return false;
			}
			
			return true;
		}
	});
	
	/**
	 * @private
	 */
	SearchCriteria.instanceOf = function(json) {
		return json && "anded" in json && "searchCriteria" in json;
	};
	
	return SearchCriteria;
});
