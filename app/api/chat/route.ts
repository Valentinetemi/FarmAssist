import { NextRequest, NextResponse } from 'next/server'

const farmingAdvice: Record<string, string> = {
  planting: 'For optimal planting, consider your local climate and soil type. Plant during the rainy season for best results. Start with quality seeds and ensure proper spacing.',
  pest: 'Common pests include armyworms and leaf beetles. Identify the pest first, then use appropriate organic or chemical controls. Neem oil is effective for many insects.',
  weather: 'Monitor rainfall patterns and temperatures. Plan irrigation during dry seasons. Heavy rains can cause crop diseases, so ensure good drainage.',
  market: 'Current market prices vary by region. Check local markets for recent trends. Consider storing crops when prices are low and selling during peak seasons.',
  fertilizer: 'Soil testing helps determine nutrient needs. Use balanced fertilizers (NPK) for most crops. Organic manure improves soil structure and fertility.',
  supplies: 'Visit local agricultural centers for quality inputs. Consider cooperatives for bulk purchases. Check expiration dates and product authenticity.',
}

export async function POST(request: NextRequest) {
  try {
    const { messages, language } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user' },
        { status: 400 }
      )
    }

    const userInput = lastMessage.content.toLowerCase()

    // Simple keyword matching for responses
    let response = ''

    if (userInput.includes('plant') || userInput.includes('planting')) {
      response = farmingAdvice.planting
    } else if (userInput.includes('pest') || userInput.includes('bug') || userInput.includes('disease')) {
      response = farmingAdvice.pest
    } else if (userInput.includes('weather') || userInput.includes('rain') || userInput.includes('temperature')) {
      response = farmingAdvice.weather
    } else if (userInput.includes('market') || userInput.includes('price') || userInput.includes('sell')) {
      response = farmingAdvice.market
    } else if (userInput.includes('fertilizer') || userInput.includes('soil') || userInput.includes('nutrient')) {
      response = farmingAdvice.fertilizer
    } else if (userInput.includes('supply') || userInput.includes('input') || userInput.includes('tool')) {
      response = farmingAdvice.supplies
    } else {
      response =
        'I can help you with farming advice. Ask me about planting schedules, pest control, weather tips, market prices, fertilizers, or where to find supplies. What would you like to know?'
    }

    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
