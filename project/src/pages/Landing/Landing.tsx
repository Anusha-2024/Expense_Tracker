import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  Smartphone, 
  BarChart3, 
  PieChart, 
  Wallet,
  ArrowRight,
  CheckCircle,
  Target,
  Calendar
} from 'lucide-react';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const Landing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animated background particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6', '#EC4899'];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0F172A');
      gradient.addColorStop(0.5, '#1E293B');
      gradient.addColorStop(1, '#334155');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      // Add floating financial icons
      const time = Date.now() * 0.001;
      const iconPositions = [
        { x: canvas.width * 0.1, y: canvas.height * 0.2 },
        { x: canvas.width * 0.9, y: canvas.height * 0.3 },
        { x: canvas.width * 0.2, y: canvas.height * 0.8 },
        { x: canvas.width * 0.8, y: canvas.height * 0.7 },
      ];

      iconPositions.forEach((pos, index) => {
        const offsetY = Math.sin(time + index) * 10;
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = colors[index % colors.length];
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        const icons = ['$', '₿', '€', '£'];
        ctx.fillText(icons[index], pos.x, pos.y + offsetY);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Get detailed insights into your spending patterns with beautiful charts and reports."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely. We never share your information."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Friendly",
      description: "Access your finances anywhere with our responsive design that works on all devices."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Budget Goals",
      description: "Set spending limits and track your progress towards financial goals."
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Category Tracking",
      description: "Organize expenses by categories and see where your money goes."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar View",
      description: "View your transactions in a beautiful calendar interface."
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: -1 }}
      />

      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ExpenseTrack</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Take Control of Your
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {" "}Finances
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Track expenses, set budgets, and achieve your financial goals with our 
              intelligent expense tracking platform.
            </p>
            
            <div className="flex justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-4">
                  Track Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary-400" />
                <span>Secure & private</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to manage your money
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make expense tracking simple and insightful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4 text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ExpenseTrack</span>
              </div>
              <p className="text-gray-400">
                The smart way to track your expenses and achieve your financial goals.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Security
                  </button>
                </li>
                <li>
                  <a 
                    href="https://play.google.com/store/apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Mobile App
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    API
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://blog.expensetrack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href="https://careers.expensetrack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:krianusha09@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="hover:text-white transition-colors">
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://status.expensetrack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Expense Track by Anusha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;