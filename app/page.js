'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { BikeModel } from '@/components/bike-model'
import { EnhancedBikeModel } from '@/components/enhanced-bike-model'
import { ParallaxSection } from '@/components/parallax-section'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { GradientCard } from '@/components/ui/gradient-card'
import { 
  Menu, 
  X, 
  ArrowRight, 
  Star, 
  Zap, 
  Shield, 
  Users,
  Mail,
  Phone,
  MapPin,
  ChevronDown
} from 'lucide-react'

const bikes = [
  {
    id: 1,
    name: "VeloX Pro",
    type: "Road Bike",
    price: "$2,899",
    image: "https://images.unsplash.com/photo-1569951825078-7f1e908fee0e",
    features: ["Carbon Frame", "22-Speed", "Disc Brakes"],
    description: "Professional racing bike with aerodynamic design"
  },
  {
    id: 2,
    name: "Urban Explorer",
    type: "Electric Bike",
    price: "$3,499",
    image: "https://images.unsplash.com/photo-1569951827666-a7ad30bbe8c8",
    features: ["Electric Motor", "50mi Range", "Smart Display"],
    description: "Perfect for city commuting with electric assistance"
  },
  {
    id: 3,
    name: "Mountain Beast",
    type: "Mountain Bike",
    price: "$2,199",
    image: "https://images.unsplash.com/photo-1605737710291-98fe72919667",
    features: ["Full Suspension", "29-inch Wheels", "All-Terrain"],
    description: "Conquer any trail with this rugged mountain bike"
  },
  {
    id: 4,
    name: "Speed Demon",
    type: "Racing Bike",
    price: "$4,299",
    image: "https://images.unsplash.com/photo-1704902629275-445ade658dc8",
    features: ["Ultra Light", "Aerodynamic", "Pro Components"],
    description: "Ultimate performance for competitive cycling"
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Professional Cyclist",
    content: "The VeloX Pro transformed my racing experience. The carbon frame is incredibly light yet durable.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1603993751398-f1b97d5f9552"
  },
  {
    name: "Mike Chen",
    role: "Daily Commuter",
    content: "Urban Explorer makes my daily commute effortless. The electric motor is a game-changer.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1569951825078-7f1e908fee0e"
  }
]

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedBike, setSelectedBike] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Message sent successfully!')
        setFormData({ name: '', email: '', message: '' })
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
          >
            VeloX
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {['Home', 'Bikes', 'Showcase', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-background border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-4 space-y-4">
                {['Home', 'Bikes', 'Showcase', 'Contact'].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ x: 10 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background z-0" />
        
        <ParallaxSection offset={scrollY * 0.5}>
          <div className="container mx-auto px-4 text-center z-10 relative">
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Future of
              <span className="text-primary block">Cycling</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-muted-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Experience cutting-edge bike technology with our premium collection of road, mountain, and electric bikes.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Button size="lg" className="group">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                View 3D Showcase
              </Button>
            </motion.div>
          </div>
        </ParallaxSection>

        {/* 3D Hero Bike */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-40 md:opacity-70">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 2, 6]} />
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <EnhancedBikeModel 
                position={[0, -1, 0]} 
                rotation={[0, Math.PI / 4, 0]}
                scale={[1.2, 1.2, 1.2]}
                bikeType="road"
                onInteraction={(type) => console.log('Bike interaction:', type)}
              />
            </Suspense>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={0.8}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose VeloX?</h2>
            <p className="text-xl text-muted-foreground">Premium quality meets innovative technology</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Electric Power",
                description: "Advanced electric motors with long-lasting batteries for effortless rides."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Premium Build",
                description: "Carbon fiber frames and professional-grade components for maximum performance."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Expert Support",
                description: "Professional consultation and lifetime support from our cycling experts."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-primary mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bikes Collection */}
      <section id="bikes" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Our Premium Collection</h2>
            <p className="text-xl text-muted-foreground">Discover bikes crafted for every adventure</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bikes.map((bike, index) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <GradientCard gradient="primary" className="overflow-hidden group cursor-pointer h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                      {bike.type}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{bike.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{bike.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bike.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs bg-secondary/50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{bike.price}</span>
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details
                      </Button>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 3D Showcase */}
      <section id="showcase" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">3D Interactive Showcase</h2>
            <p className="text-xl text-muted-foreground">Experience our bikes in stunning 3D detail</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-[500px]">
                <div className="w-full h-full">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 2, 8]} />
                    <ambientLight intensity={0.4} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
                    <Environment preset="warehouse" />
                    <Suspense fallback={null}>
                      <BikeModel 
                        position={[0, -2, 0]} 
                        rotation={[0, selectedBike * Math.PI / 2, 0]}
                        scale={[1.5, 1.5, 1.5]}
                      />
                    </Suspense>
                    <OrbitControls 
                      enableZoom={true} 
                      enablePan={false} 
                      autoRotate={false}
                      minDistance={3}
                      maxDistance={15}
                    />
                  </Canvas>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-6">Select Model</h3>
              {bikes.map((bike, index) => (
                <motion.div
                  key={bike.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedBike === index 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedBike(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold">{bike.name}</h4>
                      <p className="text-sm text-muted-foreground">{bike.type}</p>
                      <p className="text-primary font-bold">{bike.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">What Our Riders Say</h2>
            <p className="text-xl text-muted-foreground">Real experiences from our satisfied customers</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">Ready to find your perfect bike? Let's talk!</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {[
                  { icon: <MapPin />, title: "Address", content: "123 Bike Street, Cycling City, CC 12345" },
                  { icon: <Phone />, title: "Phone", content: "+1 (555) 123-4567" },
                  { icon: <Mail />, title: "Email", content: "info@velox-bikes.com" }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-primary">{contact.icon}</div>
                    <div>
                      <h4 className="font-semibold">{contact.title}</h4>
                      <p className="text-muted-foreground">{contact.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Store Hours</h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: 11:00 AM - 5:00 PM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">VeloX</h3>
              <p className="text-muted-foreground">
                Premium bikes for the modern cyclist. Experience the future of cycling with our innovative designs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {['Home', 'Bikes', 'Showcase', 'Contact'].map((link) => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="block text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2">
                {['Road Bikes', 'Mountain Bikes', 'Electric Bikes', 'Racing Bikes'].map((category) => (
                  <a key={category} href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                    {category}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="space-y-2">
                {['Instagram', 'Twitter', 'Facebook', 'YouTube'].map((social) => (
                  <a key={social} href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 VeloX. All rights reserved. Designed for the future of cycling.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}