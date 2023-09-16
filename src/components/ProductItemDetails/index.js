// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productsData: {},
    similarProductsList: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  localData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    totalReviews: data.total_reviews,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
  })

  getProductData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const res = await fetch(apiUrl, options)
    if (res.ok === true) {
      const fetchedData = await res.json()
      console.log(fetchedData)
      const updatedData = this.localData(fetchedData)

      const updatedSimilarProductsData = fetchedData.similar_products.map(
        each => this.localData(each),
      )

      this.setState({
        productsData: updatedData,
        similarProductsList: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (res.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoader = () => {
    ;<div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {productsData, quantity, similarProductsList} = this.state
    const {
      availability,
      brand,
      rating,
      price,
      title,
      totalReviews,
      imageUrl,
      description,
    } = productsData

    return (
      <div className="success-view-container">
        <div className="details-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="content-con">
            <h1 className="content-title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-reviews-count">
              <div className="rating-con">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="available-con">
              <p className="text">Available:</p>
              <p className="val">{availability}</p>
            </div>
            <div className="brand-con">
              <p className="text">Brand:</p>
              <p className="val">{brand}</p>
            </div>
            <hr />
            <div className="quantity-con">
              <button
                type="button"
                className="decrement-btn"
                onClick={this.onDecrementQty}
                data-testid="minus"
              >
                <BsDashSquare className="decrement-icon" />
              </button>
              <p className="qty">{quantity}</p>
              <button
                type="button"
                className="increment-btn"
                onClick={this.onIncrementQty}
                data-testid="plus"
              >
                <BsPlusSquare className="increment-icon" />
              </button>
            </div>
            <button type="button" className="btn add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products">Similar Products</h1>
        <ul className="ul-list">
          {similarProductsList.map(eachProd => (
            <SimilarProductItem key={eachProd.id} productDetails={eachProd} />
          ))}
        </ul>
      </div>
    )
  }

  onDecrementQty = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQty = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  getProductsDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.getProductsDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
