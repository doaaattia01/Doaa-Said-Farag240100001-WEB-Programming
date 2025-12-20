// Data Store
const properties = [
  {
      id: 1,
      title: "Modern Suburban Villa",
      price: "$850,000",
      address: "123 Maple Drive, Beverly Hills",
      beds: 4,
      baths: 3,
      sqft: 2500,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Sale"
  },
  {
      id: 2,
      title: "Downtown Luxury Penthouse",
      price: "$1,200,000",
      address: "450 Skyline Ave, New York",
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Sale"
  },
  {
      id: 3,
      title: "Cozy Countryside Cottage",
      price: "$450,000",
      address: "789 Pine Lane, Vermont",
      beds: 2,
      baths: 2,
      sqft: 1200,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Sale"
  },
  {
      id: 4,
      title: "Modern Minimalist Home",
      price: "$3,500/mo",
      address: "22 Silicon Valley Blvd, CA",
      beds: 3,
      baths: 2.5,
      sqft: 2100,
      image: "https://images.unsplash.com/photo-1600596542815-27bfef402399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Rent"
  },
  {
      id: 5,
      title: "Seaside Retreat",
      price: "$2,100,000",
      address: "101 Ocean View, Malibu",
      beds: 5,
      baths: 4,
      sqft: 3800,
      image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Sale"
  },
  {
      id: 6,
      title: "Urban Loft Studio",
      price: "$2,200/mo",
      address: "88 Art District, Chicago",
      beds: 1,
      baths: 1,
      sqft: 800,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Rent"
  }
];

// Page Components
const pages = {
  home: `
      <div class="relative bg-gray-900 h-[600px] flex items-center justify-center fade-in">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" class="absolute inset-0 w-full h-full object-cover opacity-40">
          <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">Find Your Dream Home Today</h1>
              <p class="text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">Discover the perfect property that fits your lifestyle. From cozy apartments to luxury estates, we have it all.</p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onclick="navigateTo('properties')" class="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-md font-semibold transition shadow-lg">Browse Properties</button>
                  <button onclick="navigateTo('contact')" class="bg-white hover:bg-gray-100 text-gray-900 text-lg px-8 py-3 rounded-md font-semibold transition shadow-lg">Contact Agent</button>
              </div>
          </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-in">
          <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <p class="text-gray-600 max-w-2xl mx-auto">We provide a complete service for the sale, purchase, or rental of real estate. We have been operating for more than 10 years.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                  <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                      <i class="fa-solid fa-medal"></i>
                  </div>
                  <h3 class="text-xl font-bold mb-3">Top Rated</h3>
                  <p class="text-gray-500">Rated #1 in customer satisfaction for 3 years running. We put our clients first.</p>
              </div>
              <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                  <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                      <i class="fa-solid fa-users"></i>
                  </div>
                  <h3 class="text-xl font-bold mb-3">Experienced Agents</h3>
                  <p class="text-gray-500">Our team consists of over 50 professionals with deep market knowledge.</p>
              </div>
              <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                  <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                      <i class="fa-solid fa-hand-holding-dollar"></i>
                  </div>
                  <h3 class="text-xl font-bold mb-3">Best Price Guarantee</h3>
                  <p class="text-gray-500">Whether buying or selling, we ensure you get the best market value.</p>
              </div>
          </div>
      </div>

      <div class="bg-gray-100 py-16 fade-in">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between items-end mb-8">
                  <div>
                      <h2 class="text-3xl font-bold text-gray-900">Featured Properties</h2>
                      <p class="text-gray-600 mt-2">Handpicked selection of our best properties.</p>
                  </div>
                  <button onclick="navigateTo('properties')" class="hidden sm:inline-block text-blue-600 font-semibold hover:text-blue-700">View All <i class="fa-solid fa-arrow-right ml-1"></i></button>
              </div>
              <div id="featured-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <!-- Featured items injected via JS -->
              </div>
                  <div class="mt-8 text-center sm:hidden">
                  <button onclick="navigateTo('properties')" class="text-blue-600 font-semibold hover:text-blue-700">View All Properties <i class="fa-solid fa-arrow-right ml-1"></i></button>
              </div>
          </div>
      </div>
  `,
  properties: `
      <div class="bg-blue-600 py-12 fade-in">
          <div class="max-w-5xl mx-auto px-4 text-center">
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">Our Properties</h1>
              <p class="text-blue-100 max-w-2xl mx-auto">Explore our list of properties available for sale and rent.</p>
          </div>
      </div>
      <div class="max-w-5xl mx-auto px-4 py-12 fade-in">
          <div id="properties-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- All properties injected via JS -->
          </div>
      </div>
  `,
  about: `
      <div class="bg-white fade-in">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                      <h1 class="text-4xl font-bold text-gray-900 mb-6">About DreamHome Realty</h1>
                      <p class="text-lg text-gray-600 mb-6">Founded in 2025, DreamHome Realty was born from a simple belief: everyone deserves a place they can truly call home. We aren't just selling houses; we are helping you build a future.</p>
                      <p class="text-gray-600 mb-6">Our team of dedicated professionals works tirelessly to navigate the complex real estate market for you. Whether you are a first-time homebuyer, a seasoned investor, or looking to rent your first studio, we approach every client with the same level of integrity and enthusiasm.</p>
                      <div class="grid grid-cols-2 gap-6 mt-8">
                          <div class="border-l-4 border-blue-600 pl-4">
                              <div class="text-3xl font-bold text-gray-900">500+</div>
                              <div class="text-sm text-gray-500">Properties Sold</div>
                          </div>
                          <div class="border-l-4 border-blue-600 pl-4">
                              <div class="text-3xl font-bold text-gray-900">98%</div>
                              <div class="text-sm text-gray-500">Client Satisfaction</div>
                          </div>
                      </div>
                  </div>
                  <div class="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                      <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="absolute inset-0 w-full h-full object-cover">
                  </div>
              </div>
      </div>
  `,
  contact: `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-in">
          <div class="text-center mb-16">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
              <p class="text-lg text-gray-600 max-w-2xl mx-auto">Have questions? Ready to start your search? Get in touch with us today.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <!-- Contact Form -->
              <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <form onsubmit="handleContactSubmit(event)">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                          <div>
                              <label class="block text-gray-700 font-medium mb-2">First Name</label>
                              <input type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="John">
                          </div>
                          <div>
                              <label class="block text-gray-700 font-medium mb-2">Last Name</label>
                              <input type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Doe">
                          </div>
                      </div>
                      <div class="mb-6">
                          <label class="block text-gray-700 font-medium mb-2">Email Address</label>
                          <input type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="john@example.com">
                      </div>
                      <div class="mb-6">
                          <label class="block text-gray-700 font-medium mb-2">Subject</label>
                          <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition">
                              <option>I want to buy a property</option>
                              <option>I want to sell a property</option>
                              <option>I'm looking to rent</option>
                              <option>General Inquiry</option>
                          </select>
                      </div>
                      <div class="mb-6">
                          <label class="block text-gray-700 font-medium mb-2">Message</label>
                          <textarea rows="4" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Tell us how we can help..."></textarea>
                      </div>
                      <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md">Send Message</button>
                  </form>
              </div>

              <!-- Contact Info -->
              <div class="flex flex-col justify-between">
                  <div class="bg-blue-50 p-8 rounded-xl">
                      <h3 class="text-xl font-bold text-gray-900 mb-6">Office Information</h3>
                      <div class="space-y-6">
                          <div class="flex items-start">
                              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                                  <i class="fa-solid fa-location-dot"></i>
                              </div>
                              <div>
                                  <p class="font-bold text-gray-900">Headquarters</p>
                                  <p class="text-gray-600">123 Innovation Dr, Tech City, ST 12345</p>
                              </div>
                          </div>
                          <div class="flex items-start">
                              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                                  <i class="fa-solid fa-phone"></i>
                              </div>
                              <div>
                                  <p class="font-bold text-gray-900">Phone</p>
                                  <p class="text-gray-600">(555) 123-4567</p>
                                  <p class="text-sm text-gray-500">Mon-Fri 9am-6pm</p>
                              </div>
                          </div>
                          <div class="flex items-start">
                              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
                                  <i class="fa-solid fa-envelope"></i>
                              </div>
                              <div>
                                  <p class="font-bold text-gray-900">Email</p>
                                  <p class="text-gray-600">hello@dreamhome.com</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `
};

// Functions
function createPropertyCard(property) {
  return `
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden property-card transition-all duration-300 flex flex-col h-full">
          <div class="relative h-64">
              <img src="${property.image}" alt="${property.title}" class="w-full h-full object-cover">
              <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800">
                  ${property.type}
              </div>
              <div class="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-lg font-bold">
                  ${property.price}
              </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-900 mb-2">${property.title}</h3>
              <p class="text-gray-500 text-sm mb-4"><i class="fa-solid fa-location-dot mr-1"></i> ${property.address}</p>
              
              <div class="grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-4 mb-4">
                  <div class="text-center">
                      <p class="font-bold text-gray-800">${property.beds}</p>
                      <p class="text-xs text-gray-500">Beds</p>
                  </div>
                  <div class="text-center border-l border-gray-100">
                      <p class="font-bold text-gray-800">${property.baths}</p>
                      <p class="text-xs text-gray-500">Baths</p>
                  </div>
                  <div class="text-center border-l border-gray-100">
                      <p class="font-bold text-gray-800">${property.sqft}</p>
                      <p class="text-xs text-gray-500">Sqft</p>
                  </div>
              </div>
              
              <button onclick="navigateTo('contact')" class="w-full mt-auto border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded transition">View Details</button>
          </div>
      </div>
  `;
}

function renderProperties(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let displayProps = properties;
  if (limit) {
      displayProps = properties.slice(0, limit);
  }
  
  container.innerHTML = displayProps.map(createPropertyCard).join('');
}

function navigateTo(pageId) {
  // Scroll to top
  window.scrollTo(0, 0);

  // Update Content
  const app = document.getElementById('app-content');
  app.innerHTML = pages[pageId];

  // Update Nav State
  document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
  });
  const activeLink = document.getElementById(`nav-${pageId}`);
  if (activeLink) activeLink.classList.add('active');

  // Page specific init
  if (pageId === 'home') {
      renderProperties('featured-grid', 3);
  } else if (pageId === 'properties') {
      renderProperties('properties-grid');
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  // In a real app, you would send data to a server here.
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;
  
  btn.innerText = 'Message Sent!';
  btn.classList.add('bg-green-600', 'hover:bg-green-700');
  btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
  
  setTimeout(() => {
      e.target.reset();
      btn.innerText = originalText;
      btn.classList.remove('bg-green-600', 'hover:bg-green-700');
      btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
      alert("Thank you! An agent will contact you shortly.");
  }, 1000);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('home');
});
