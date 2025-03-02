
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Utensils, Columns, Eye, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="animate-slide-up">
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/e89218ce-4e43-4e91-ba9e-80dfa195d803.png" 
                  alt="Sharmers Menus" 
                  className="h-24 mx-auto"
                />
              </div>
              <span className="inline-block bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm font-medium mb-5">
                Restaurant Menu Management
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
                Create and manage beautiful menus for your restaurant
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                A simple, elegant solution for restaurant owners to organize their menu offerings
                and create a delightful dining experience.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-6 h-auto rounded-lg text-lg font-medium">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 h-auto rounded-lg text-lg font-medium dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to manage your menu
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Feast gives you all the tools to create, organize, and update your restaurant menu with ease.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 animate-slide-up shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Restaurant Profile</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create a detailed profile for your restaurant including cuisine type, location, and contact information.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 animate-slide-up shadow-sm hover:shadow-md transition-shadow delay-100">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Columns className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Menu Organization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Organize your menu into customizable sections like appetizers, main courses, and desserts.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 animate-slide-up shadow-sm hover:shadow-md transition-shadow delay-200">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Menu Preview</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Preview how your menu will look to customers before publishing it to ensure perfection.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 animate-slide-up shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-time Updates</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Easily update item availability, prices, or descriptions in real-time as your menu evolves.
                </p>
              </div>
              
              <div className="md:col-span-2 lg:col-span-2 bg-orange-50 dark:bg-gray-800 rounded-xl p-8 animate-slide-up shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Ready to get started?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 md:mb-0">
                      Join hundreds of restaurant owners who trust Feast to manage their menus.
                    </p>
                  </div>
                  <Link to="/register">
                    <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                      Create Free Account <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Get your restaurant menu up and running in three simple steps.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center animate-slide-up">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-2xl font-bold text-brand-orange">1</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Create Your Account</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sign up for a free account and set up your restaurant profile with all the essential details.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center animate-slide-up delay-100">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-2xl font-bold text-brand-orange">2</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Build Your Menu</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Add menu sections and items with descriptions, prices, images, and dietary information.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center animate-slide-up delay-200">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-2xl font-bold text-brand-orange">3</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Preview & Manage</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See how your menu looks and make updates anytime as your offerings change.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/register">
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
