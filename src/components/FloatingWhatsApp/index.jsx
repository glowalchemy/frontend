import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '917359230538';
const MESSAGE = encodeURIComponent('Hi GlowAlchemy! I would like to know more about your products.');

const FloatingWhatsApp = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with GlowAlchemy on WhatsApp"
    className="ga-whatsapp fixed bottom-24 right-4 z-[900] flex items-center justify-center rounded-full text-white md:bottom-6 md:right-6"
    style={{ width: '52px', height: '52px' }}
  >
    <FaWhatsapp className="text-[28px]" aria-hidden="true" />
  </a>
);

export default FloatingWhatsApp;
