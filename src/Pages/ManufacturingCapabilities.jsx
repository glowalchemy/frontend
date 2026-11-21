import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaIndustry, FaFlask, FaBox, FaCogs, FaCheckCircle } from 'react-icons/fa';

const ManufacturingCapabilities = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/about" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
                    <FaArrowLeft className="mr-2" />
                    Back to About Us
                </Link>

                <h1 className="text-4xl font-bold text-brand-ink mb-6">Our Manufacturing Capabilities</h1>

                <div className="prose max-w-none">
                    <p className="text-brand-muted mb-6 text-lg">
                        Our state-of-the-art manufacturing facility is equipped with the latest technology and staffed 
                        by experienced professionals, enabling us to produce a wide range of cosmetic products with 
                        exceptional quality and efficiency.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Production Lines</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaFlask className="text-green-600 text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Skincare Production</h3>
                            <p className="text-brand-muted text-sm">Creams, lotions, serums, gels, and more</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaBox className="text-green-600 text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Hair Care Production</h3>
                            <p className="text-brand-muted text-sm">Shampoos, conditioners, hair masks, treatments</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaIndustry className="text-green-600 text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Body Care Production</h3>
                            <p className="text-brand-muted text-sm">Body wash, scrubs, lotions, oils</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <FaCogs className="text-green-600 text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Makeup Production</h3>
                            <p className="text-brand-muted text-sm">Foundations, lipsticks, eyeshadows, powders</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Capacity & Scale</h2>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted"><strong>Production Capacity:</strong> Up to 100,000 units per day</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted"><strong>Batch Sizes:</strong> Flexible from 1,000 to 50,000 units</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted"><strong>Production Lines:</strong> 8 dedicated manufacturing lines</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted"><strong>Lead Time:</strong> 2-4 weeks for standard orders</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted"><strong>Rush Orders:</strong> Expedited production available</span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Quality Assurance</h2>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">In-house laboratory for testing and quality control</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Microbial testing on every batch</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Stability testing and shelf-life verification</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Raw material quality inspection</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Final product quality verification</span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Certifications</h2>
                    <div className="bg-brand-surface-muted p-6 rounded-lg mb-6">
                        <ul className="space-y-2">
                            <li className="text-brand-muted">✓ GMP (Good Manufacturing Practices) Certified</li>
                            <li className="text-brand-muted">✓ ISO 9001:2015 Quality Management</li>
                            <li className="text-brand-muted">✓ ISO 22716:2007 Cosmetic GMP</li>
                            <li className="text-brand-muted">✓ FDA Compliant Manufacturing</li>
                            <li className="text-brand-muted">✓ Ecocert (Organic Certification)</li>
                        </ul>
                    </div>

                    <div className="bg-brand-surface-muted p-6 rounded-lg mt-8">
                        <h3 className="font-semibold text-brand-ink mb-3">Discuss Your Manufacturing Needs</h3>
                        <p className="text-brand-muted mb-4">Contact us to learn how our capabilities can meet your production requirements.</p>
                        <Link to="/contact" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManufacturingCapabilities;
