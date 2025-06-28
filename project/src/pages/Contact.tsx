import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about bus routes, schedules, or need assistance? 
            We're here to help make your rural transportation experience better.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone Support</h3>
                    <p className="text-gray-600 mt-1">1-800-RURAL-BUS</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 6AM-8PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email Support</h3>
                    <p className="text-gray-600 mt-1">support@ruralbus.com</p>
                    <p className="text-sm text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Office Location</h3>
                    <p className="text-gray-600 mt-1">
                      123 Main Street<br />
                      Rural County, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Emergency Contact</h3>
                    <p className="text-gray-600 mt-1">911 or 1-800-EMERGENCY</p>
                    <p className="text-sm text-gray-500">For bus breakdowns or safety issues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Help</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Bus is late?</h3>
                  <p className="text-gray-600 text-sm">Check our live tracker for real-time updates</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Route questions?</h3>
                  <p className="text-gray-600 text-sm">Visit our schedule page for complete route information</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Lost items?</h3>
                  <p className="text-gray-600 text-sm">Call our support line for lost and found assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Send us a Message</h2>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <p className="text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Service Hours */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Customer Service Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-900">Monday - Friday:</span>
              <br />
              <span className="text-blue-700">6:00 AM - 8:00 PM</span>
            </div>
            <div>
              <span className="font-medium text-blue-900">Saturday:</span>
              <br />
              <span className="text-blue-700">8:00 AM - 6:00 PM</span>
            </div>
            <div>
              <span className="font-medium text-blue-900">Sunday:</span>
              <br />
              <span className="text-blue-700">10:00 AM - 4:00 PM</span>
            </div>
            <div>
              <span className="font-medium text-blue-900">Emergency:</span>
              <br />
              <span className="text-blue-700">24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;