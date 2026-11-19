import React from 'react';
import { FaCalendar, FaUser, FaTag } from 'react-icons/fa';

const Blog = () => {
    const blogPosts = [
        {
            id: 1,
            title: "The Future of Natural Cosmetics",
            excerpt: "Exploring the latest trends in natural and organic cosmetic formulations...",
            author: "Dr. Sarah Johnson",
            date: "2024-01-15",
            category: "Industry Trends",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"
        },
        {
            id: 2,
            title: "Private Labeling vs White Labeling",
            excerpt: "Understanding the key differences between private and white labeling in cosmetics...",
            author: "Michael Chen",
            date: "2024-01-10",
            category: "Business",
            image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
        },
        {
            id: 3,
            title: "Sustainable Packaging Solutions",
            excerpt: "How eco-friendly packaging is revolutionizing the cosmetic industry...",
            author: "Emma Williams",
            date: "2024-01-05",
            category: "Sustainability",
            image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400"
        },
        {
            id: 4,
            title: "Quality Control in Cosmetic Manufacturing",
            excerpt: "Best practices for ensuring product quality and safety in production...",
            author: "Dr. Robert Kim",
            date: "2024-01-01",
            category: "Manufacturing",
            image: "https://images.unsplash.com/photo-1556228720-195a672e8285?w=400"
        },
        {
            id: 5,
            title: "Building Your Cosmetic Brand",
            excerpt: "A complete guide to launching a successful cosmetic brand from scratch...",
            author: "Lisa Anderson",
            date: "2023-12-28",
            category: "Branding",
            image: "https://images.unsplash.com/photo-1596445837567-443a04f5d8b0?w=400"
        },
        {
            id: 6,
            title: "Regulatory Compliance in Cosmetics",
            excerpt: "Understanding FDA and international regulations for cosmetic products...",
            author: "James Miller",
            date: "2023-12-20",
            category: "Compliance",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400"
        }
    ];

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Stay updated with the latest news, trends, and insights from the cosmetic industry
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="h-48 overflow-hidden">
                                <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    <span className="flex items-center">
                                        <FaTag className="mr-1" />
                                        {post.category}
                                    </span>
                                    <span className="flex items-center">
                                        <FaCalendar className="mr-1" />
                                        {new Date(post.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaUser className="mr-2" />
                                    {post.author}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
