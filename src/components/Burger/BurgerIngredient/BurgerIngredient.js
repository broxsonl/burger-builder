import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './BurgerIngredient.module.css';

class BurgerIngredient extends Component {
  render() {
    let ingredient = null;
  
    if (this.props.type === 'bread-bottom') ingredient = <div className={classes.BreadBottom}></div>;
    if (this.props.type === 'bread-top') ingredient = (
      <div className={classes.BreadTop}>
        <div className={classes.Seeds1}></div>;
        <div className={classes.Seeds2}></div>;
      </div>
    );
  
    if (this.props.type === 'bacon') ingredient = <div className={classes.Bacon}></div>;
  
    if (this.props.type === 'salad') ingredient = <div className={classes.Salad}></div>;

    if (this.props.type === 'cheese') ingredient = <div className={classes.Cheese}></div>;
    
    if (this.props.type === 'meat') ingredient = <div className={classes.Meat}></div>;
  
  
  
    return ingredient;
  }
}

BurgerIngredient.propTypes = {
  type: PropTypes.string.isRequired
}

export default BurgerIngredient;