import { useState, useEffect } from "react";

const Review = ({ product_id }) => {
    const [listReviews, setListReviews] = useState([]);
    const [content, setContent] = useState("");
    const [user, setUser] = useState(null); // Lưu thông tin người dùng

    // Lấy thông tin user từ email trong localStorage
    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            fetch(`http://localhost:3001/user/${userEmail}`)
                .then(res => res.json())
                .then(data => {
                    if (data.id) {
                        setUser(data);
                    } else {
                        setUser(null);
                    }
                })
                .catch(() => setUser(null));
        }
    }, []);

    // Fetch danh sách bình luận
    useEffect(() => {
        fetch(`http://localhost:3001/reviews/${product_id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setListReviews(data);
                } else {
                    console.error("Dữ liệu bình luận không hợp lệ:", data);
                    setListReviews([]);
                }
            })
            .catch(() => setListReviews([]));
    }, [product_id]);

    // Xử lý gửi bình luận
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Bạn cần đăng nhập để bình luận!");
            return;
        }

        const newReview = {
            product_id,
            user_id: user.id, // Lấy user_id từ API
            content
        };

        try {
            const res = await fetch("http://localhost:3001/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReview)
            });

            const result = await res.json();
            if (res.ok) {
                setListReviews([...listReviews, { ...newReview, updated_at: new Date().toISOString().split("T")[0] }]);
                setContent("");
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
        }
    };

    // Xử lý xóa bình luận
    const handleDelete = async (review) => {
        if (!user || user.id !== review.user_id) {
            alert("Bạn chỉ có thể xóa bình luận của chính mình!");
            return;
        }
    
        try {
            const res = await fetch(`http://localhost:3001/reviews/${review.product_id}/${review.user_id}`, {
                method: "DELETE",
            });
    
            const result = await res.json();
            if (res.ok) {
                // Chỉ xóa bình luận có ID tương ứng
                setListReviews(listReviews.filter((r) => r.id !== review.id));
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
        }
    };
    

    return (
        <div className="w-full p-10  mx-auto p-6 bg-white shadow-lg rounded-lg flex gap-6">
    {/* Danh sách bình luận (Bên trái) */}
    <div className="w-2/3">
        <h2 className="bg-gray-400 p-4 text-xl font-semibold text-center rounded-t-lg">
            Các bình luận về sản phẩm
        </h2>

        <div className="mt-4 space-y-4">
       {listReviews.map((review, index) => (
        <div key={review.id || `review-${index}`} className="border border-green-500 p-4 rounded-lg">
            <p className="flex justify-between">
                <b className="text-gray-900">User {review.user_id}</b>
                <span className="text-sm text-gray-500">
                    {new Date(review.updated_at).toLocaleDateString("vi")}
                </span>
            </p>
            <p className="text-gray-700">{review.content}</p>
            {user && user.id === review.user_id && (
                <button
                    onClick={() => handleDelete(review)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md mt-3 hover:bg-red-600 transition"
                >
                    Xóa
                </button>
            )}
        </div>
    ))}
</div>

    </div>

    {/* Form nhập bình luận (Bên phải) */}
    <div className="w-1/3 h-fit sticky top-12 self-start bg-gray-100 p-4 rounded-lg shadow-md">
        {user ? (
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-lg font-medium text-gray-700">
                        Nội dung
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="mt-2 w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gray-800 text-white py-2 rounded-md text-lg font-semibold hover:bg-blue-900 transition"
                >
                    Gửi bình luận
                </button>
            </form>
        ) : (
            <p className="text-red-500 text-center text-lg">
                Bạn cần{" "}
                <a href="/login" className="text-blue-500 underline">
                    đăng nhập
                </a>{" "}
                để bình luận.
            </p>
        )}
    </div>
</div>

    );
};

export default Review;
