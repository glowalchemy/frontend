import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaAward, FaUsers, FaGlobe, FaLeaf } from 'react-icons/fa';

const CompanyProfile = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/about" className="inline-flex items-center text-brand-primary hover:text-brand-primary-hover mb-6">
                    <FaArrowLeft className="mr-2" />
                    Back to About Us
                </Link>

                <h1 className="text-4xl font-bold text-brand-ink mb-6">Company Profile</h1>

                <div className="prose max-w-none">
                    <p className="text-brand-muted mb-6 text-lg">
                        GlowAlchemy is a leading cosmetic manufacturing company dedicated to producing high-quality, 
                        innovative beauty and personal care products. With years of experience in the industry, we have 
                        established ourselves as a trusted partner for brands worldwide.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Our Mission</h2>
                    <p className="text-brand-muted mb-6">
                        To provide exceptional cosmetic manufacturing solutions that exceed customer expectations through 
                        innovation, quality, and sustainable practices. We are committed to helping brands create products 
                        that make a positive impact on people's lives.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Our Vision</h2>
                    <p className="text-brand-muted mb-6">
                        To become the global leader in cosmetic manufacturing, known for our commitment to quality, 
                        innovation, and environmental responsibility. We envision a future where every product we create 
                        contributes to a more sustainable and beautiful world.
                    </p>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Key Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaAward className="text-brand-primary text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Established 2014</h3>
                            <p className="text-brand-muted text-sm">Over 10 years of industry experience</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaUsers className="text-brand-primary text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">500+ Employees</h3>
                            <p className="text-brand-muted text-sm">Dedicated team of experts</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaGlobe className="text-brand-primary text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Global Reach</h3>
                            <p className="text-brand-muted text-sm">Serving clients in 20+ countries</p>
                        </div>
                        <div className="bg-brand-surface-muted p-6 rounded-lg">
                            <FaLeaf className="text-brand-primary text-3xl mb-3" />
                            <h3 className="font-semibold text-brand-ink mb-2">Eco-Friendly</h3>
                            <p className="text-brand-muted text-sm">Sustainable manufacturing practices</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-brand-ink mt-8 mb-4">Our Values</h2>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                            <span className="text-brand-primary mr-3">✓</span>
                            <span className="text-brand-muted"><strong>Quality First:</strong> We never compromise on quality</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-brand-primary mr-3">✓</span>
                            <span className="text-brand-muted"><strong>Innovation:</strong> Constantly improving and evolving</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-brand-primary mr-3">✓</span>
                            <span className="text-brand-muted"><strong>Integrity:</strong> Honest and transparent in all dealings</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-brand-primary mr-3">✓</span>
                            <span className="text-brand-muted"><strong>Sustainability:</strong> Environmentally responsible practices</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-brand-primary mr-3">✓</span>
                            <span className="text-brand-muted"><strong>Customer Focus:</strong> Your success is our success</span>
                        </li>
                    </ul>

                    <div className="bg-brand-surface-muted p-6 rounded-lg mt-8">
                        <h3 className="font-semibold text-brand-ink mb-3">Partner With Us</h3>
                        <p className="text-brand-muted mb-4">Discover how GlowAlchemy can help bring your cosmetic vision to life.</p>
                        <Link to="/contact" className="inline-block bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-primary-hover">
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
