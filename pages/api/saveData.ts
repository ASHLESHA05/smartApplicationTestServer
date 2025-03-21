import { NextApiRequest, NextApiResponse } from "next"
import { MongoClient } from "mongodb"

// MongoDB connection URI
const uri = process.env.MONGODB_URI as string

// MongoDB database and collection names
const dbName = "smart_appliances_db"
const collectionName = "users"

interface Data {
  email: string
  water: number
  energy: {
    lights: { count: number; consumption: number }
    fan: { count: number; consumption: number }
    heater: { count: number; consumption: number }
  }
  waste: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    if (req.method === "POST") {
      // Handle POST request (save data)
      const { email, water, energy, waste }: Data = req.body

      // Validate required fields
      if (!email || !water || !energy || !waste) {
        return res.status(400).json({ error: "Missing required fields" })
      }

      // Upsert (update or insert) the user data
      await collection.updateOne(
        { email }, // Filter by email
        { $set: { water, energy, waste } }, // Data to update or insert
        { upsert: true } // Create if not exists
      )

      res.status(200).json({ message: "Data saved successfully" })
    } else if (req.method === "GET") {
      // Handle GET request (fetch data)
      const { email } = req.query // Get email from query params

      // Validate email
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required as a query parameter" })
      }

      // Fetch user data by email
      const userData = await collection.findOne({ email })

      if (!userData) {
        return res.status(404).json({ error: "User not found" })
      }

      res.status(200).json(userData)
    } else {
      res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("Error in API route:", error)
    res.status(500).json({ error: "Internal server error" })
  } finally {
    await client.close() // Close the connection
  }
}