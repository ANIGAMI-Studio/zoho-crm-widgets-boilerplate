"use client"

import { useEffect, useState } from "react"

// Extend window object to include ZOHO
declare global {
  interface Window {
    ZOHO: {
      embeddedApp: {
        on: (event: string, callback: (data: any) => void) => void
        init: () => void
      }
    }
  }
}

export default function Home() {
  const [crmData, setCrmData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Function to load Zoho SDK
    const loadZohoSDK = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if SDK is already loaded
        if (window.ZOHO) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Zoho SDK'))
        document.head.appendChild(script)
      })
    }

    // Initialize Zoho CRM integration
    const initializeZohoCRM = async () => {
      try {
        await loadZohoSDK()
        
        if (window.ZOHO) {
          console.log('Initializing Zoho CRM SDK...')
          
          // Subscribe to the EmbeddedApp onPageLoad event
          window.ZOHO.embeddedApp.on("PageLoad", function(data) {
            console.log('Zoho CRM PageLoad data:', data)
            setCrmData(data)
          })

          // Initialize the widget
          window.ZOHO.embeddedApp.init()
        }
      } catch (error) {
        console.error('Error initializing Zoho CRM:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeZohoCRM()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Zoho CRM SDK...</h2>
          <p className="text-gray-500 mt-2">Connecting to CRM...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hello World! 👋
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to your Zoho CRM Widget built with Next.js
        </p>
        
        {/* Zoho CRM Connection Status */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
          <h3 className="font-semibold text-gray-700 mb-2">Zoho CRM Status</h3>
          {crmData ? (
            <div className="text-left space-y-1">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Connected to Zoho CRM</span>
              </div>
              {crmData.Entity && (
                <p className="text-sm text-gray-500">
                  <strong>Entity:</strong> {crmData.Entity}
                </p>
              )}
              {crmData.EntityId && (
                <p className="text-sm text-gray-500">
                  <strong>Record ID:</strong> {crmData.EntityId}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Demo Mode (not in Zoho CRM)</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <p>🚀 Next.js 15</p>
          <p>⚡ TypeScript</p>
          <p>🎨 Tailwind CSS</p>
          <p>📱 Zoho CRM Integration</p>
        </div>
      </div>
    </main>
  )
}
