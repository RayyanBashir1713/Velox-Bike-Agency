import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint - GET /api/
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: "VeloX Bike Agency API",
        version: "1.0.0",
        endpoints: [
          "GET /api/ - API info",
          "POST /api/contact - Contact form submission",
          "GET /api/bikes - Get all bikes",
          "POST /api/newsletter - Newsletter subscription"
        ]
      }))
    }

    // Contact form submission - POST /api/contact
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      
      if (!body.name || !body.email || !body.message) {
        return handleCORS(NextResponse.json(
          { error: "Name, email, and message are required" }, 
          { status: 400 }
        ))
      }

      const contactEntry = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        message: body.message,
        timestamp: new Date(),
        status: 'new'
      }

      await db.collection('contacts').insertOne(contactEntry)
      
      return handleCORS(NextResponse.json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        id: contactEntry.id
      }))
    }

    // Get all contact messages - GET /api/contact
    if (route === '/contact' && method === 'GET') {
      const contacts = await db.collection('contacts')
        .find({})
        .sort({ timestamp: -1 })
        .limit(100)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedContacts = contacts.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedContacts))
    }

    // Bikes endpoint - GET /api/bikes
    if (route === '/bikes' && method === 'GET') {
      const bikes = [
        {
          id: 1,
          name: "VeloX Pro",
          type: "Road Bike",
          price: 2899,
          image: "https://images.unsplash.com/photo-1569951825078-7f1e908fee0e",
          features: ["Carbon Frame", "22-Speed", "Disc Brakes"],
          description: "Professional racing bike with aerodynamic design",
          specifications: {
            weight: "8.5 kg",
            frame: "Carbon Fiber",
            gears: "22-Speed Shimano",
            brakes: "Hydraulic Disc",
            wheels: "700c Carbon"
          },
          inStock: true
        },
        {
          id: 2,
          name: "Urban Explorer",
          type: "Electric Bike",
          price: 3499,
          image: "https://images.unsplash.com/photo-1569951827666-a7ad30bbe8c8",
          features: ["Electric Motor", "50mi Range", "Smart Display"],
          description: "Perfect for city commuting with electric assistance",
          specifications: {
            weight: "22 kg",
            motor: "250W Hub Motor",
            battery: "48V 14Ah",
            range: "50 miles",
            charging: "4-6 hours"
          },
          inStock: true
        },
        {
          id: 3,
          name: "Mountain Beast",
          type: "Mountain Bike",
          price: 2199,
          image: "https://images.unsplash.com/photo-1605737710291-98fe72919667",
          features: ["Full Suspension", "29-inch Wheels", "All-Terrain"],
          description: "Conquer any trail with this rugged mountain bike",
          specifications: {
            weight: "14 kg",
            suspension: "Full Suspension",
            wheels: "29-inch",
            gears: "21-Speed",
            brakes: "Mechanical Disc"
          },
          inStock: true
        },
        {
          id: 4,
          name: "Speed Demon",
          type: "Racing Bike",
          price: 4299,
          image: "https://images.unsplash.com/photo-1704902629275-445ade658dc8",
          features: ["Ultra Light", "Aerodynamic", "Pro Components"],
          description: "Ultimate performance for competitive cycling",
          specifications: {
            weight: "7.2 kg",
            frame: "Ultra-Light Carbon",
            gears: "Electronic Shifting",
            brakes: "Carbon Disc",
            wheels: "Aero Carbon Wheels"
          },
          inStock: true
        }
      ]

      return handleCORS(NextResponse.json(bikes))
    }

    // Get specific bike - GET /api/bikes/:id
    if (route.startsWith('/bikes/') && method === 'GET') {
      const bikeId = parseInt(route.split('/')[2])
      
      // This would typically fetch from database
      const bikes = [
        {
          id: 1,
          name: "VeloX Pro",
          type: "Road Bike",
          price: 2899,
          image: "https://images.unsplash.com/photo-1569951825078-7f1e908fee0e",
          features: ["Carbon Frame", "22-Speed", "Disc Brakes"],
          description: "Professional racing bike with aerodynamic design"
        }
        // ... other bikes
      ]
      
      const bike = bikes.find(b => b.id === bikeId)
      
      if (!bike) {
        return handleCORS(NextResponse.json(
          { error: "Bike not found" }, 
          { status: 404 }
        ))
      }
      
      return handleCORS(NextResponse.json(bike))
    }

    // Newsletter subscription - POST /api/newsletter
    if (route === '/newsletter' && method === 'POST') {
      const body = await request.json()
      
      if (!body.email) {
        return handleCORS(NextResponse.json(
          { error: "Email is required" }, 
          { status: 400 }
        ))
      }

      const subscription = {
        id: uuidv4(),
        email: body.email,
        timestamp: new Date(),
        active: true
      }

      await db.collection('newsletter_subscriptions').insertOne(subscription)
      
      return handleCORS(NextResponse.json({
        success: true,
        message: "Successfully subscribed to newsletter!",
        id: subscription.id
      }))
    }

    // Bike booking/inquiry - POST /api/booking
    if (route === '/booking' && method === 'POST') {
      const body = await request.json()
      
      if (!body.bikeId || !body.customerName || !body.customerEmail) {
        return handleCORS(NextResponse.json(
          { error: "Bike ID, customer name, and email are required" }, 
          { status: 400 }
        ))
      }

      const booking = {
        id: uuidv4(),
        bikeId: body.bikeId,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || '',
        message: body.message || '',
        timestamp: new Date(),
        status: 'pending'
      }

      await db.collection('bookings').insertOne(booking)
      
      return handleCORS(NextResponse.json({
        success: true,
        message: "Booking inquiry submitted successfully! We'll contact you soon.",
        bookingId: booking.id
      }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute