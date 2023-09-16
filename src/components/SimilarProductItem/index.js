// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, imageUrl, brand, rating, price} = productDetails

  return (
    <li className="similar-product-con">
      <img src={imageUrl} className="img" alt={`similar product ${title}`} />
      <p className="title">{title}</p>
      <p className="brand">by {brand}</p>
      <div className="price-con">
        <p className="price-letter">Rs {price}/-</p>
        <div className="rating-con">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
