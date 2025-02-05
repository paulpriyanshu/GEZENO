import Carousel from "react-multi-carousel"
const responsiveProductCarousel = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1,
    },
  }
export default function CategorySection({ title, products }) {
    if (!Array.isArray(products) || products.length === 0) {
      return null
    }
  
    return (
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          {title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
        </h2>
        <Carousel
          swipeable={true}
          draggable={true}
          responsive={responsiveProductCarousel}
          infinite={false}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={300}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          itemClass="carousel-item-padding"
          className="pb-4"
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Carousel>
      </section>
    )
  }