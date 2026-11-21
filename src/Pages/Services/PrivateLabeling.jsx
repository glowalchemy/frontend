import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaStar } from 'react-icons/fa';

const PrivateLabeling = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/services" className="inline-flex items-center text-brand-primary hover:text-brand-primary-hover mb-6">
                    <FaArrowLeft className="mr-2" />
                    Back to Services
                </Link>

                <h1 className="text-4xl font-bold text-brand-ink mb-6">Private Labeling</h1>

                <div className="prose max-w-none">
                    <p className="text-brand-muted mb-6 text-lg">
                        Transform your vision into a market-ready product with our comprehensive private labeling services. 
                        We help you create your own brand identity with complete end-to-end solutions.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">What We Offer</h2>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Custom formulation development</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Packaging design and branding</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Regulatory compliance support</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Quality assurance and testing</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Flexible minimum order quantities</span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-primary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Premium Quality</h3>
                            <p className="text-brand-muted text-sm">Using only the finest ingredients and materials</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-primary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Fast Turnaround</h3>
                            <p className="text-brand-muted text-sm">Quick production and delivery timelines</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-primary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Expert Support</h3>
                            <p className="text-brand-muted text-sm">Dedicated team to guide you through the process</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-primary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Competitive Pricing</h3>
                            <p className="text-brand-muted text-sm">Best value for your investment</p>
                        </div>
                    </div>

                    <div className="bg-brand-surface-muted p-6 rounded-lg mt-8">
                        <h3 className="font-semibold text-brand-ink mb-3">Ready to Start Your Brand?</h3>
                        <p className="text-brand-muted mb-4">Contact us today to discuss your private labeling needs.</p>
                        <Link to="/contact" className="inline-block bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-primary-hover">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateLabeling;
