import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaStar } from 'react-icons/fa';

const ThirdPartyManufacturing = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/services" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
                    <FaArrowLeft className="mr-2" />
                    Back to Services
                </Link>

                <h1 className="text-4xl font-bold text-gray-900 mb-6">Third-Party Cosmetic Manufacturing</h1>

                <div className="prose max-w-none">
                    <p className="text-gray-600 mb-6 text-lg">
                        We manufacture high-quality cosmetic products for established brands, retailers, and distributors. 
                        Our state-of-the-art facility ensures consistent quality and timely delivery.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Manufacturing Capabilities</h2>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-gray-600">Skincare products (creams, lotions, serums)</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-gray-600">Hair care products (shampoos, conditioners, treatments)</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-gray-600">Body care products (body wash, scrubs, oils)</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-gray-600">Makeup and cosmetics</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-gray-600">Natural and organic formulations</span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Quality Standards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaStar className="text-green-600 text-2xl mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">GMP Certified</h3>
                            <p className="text-gray-600 text-sm">Good Manufacturing Practices compliance</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaStar className="text-green-600 text-2xl mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">ISO Standards</h3>
                            <p className="text-gray-600 text-sm">International quality management systems</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaStar className="text-green-600 text-2xl mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">FDA Compliant</h3>
                            <p className="text-gray-600 text-sm">Meeting regulatory requirements</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaStar className="text-green-600 text-2xl mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Cruelty-Free</h3>
                            <p className="text-gray-600 text-sm">Ethical manufacturing practices</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg mt-8">
                        <h3 className="font-semibold text-gray-900 mb-3">Partner With Us</h3>
                        <p className="text-gray-600 mb-4">Let's discuss how we can help manufacture your cosmetic products.</p>
                        <Link to="/contact" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThirdPartyManufacturing;
