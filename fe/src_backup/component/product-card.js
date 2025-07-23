import { Link } from "react-router-dom";


const ProductCard = ({ name, img, imgHover, id, price }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    return (
        <div className="border border-gray-300 relative overflow-hidden w-full">

            <div className="relative w-full h-[400px] overflow-hidden group">
                <img
                    src={"/img/" + img}
                    alt={name}
                    className="w-full h-full object-cover absolute transition-transform duration-500 group-hover:translate-x-[-20%]"
                />
                <img
                    src={"/img/" + imgHover}
                    alt={name + " Hover"}
                    className="w-full h-full object-cover absolute opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:translate-x-0"
                />
                <div className={"group-hover:top-0 absolute w-full h-full -top-[30rem] left-0 bg-slate-500/60 flex items-center justify-center transition-all duration-300"}>
                    <Link className={"border-2 border-white font-bold px-8 py-4 bg-white text-black transition-all duration-300"} to={`/product/${id}`}>
                        Xem chi tiết
                    </Link>

                </div>
            </div>
            <div className="info text-center p-4">
                <Link className="product-name no-underline text-black" to={`/product/${id}`}>
                    {name}
                </Link>
                <div className="giatien font-bold mt-2">{formatPrice(price)}</div>
            </div>
        </div>
    )
}

export default ProductCard;