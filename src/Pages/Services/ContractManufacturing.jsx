import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaStar } from 'react-icons/fa';

const ContractManufacturing = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/services" className="inline-flex items-center text-brand-secondary hover:text-brand-primary-hover mb-6">
                    <FaArrowLeft className="mr-2" />
                    Back to Services
                </Link>

                <h1 className="text-4xl font-bold text-brand-ink mb-6">Contract Manufacturing</h1>

                <div className="prose max-w-none">
                    <p className="text-brand-muted mb-6 text-lg">
                        Scale your production with our contract manufacturing services. We offer flexible capacity, 
                        competitive pricing, and reliable delivery for large-scale cosmetic production.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Contract Manufacturing Benefits</h2>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Scalable production capacity</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Cost-effective large-scale production</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Advanced manufacturing technology</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">Supply chain management</span>
                        </li>
                        <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            <span className="text-brand-muted">On-time delivery guarantee</span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Production Capabilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-secondary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Large Batch Production</h3>
                            <p className="text-brand-muted text-sm">Capable of producing thousands of units per batch</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-secondary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Multiple Lines</h3>
                            <p className="text-brand-muted text-sm">Simultaneous production of different products</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-secondary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Quality Control</h3>
                            <p className="text-brand-muted text-sm">Rigorous testing at every production stage</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaStar className="text-brand-secondary text-2xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Flexible Scheduling</h3>
                            <p className="text-brand-muted text-sm">Adapt to your production timeline needs</p>
                        </div>
                    </div>

                    <div className="bg-brand-surface-muted p-6 rounded-lg mt-8">
                        <h3 className="font-semibold text-brand-ink mb-3">Start Your Contract Manufacturing</h3>
                        <p className="text-brand-muted mb-4">Contact us to discuss your large-scale production requirements.</p>
                        <Link to="/contact" className="inline-block bg-brand-secondary text-white px-6 py-3 rounded-lg hover:bg-brand-primary-hover">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractManufacturing;
