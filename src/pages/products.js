import React from 'react';
import { StaticQuery } from 'gatsby';
import Layout from '../components/layout'

class Product extends React.Component {
    // constructor(){
    //     this.handleSubmit.bind(this);
    // }
    componentDidMount() {
        this.stripe = window.Stripe('pk_test_HxXiLMI30Caxr957HLOaUh0J00ufQA11kp');
    }
    handleSubmit(sku) {
        return e => {
            e.preventDefault();
            this.stripe.redirectToCheckout({
                items: [{ sku, quantity: 1 }],
                successUrl: 'http://localhost:8000/success',
                cancelUrl: 'http://localhost:8000/canceled',
            })
                .then(function (result) {
                    if (result.error) {
                        console.error(result.error.message);
                    }
                });
        }
    }
    render() {
        const { id, currency, price, name } = this.props;

        const priceFloat = (price / 100).toFixed(2);
        const formatedPrice = Intl.NumberFormat('en-US', { style: 'currency', currency: 'usd' }).format(priceFloat);
        return (
            <form onSubmit={this.handleSubmit(id)}>
                <h2>{name}({formatedPrice})</h2>
                <button type="submit">Buy now</button>
            </form>
        )
    }
}
export default () => (
    <StaticQuery
        query={graphql`
        {
            allStripeSku{
              edges{
                node{
                  id
                  currency
                  price
                  attributes {
                    name
                  }
                  image
                }
              }
            }
          }
        `}
        render={data =>
            <Layout>{data.allStripeSku.edges.map(({ node: sku }) => (
               <Product 
                id={sku.id}
                currency={sku.currency}
                price={sku.price}
                name={sku.attributes.name}
               /> 
            )
            )}</Layout>
        } />
)