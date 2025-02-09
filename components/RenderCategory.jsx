import Carousel from "react-multi-carousel";
import Link from "next/link";
import { responsive_second } from "./ResponsiveFeatures";

export default function RenderCategories({ category }) {
  if (!category) {
    return <div className="text-center text-gray-500">No categories available</div>;
  }

  const subCategories =
    category.subSubSubCategories || category.subSubCategories || category.subCategories || [];

  if (subCategories.length === 0) {
    return <div className="text-center text-gray-500">No subcategories available</div>;
  }

  return (
    <>
      <div className="hidden md:grid grid-cols-6 gap-y-4">
        {subCategories.map((subCategory, index) => (
          <div key={index} className="">
            <Link href={`/category/${encodeURIComponent(subCategory.name)}/${subCategory._id}`}>
              <img
                src={subCategory.image || "/placeholder.svg"}
                alt={`Category img ${index + 1}`}
                width={200}
                height={200}
                className="object-cover w-full h-auto cursor-pointer"
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="md:hidden">
        <Carousel responsive={responsive_second} arrows={false}>
          {subCategories.map((subCategory, index) => (
            <div key={index} className="flex justify-center mx-2">
              <Link href={`/category/${encodeURIComponent(subCategory.name)}/${subCategory._id}`}>
                <img
                  src={subCategory.image || "/placeholder.svg"}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto rounded cursor-pointer"
                />
              </Link>
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
}