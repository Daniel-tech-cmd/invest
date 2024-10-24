"use client";

const products = [
  {
    title: "Stocks",
    description:
      "“It's a great idea to manage your money with Payyed Investors. Our stock investment options are fair, and you can conduct transactions seamlessly!”",
    imageUrl: "/stock.jpg", // Add your image URL
  },
  {
    title: "Options",
    description:
      "“Be bullish on the stocks you believe in and bearish on those you don't. With Payyed, the choice is yours!”",
    imageUrl: "/option.jpg", // Add your image URL
  },
  {
    title: "Livestock Farming",
    description:
      "“Investing in livestock is a rewarding opportunity. Payyed provides the best options for stable, long-term gains in farming ventures.”",
    imageUrl: "/livestock.jpg", // Add your image URL
  },
  {
    title: "Crop Investments",
    description:
      "“Grow your portfolio with Payyed by investing in high-demand crops. Our expert analysis ensures your farming investments flourish.”",
    imageUrl: "/crop.jpg", // Add your image URL
  },
];

const Products = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-300 mb-4">
          Our Products
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Explore diverse investment options with Payyed
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg">
              <div className="p-8 text-center">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {product.title}
                </h3>
                <p className="text-gray-600 italic mb-6">
                  {product.description}
                </p>
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="rounded-lg h-60 w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
