import React, { useState } from 'react';
import Footer from '../components/Footer';
import authorImg from '../assets/author.png';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...props }) => (
  <label className={`block font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`} {...props}>
    {children}
  </label>
);

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

const About: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert('Message Sent! Thank you for your message.');

    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">

      {/* Author Info Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="flex justify-center">
            <img
              src={authorImg}
              alt="लेखक"
              className="rounded-xl shadow-lg w-72 h-auto object-cover border border-gray-200 dark:border-gray-700"
            />
          </div>
          <div className="md:col-span-2 space-y-4 text-gray-800 dark:text-gray-300 font-devanagari text-md leading-relaxed">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">लेखक परिचय</h2>
            <p><strong>जन्म:</strong> 16 जुलाई, 1950, गांव-बसेठ, जिला-अलवर (राजस्थान)</p>
            <p><strong>शिक्षा:</strong> एम.ए., एल.एल.बी., पीएच.डी.</p>
            <p><strong>सृजन:</strong> हिन्दी भाषा की विविध विधाओं में निरंतर सृजनरत।</p>
            <p><strong>प्रकाशित कृतियां:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>विमर्श: ‘पेट से ऊपर’, ‘सेवानिवृति पश्चात्’, ‘जीवन का अर्थशास्त्र’, ‘पास-पास’</li>
              <li>कविता संग्रह: ‘प्यारे प्रभु मिलन’, ‘जीवन सार’, ‘सुख सार’, ...</li>
              <li>नाटक, कहानी संग्रह, उपन्यास: अन्य कृतियाँ</li>
            </ul>
            <p><strong>संपादन:</strong> ‘नव वितान’ पाक्षिक हिन्दी अखबार</p>
            <p><strong>शोध:</strong> डॉ. एम.एल. छीपा के मार्गदर्शन में</p>
            <p><strong>सम्प्रति:</strong> राजस्थान लेखा सेवा से सेवानिवृत</p>
            <p><strong>आवास:</strong> जयपुर</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold font-devanagari text-gray-900 dark:text-white">संपर्क करें</h2>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md w-full flex items-center justify-center"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600 dark:text-gray-400">pyarelal50@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400">+91 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    13-B Bhagwati Nagar<br />
                    Kartarpura, Jaipur, Rajasthan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
