import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBox, FaIndustry, FaHandshake } from 'react-icons/fa';

const Services = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We offer comprehensive cosmetic manufacturing solutions tailored to your brand's unique needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Private Labeling */}
                    <Link to="/services/private-labeling" className="group">
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                                <FaBox className="text-3xl text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Private Labeling</h2>
                            <p className="text-gray-600 mb-6">
                                Create your own brand with our private labeling services. We handle everything from formulation to packaging.
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-800">
                                Learn More <FaArrowRight className="ml-2" />
                            </div>
                        </div>
                    </Link>

                    {/* Third-Party Cosmetic Manufacturing */}
                    <Link to="/services/third-party-manufacturing" className="group">
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                                <FaIndustry className="text-3xl text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Manufacturing</h2>
                            <p className="text-gray-600 mb-6">
                                We manufacture cosmetic products for other brands with strict quality control and competitive pricing.
                            </p>
                            <div className="flex items-center text-green-600 font-semibold group-hover:text-green-800">
                                Learn More <FaArrowRight className="ml-2" />
                            </div>
                        </div>
                    </Link>

                    {/* Contract Manufacturing */}
                    <Link to="/services/contract-manufacturing" className="group">
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                                <FaHandshake className="text-3xl text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Manufacturing</h2>
                            <p className="text-gray-600 mb-6">
                                Partner with us for large-scale contract manufacturing with flexible production capacity and timelines.
                            </p>
                            <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-800">
                                Learn More <FaArrowRight className="ml-2" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Services;
