import React from 'react';
import { withRouter } from 'react-router-dom';

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.module.css';

const burger = (props) => {
  console.log(props)
  let transformedIngredients = Object.keys(props.ingredients)
    .map((igKey) => {
      return [...Array(props.ingredients[igKey])]
        .map((_, i) => {
          return <BurgerIngredient key={igKey + i} type={igKey} />;
        });
    })
    .reduce((arr, cur) => {
      return arr.concat(cur);
    }, []);
  
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
        {transformedIngredients.length ? transformedIngredients : <p>Please start adding ingredients!</p>}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default withRouter(burger);// using withRouter to wrap this component gives us access to state that the route has access to