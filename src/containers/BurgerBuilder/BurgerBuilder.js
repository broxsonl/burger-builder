import React, { Component} from 'react';

import axios from '../../axios-orders';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount () {
    console.log(this.props)
    axios.get('https://burger-builder-d9692-default-rtdb.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data })
      })
      .catch((error) => {
        this.setState({ error: true });
      })
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map( igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, cur) => {
        return sum + cur;
      }, 0);
  
      this.setState( { purchaseable: sum > 0 });
  };

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    });

    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];

    if (oldCount <= 0) return;

    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };

    updatedIngredients[type] = updatedCount;
    const priceDifference = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDifference;

    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    });

    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    const queryParams = [];

    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push(encodeURIComponent(`price=${this.state.totalPrice}`))
    const queryString = queryParams.join('&');

    this.props.history.push({
      pathname: '/checkout',  // moves to the checkout route. ezpz
      search: `?${queryString}`,
    });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (this.state.ingredients) {
      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />

      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls 
            disabled={disabledInfo}
            purchaseable={this.state.purchaseable}
            price={this.state.totalPrice}
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);